"""
Run this once to fill the database with sample products so the frontend
has something to display:

    python seed.py
"""

from app import app
from models import db, Product

SAMPLE_PRODUCTS = [
    {"name": "Pure Cotton Frock", "price": 800, "category": "frocks", "stock": 12,
     "imageUrl": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=400&auto=format&fit=crop",
     "description": "Super soft, breathable, and perfect for everyday little adventures."},
    {"name": "Floral Party Frock", "price": 950, "category": "frocks", "stock": 8,
     "imageUrl": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=400&auto=format&fit=crop",
     "description": "A twirl-worthy frock for birthdays and special days."},

    {"name": "Printed Nightsuit", "price": 950, "category": "nightsuits", "stock": 15,
     "imageUrl": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400&auto=format&fit=crop",
     "description": "Cozy, breathable cotton for a good night's sleep."},
    {"name": "Striped Nightsuit Set", "price": 890, "category": "nightsuits", "stock": 10,
     "imageUrl": "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=400&auto=format&fit=crop",
     "description": "Soft striped cotton, perfect for bedtime."},

    {"name": "Summer Co-ord Set", "price": 850, "category": "co-ord-sets", "stock": 9,
     "imageUrl": "https://images.unsplash.com/photo-1519457851944-0c69ffb6dc9c?q=80&w=400&auto=format&fit=crop",
     "description": "A matching top and bottom set for effortless style."},
    {"name": "Denim Co-ord Set", "price": 1100, "category": "co-ord-sets", "stock": 6,
     "imageUrl": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=400&auto=format&fit=crop",
     "description": "Durable denim, made for play."},

    {"name": "Bow Hair Clip Set", "price": 250, "category": "accessories", "stock": 20,
     "imageUrl": "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=400&auto=format&fit=crop",
     "description": "A pack of adorable bow clips."},
    {"name": "Soft Sun Hat", "price": 400, "category": "accessories", "stock": 14,
     "imageUrl": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=400&auto=format&fit=crop",
     "description": "Keeps little heads cool and shaded."},
]

with app.app_context():
    db.create_all()

    if Product.query.count() == 0:
        for p in SAMPLE_PRODUCTS:
            db.session.add(Product(**p))
        print(f"Added {len(SAMPLE_PRODUCTS)} products.")
    else:
        print("Products already exist, skipping.")

    db.session.commit()
    print("Done.")
