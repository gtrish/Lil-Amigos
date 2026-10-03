# Lil Amigos — Backend

A Flask + SQLite API that matches the fetch() calls already written into your
frontend (LoginModal, ProductGrid, ProductDetail, AdminDashboard).

## Setup (do this once)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed.py                  # creates lilamigos.db and adds sample products + an admin user
```

## Run it (every time you work on the project)

```bash
python app.py
```

The server runs at `http://127.0.0.1:5001`, which is the exact address your
React components already call. Leave this running in one terminal, and run
`npm run dev` for the frontend in another.

Default admin login: `admin@lilamigos.co` / `admin123`

## Endpoints

| Method | Route                  | Used by                  |
|--------|-------------------------|---------------------------|
| POST   | /api/signup              | LoginModal.jsx            |
| POST   | /api/login                | LoginModal.jsx            |
| GET    | /api/products              | ProductGrid.jsx           |
| GET    | /api/products?category=X | (for CategoryPage, once wired up) |
| GET    | /api/products/<id>        | ProductDetail.jsx         |
| POST   | /api/orders                | Checkout.jsx (once wired up) |
| GET    | /api/admin/users            | AdminDashboard.jsx        |
| GET    | /api/admin/orders            | (future admin orders view) |

## Notes / things to fix as you go

- **Passwords** are hashed with `werkzeug.security`, never stored in plain text.
- `Product.to_dict()` returns both `image` and `imageUrl` so neither
  ProductGrid nor ProductDetail breaks — but pick ONE field name in your
  frontend eventually and drop the other.
- `CategoryPage.jsx` still imports `mockData` — swap it to
  `fetch('http://127.0.0.1:5001/api/products?category=' + categoryName)`.
- There's no real session/login persistence yet (refreshing the page logs you
  out) — that's a good "if I have extra time" upgrade using Flask sessions or
  a JWT, but not required to finish the core project.
- No real payment integration — `/api/orders` just saves the order to the
  database, which is enough for a college/portfolio project. Actual
  Stripe/Razorpay integration is a stretch goal, not a requirement.
