import hmac
import json
import os
from functools import wraps

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from models import db, User, Product, Order

app = Flask(__name__)

# DATABASE: on Render (or any host) set DATABASE_URL to your Postgres address.
# With no DATABASE_URL it falls back to the local SQLite file, so local dev
# works exactly as before.
db_url = os.environ.get("DATABASE_URL", "sqlite:///lilamigos.db")
# Tell SQLAlchemy exactly which Postgres driver to use (psycopg2). Without this,
# newer SQLAlchemy versions look for a different driver (psycopg 3) and crash.
for prefix in ("postgres://", "postgresql://"):
    if db_url.startswith(prefix):
        db_url = "postgresql+psycopg2://" + db_url[len(prefix):]
        break
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True}   # survives idle DB connections
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# CORS: only your own website may call this API from a browser.
# Set FRONTEND_URL on the server, e.g. https://lilamigos.onrender.com
# (several addresses can be separated by commas). Locally, the Vite dev
# server is allowed automatically.
_frontends = [u.strip().rstrip("/") for u in os.environ.get("FRONTEND_URL", "").split(",") if u.strip()]
_allowed_origins = _frontends or ["http://localhost:5173", "http://127.0.0.1:5173"]
CORS(app, resources={r"/api/*": {"origins": _allowed_origins}})

db.init_app(app)

with app.app_context():
    db.create_all()


# ---------------------------------------------------------------------------
# AUTH
# ---------------------------------------------------------------------------

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    fullName = data.get("fullName", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not fullName or not email or not password:
        return jsonify({"status": 400, "message": "All fields are required."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"status": 409, "message": "An account with that email already exists."}), 409

    user = User(
        fullName=fullName,
        email=email,
        password=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"status": 200, "message": "Account created! You can now log in."})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"status": 401, "message": "Invalid email or password."}), 401

    return jsonify({"status": 200, "message": "Welcome back!", "user": user.to_dict()})


# ---------------------------------------------------------------------------
# PRODUCTS
# ---------------------------------------------------------------------------

@app.route("/api/products", methods=["GET"])
def get_products():
    category = request.args.get("category")  # e.g. ?category=frocks
    query = Product.query
    if category:
        query = query.filter_by(category=category)
    products = query.all()
    return jsonify({"status": 200, "products": [p.to_dict() for p in products]})


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
    # ProductDetail.jsx reads the body directly (no "status" wrapper), so we
    # return the plain object here and rely on the HTTP status code instead.
    return jsonify(product.to_dict())


# ---------------------------------------------------------------------------
# ORDERS / CHECKOUT
# ---------------------------------------------------------------------------

@app.route("/api/orders", methods=["POST"])
def create_order():
    """Place an order. The browser only says WHICH products and sizes it wants;
    prices and the total always come from our own database, never from the
    browser, so nobody can edit a price before checkout."""
    data = request.get_json(silent=True) or {}
    customer = data.get("customer") or {}
    raw_items = data.get("items") or []

    def clean(key):
        return str(customer.get(key) or "").strip()

    name, email = clean("name"), clean("email")
    address, city, zip_code = clean("address"), clean("city"), clean("zip")
    if not all([name, email, address, city, zip_code]) or "@" not in email:
        return jsonify({"status": 400, "message": "Please fill in all shipping details with a valid email."}), 400
    if not isinstance(raw_items, list) or not raw_items or len(raw_items) > 50:
        return jsonify({"status": 400, "message": "Your cart is empty."}), 400

    # Group identical product+size lines into quantities.
    lines = {}
    for item in raw_items:
        try:
            pid = int(item.get("id"))
        except (TypeError, ValueError, AttributeError):
            return jsonify({"status": 400, "message": "Something in your cart is invalid. Please re-add the items."}), 400
        size = str(item.get("size") or "")[:20]
        lines[(pid, size)] = lines.get((pid, size), 0) + 1

    products = {p.id: p for p in Product.query.filter(Product.id.in_({pid for pid, _ in lines})).all()}
    wanted = {}
    for (pid, _), qty in lines.items():
        wanted[pid] = wanted.get(pid, 0) + qty

    for pid, qty in wanted.items():
        product = products.get(pid)
        if product is None:
            return jsonify({"status": 400, "message": "One of the items in your cart is no longer available."}), 400
        if product.stock < qty:
            left = f"only {product.stock} left" if product.stock > 0 else "out of stock"
            return jsonify({"status": 409, "message": f'Sorry, "{product.name}" is {left}. Please update your cart.'}), 409

    saved_items, total = [], 0.0
    for (pid, size), qty in lines.items():
        product = products[pid]
        saved_items.append({"id": pid, "name": product.name, "size": size, "quantity": qty, "price": product.price})
        total += product.price * qty
    for pid, qty in wanted.items():
        products[pid].stock -= qty

    order = Order(
        customer_name=name,
        customer_email=email,
        address=address,
        city=city,
        zip_code=zip_code,
        items_json=json.dumps(saved_items),
        total=round(total, 2),
    )
    try:
        db.session.add(order)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return jsonify({"status": 500, "message": "Could not save your order. Please try again."}), 500

    return jsonify({"status": 200, "message": "Order placed!", "orderId": order.id, "total": order.total})


