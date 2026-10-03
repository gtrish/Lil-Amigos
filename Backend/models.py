from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fullName = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # stored as a hash, never plain text
    is_admin = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {"id": self.id, "fullName": self.fullName, "email": self.email}


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    imageUrl = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(80), nullable=False)  # co-ord-sets | nightsuits | frocks | accessories
    description = db.Column(db.Text, default="")
    sizes = db.Column(db.String(120), default="0-3M,3-6M,6-12M,1-2Y")
    stock = db.Column(db.Integer, default=0, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "imageUrl": self.imageUrl,
            "category": self.category,
            "description": self.description,
            "sizes": self.sizes.split(","),
            "stock": self.stock,
        }


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(120))
    customer_email = db.Column(db.String(120))
    address = db.Column(db.String(255))
    city = db.Column(db.String(120))
    zip_code = db.Column(db.String(20))
    items_json = db.Column(db.Text)  # JSON string of the cart items at time of order
    total = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "customer_name": self.customer_name,
            "customer_email": self.customer_email,
            "address": self.address,
            "city": self.city,
            "zip": self.zip_code,
            "items": json.loads(self.items_json or "[]"),
            "total": self.total,
            "created_at": self.created_at.isoformat(),
        }
