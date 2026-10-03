# Lil Amigos — Backend

A Flask + SQLite API that matches the fetch() calls already written into your
frontend (LoginModal, ProductGrid, ProductDetail, AdminDashboard).

## Setup (do this once)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                  # creates lilamigos.db and adds sample products
```

## Run it (every time you work on the project)

```bash
export ADMIN_PASSWORD="choose-something-long"   # Windows: set ADMIN_PASSWORD=choose-something-long
python app.py
```

The server runs at `http://127.0.0.1:5001`, which is the exact address your
React components already call. Leave this running in one terminal, and run
`npm run dev` for the frontend in another.

Admin: open `/admin` on the frontend and log in with the `ADMIN_PASSWORD` you set above.
If `ADMIN_PASSWORD` is not set, all admin routes stay locked.

## Endpoints

| Method | Route                  | Used by                  |
|--------|-------------------------|---------------------------|
| POST   | /api/signup              | LoginModal.jsx            |
| POST   | /api/login                | LoginModal.jsx            |
| GET    | /api/products              | ProductGrid.jsx           |
| GET    | /api/products?category=X | (for CategoryPage, once wired up) |
| GET    | /api/products/<id>        | ProductDetail.jsx         |
| POST   | /api/orders                | Checkout.jsx (once wired up) |
| POST   | /api/admin/login            | AdminDashboard.jsx        |
| POST/PUT/DELETE | /api/admin/products[/id] | AdminDashboard.jsx (needs X-Admin-Password header) |
| GET    | /api/admin/users            | AdminDashboard.jsx (needs header) |
| GET    | /api/admin/orders           | AdminDashboard.jsx (needs header) |

## Notes / things to fix as you go

- **Passwords** are hashed with `werkzeug.security`, never stored in plain text.
- `Product.to_dict()` returns both `image` and `imageUrl` so neither
  ProductGrid nor ProductDetail breaks — but pick ONE field name in your
  frontend eventually and drop the other.
- There's no real session/login persistence yet (refreshing the page logs you
  out) — that's a good "if I have extra time" upgrade using Flask sessions or
  a JWT, but not required to finish the core project.
- No real payment integration — `/api/orders` just saves the order to the
  database, which is enough for a college/portfolio project. Actual
  Stripe/Razorpay integration is a stretch goal, not a requirement.


## Deploying to Render

**Start command:** `gunicorn app:app --workers 1 --threads 4`
**Build command:** `pip install -r requirements.txt`

Environment variables to set on the server:

| Name | Value |
|------|-------|
| `DATABASE_URL` | your Postgres connection string |
| `ADMIN_PASSWORD` | the owner's admin password (long!) |
| `FRONTEND_URL` | the live website address, e.g. `https://lilamigos.onrender.com` |

Tables are created automatically on first start. Do not commit `instance/`
or `*.db` (they hold local test customers and orders).
