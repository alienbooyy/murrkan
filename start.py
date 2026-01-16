#!/usr/bin/env python3
"""
Startup script for Restaurant Management System
This script initializes the database with sample data
"""
from backend.database import SessionLocal, init_db
from backend import models

def init_sample_data():
    """Initialize database with sample data"""
    print("Initializing database...")
    init_db()
    
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(models.Product).count() > 0:
        print("Database already has data. Skipping initialization.")
        db.close()
        return
    
    print("Adding sample products...")
    
    # Sample products
    products = [
        # Yemekler
        models.Product(name="Lahmacun", price=25.0, category="Yemek", printer_destination="oven", description="Geleneksel lahmacun"),
        models.Product(name="Pide", price=35.0, category="Yemek", printer_destination="oven", description="Kaşarlı pide"),
        models.Product(name="Kebap", price=75.0, category="Yemek", printer_destination="kitchen", description="Urfa kebap"),
        models.Product(name="Adana Kebap", price=70.0, category="Yemek", printer_destination="kitchen"),
        models.Product(name="Tavuk Şiş", price=55.0, category="Yemek", printer_destination="kitchen"),
        models.Product(name="Köfte", price=60.0, category="Yemek", printer_destination="kitchen"),
        models.Product(name="Pizza Margherita", price=45.0, category="Yemek", printer_destination="oven"),
        models.Product(name="Karışık Pizza", price=55.0, category="Yemek", printer_destination="oven"),
        
        # İçecekler
        models.Product(name="Çay", price=5.0, category="İçecek", printer_destination="kitchen"),
        models.Product(name="Türk Kahvesi", price=15.0, category="İçecek", printer_destination="kitchen"),
        models.Product(name="Ayran", price=8.0, category="İçecek", printer_destination="kitchen"),
        models.Product(name="Kola", price=12.0, category="İçecek", printer_destination="kitchen"),
        models.Product(name="Fanta", price=12.0, category="İçecek", printer_destination="kitchen"),
        models.Product(name="Su", price=5.0, category="İçecek", printer_destination="kitchen"),
        models.Product(name="Meyve Suyu", price=15.0, category="İçecek", printer_destination="kitchen"),
        
        # Tatlılar
        models.Product(name="Baklava", price=35.0, category="Tatlı", printer_destination="kitchen", description="Antep fıstıklı"),
        models.Product(name="Künefe", price=40.0, category="Tatlı", printer_destination="oven"),
        models.Product(name="Sütlaç", price=25.0, category="Tatlı", printer_destination="kitchen"),
        models.Product(name="Kazandibi", price=30.0, category="Tatlı", printer_destination="kitchen"),
        models.Product(name="Dondurma", price=20.0, category="Tatlı", printer_destination="kitchen"),
    ]
    
    for product in products:
        db.add(product)
    
    print("Adding sample ingredients...")
    
    # Sample ingredients
    ingredients = [
        models.Ingredient(name="Kıyma", unit="kg", stock_quantity=50.0, min_stock_level=10.0, cost_per_unit=120.0),
        models.Ingredient(name="Hamur", unit="adet", stock_quantity=100.0, min_stock_level=20.0, cost_per_unit=2.0),
        models.Ingredient(name="Domates", unit="kg", stock_quantity=30.0, min_stock_level=5.0, cost_per_unit=15.0),
        models.Ingredient(name="Biber", unit="kg", stock_quantity=20.0, min_stock_level=5.0, cost_per_unit=20.0),
        models.Ingredient(name="Soğan", unit="kg", stock_quantity=25.0, min_stock_level=5.0, cost_per_unit=8.0),
        models.Ingredient(name="Kaşar Peyniri", unit="kg", stock_quantity=15.0, min_stock_level=3.0, cost_per_unit=180.0),
        models.Ingredient(name="Fıstık", unit="kg", stock_quantity=5.0, min_stock_level=1.0, cost_per_unit=400.0),
        models.Ingredient(name="Tavuk", unit="kg", stock_quantity=40.0, min_stock_level=10.0, cost_per_unit=60.0),
        models.Ingredient(name="Un", unit="kg", stock_quantity=100.0, min_stock_level=20.0, cost_per_unit=8.0),
        models.Ingredient(name="Süt", unit="lt", stock_quantity=50.0, min_stock_level=10.0, cost_per_unit=12.0),
        models.Ingredient(name="Yumurta", unit="adet", stock_quantity=200.0, min_stock_level=50.0, cost_per_unit=2.5),
        models.Ingredient(name="Tuz", unit="kg", stock_quantity=20.0, min_stock_level=5.0, cost_per_unit=5.0),
        models.Ingredient(name="Baharat", unit="kg", stock_quantity=10.0, min_stock_level=2.0, cost_per_unit=80.0),
    ]
    
    for ingredient in ingredients:
        db.add(ingredient)
    
    db.commit()
    
    print("Adding sample recipes...")
    
    # Get IDs of products and ingredients
    lahmacun = db.query(models.Product).filter(models.Product.name == "Lahmacun").first()
    kiyma = db.query(models.Ingredient).filter(models.Ingredient.name == "Kıyma").first()
    hamur = db.query(models.Ingredient).filter(models.Ingredient.name == "Hamur").first()
    domates = db.query(models.Ingredient).filter(models.Ingredient.name == "Domates").first()
    
    # Sample recipe for Lahmacun
    if lahmacun and kiyma and hamur and domates:
        recipes = [
            models.RecipeItem(product_id=lahmacun.id, ingredient_id=kiyma.id, quantity=0.020),  # 20 gr
            models.RecipeItem(product_id=lahmacun.id, ingredient_id=hamur.id, quantity=1),  # 1 adet
            models.RecipeItem(product_id=lahmacun.id, ingredient_id=domates.id, quantity=0.010),  # 10 gr
        ]
        
        for recipe in recipes:
            db.add(recipe)
    
    kebap = db.query(models.Product).filter(models.Product.name == "Kebap").first()
    if kebap and kiyma:
        db.add(models.RecipeItem(product_id=kebap.id, ingredient_id=kiyma.id, quantity=0.200))  # 200 gr
    
    db.commit()
    
    print("Sample data initialization complete!")
    print("\nDefault credentials:")
    print("- 10 tables created (Masa 1-10)")
    print(f"- {len(products)} products added")
    print(f"- {len(ingredients)} ingredients added")
    print("- Sample recipes added")
    
    db.close()

if __name__ == "__main__":
    init_sample_data()
    print("\nStarting server...")
    print("Access the application at: http://localhost:8000")
    print("Admin panel: http://localhost:8000/admin")
    print("Tablet view: http://localhost:8000/tablet")
    print("\nPress Ctrl+C to stop the server")
    
    # Start the server
    import uvicorn
    from backend.main import app
    uvicorn.run(app, host="0.0.0.0", port=8000)