# ---------------------------------------------------------------------------
# ADMIN PASSWORD GATE
# ---------------------------------------------------------------------------
# The owner's password lives in an environment variable, never in the code.
#   Local:  export ADMIN_PASSWORD="something-long"   (Windows: set ADMIN_PASSWORD=...)
#   Render: add ADMIN_PASSWORD under Environment
# If it is not set, every admin route stays locked.

ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")


def _password_ok(candidate):
    if not ADMIN_PASSWORD or not candidate:
        return False
    return hmac.compare_digest(candidate.encode(), ADMIN_PASSWORD.encode())


def require_admin(view):
    @wraps(view)
    def wrapper(*args, **kwargs):
        if not ADMIN_PASSWORD:
            return jsonify({"status": 503, "message": "Admin access is not configured on the server."}), 503
        if not _password_ok(request.headers.get("X-Admin-Password", "")):
            return jsonify({"status": 401, "message": "Wrong or missing admin password."}), 401
        return view(*args, **kwargs)
    return wrapper


@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    if not ADMIN_PASSWORD:
        return jsonify({"status": 503, "message": "Admin access is not configured on the server."}), 503
    data = request.get_json(silent=True) or {}
    if not _password_ok(data.get("password", "")):
        return jsonify({"status": 401, "message": "Wrong password."}), 401
    return jsonify({"status": 200, "message": "Logged in."})


# ---------------------------------------------------------------------------
# ADMIN — PRODUCTS
# ---------------------------------------------------------------------------

@app.route("/api/admin/products", methods=["POST"])
@require_admin
def admin_create_product():
    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    category = data.get("category", "").strip()
    imageUrl = data.get("imageUrl", "").strip()

    if not name or not category or not imageUrl:
        return jsonify({"status": 400, "message": "Name, category, and image URL are required."}), 400

    try:
        price = float(data.get("price", 0))
        stock = int(data.get("stock", 0))
    except (TypeError, ValueError):
        return jsonify({"status": 400, "message": "Price and stock must be numbers."}), 400

    product = Product(
        name=name,
        price=price,
        imageUrl=imageUrl,
        category=category,
        description=data.get("description", ""),
        sizes=data.get("sizes", "0-3M,3-6M,6-12M,1-2Y"),
        stock=stock,
    )
    db.session.add(product)
    db.session.commit()

    return jsonify({"status": 200, "message": "Product added.", "product": product.to_dict()})


@app.route("/api/admin/products/<int:product_id>", methods=["PUT"])
@require_admin
def admin_update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"status": 404, "message": "Product not found."}), 404

    data = request.get_json(silent=True) or {}

    if "name" in data:
        product.name = data["name"].strip()
    if "category" in data:
        product.category = data["category"].strip()
    if "imageUrl" in data:
        product.imageUrl = data["imageUrl"].strip()
    if "description" in data:
        product.description = data["description"]
    if "sizes" in data:
        product.sizes = data["sizes"]
    if "price" in data:
        try:
            product.price = float(data["price"])
        except (TypeError, ValueError):
            return jsonify({"status": 400, "message": "Price must be a number."}), 400
    if "stock" in data:
        try:
            product.stock = int(data["stock"])
        except (TypeError, ValueError):
            return jsonify({"status": 400, "message": "Stock must be a whole number."}), 400

    db.session.commit()
    return jsonify({"status": 200, "message": "Product updated.", "product": product.to_dict()})


@app.route("/api/admin/products/<int:product_id>", methods=["DELETE"])
@require_admin
def admin_delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"status": 404, "message": "Product not found."}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"status": 200, "message": "Product deleted."})


# ---------------------------------------------------------------------------
# ADMIN — USERS / ORDERS
# ---------------------------------------------------------------------------

@app.route("/api/admin/users", methods=["GET"])
@require_admin
def admin_users():
    users = User.query.all()
    return jsonify({"status": 200, "users": [u.to_dict() for u in users]})


@app.route("/api/admin/orders", methods=["GET"])
@require_admin
def admin_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify({"status": 200, "orders": [o.to_dict() for o in orders]})


if __name__ == "__main__":
    # Local development only. On Render, gunicorn runs the app instead
    # (see README), so this block is never used in production.
    app.run(debug=True, port=5001)