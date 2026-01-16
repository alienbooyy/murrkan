from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from sqlalchemy.orm import Session
from typing import List
import os

from backend.database import get_db, init_db
from backend import models, schemas, crud

app = FastAPI(title="Restaurant Management System", version="1.0.0")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()
    # Create default tables if none exist
    db = next(get_db())
    tables_count = db.query(models.Table).count()
    if tables_count == 0:
        for i in range(1, 11):
            table = models.Table(number=i, capacity=4)
            db.add(table)
        db.commit()
    db.close()

# Root endpoint - serve main page
@app.get("/", response_class=HTMLResponse)
async def root():
    with open("frontend/index.html", "r", encoding="utf-8") as f:
        return f.read()

# Admin panel
@app.get("/admin", response_class=HTMLResponse)
async def admin():
    with open("frontend/admin.html", "r", encoding="utf-8") as f:
        return f.read()

# Tablet interface
@app.get("/tablet", response_class=HTMLResponse)
async def tablet():
    with open("frontend/tablet.html", "r", encoding="utf-8") as f:
        return f.read()

# ===== TABLE ENDPOINTS =====
@app.get("/api/tables", response_model=List[schemas.Table])
def get_tables(db: Session = Depends(get_db)):
    return crud.get_tables(db)

@app.get("/api/tables/{table_id}", response_model=schemas.Table)
def get_table(table_id: int, db: Session = Depends(get_db)):
    table = crud.get_table(db, table_id)
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")
    return table

@app.post("/api/tables", response_model=schemas.Table, status_code=status.HTTP_201_CREATED)
def create_table(table: schemas.TableCreate, db: Session = Depends(get_db)):
    return crud.create_table(db, table)

@app.put("/api/tables/{table_id}", response_model=schemas.Table)
def update_table(table_id: int, table: schemas.TableUpdate, db: Session = Depends(get_db)):
    return crud.update_table(db, table_id, table)

@app.delete("/api/tables/{table_id}")
def delete_table(table_id: int, db: Session = Depends(get_db)):
    crud.delete_table(db, table_id)
    return {"message": "Table deleted"}

@app.post("/api/tables/{table_id}/merge/{target_table_id}")
def merge_tables(table_id: int, target_table_id: int, db: Session = Depends(get_db)):
    return crud.merge_tables(db, table_id, target_table_id)

# ===== PRODUCT ENDPOINTS =====
@app.get("/api/products", response_model=List[schemas.Product])
def get_products(active_only: bool = True, db: Session = Depends(get_db)):
    return crud.get_products(db, active_only)

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/api/products", response_model=schemas.Product, status_code=status.HTTP_201_CREATED)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)

@app.put("/api/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    return crud.update_product(db, product_id, product)

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    crud.delete_product(db, product_id)
    return {"message": "Product deleted"}

# ===== INGREDIENT ENDPOINTS =====
@app.get("/api/ingredients", response_model=List[schemas.Ingredient])
def get_ingredients(active_only: bool = True, db: Session = Depends(get_db)):
    return crud.get_ingredients(db, active_only)

@app.get("/api/ingredients/{ingredient_id}", response_model=schemas.Ingredient)
def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    ingredient = crud.get_ingredient(db, ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ingredient

@app.post("/api/ingredients", response_model=schemas.Ingredient, status_code=status.HTTP_201_CREATED)
def create_ingredient(ingredient: schemas.IngredientCreate, db: Session = Depends(get_db)):
    return crud.create_ingredient(db, ingredient)

@app.put("/api/ingredients/{ingredient_id}", response_model=schemas.Ingredient)
def update_ingredient(ingredient_id: int, ingredient: schemas.IngredientUpdate, db: Session = Depends(get_db)):
    return crud.update_ingredient(db, ingredient_id, ingredient)

@app.delete("/api/ingredients/{ingredient_id}")
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    crud.delete_ingredient(db, ingredient_id)
    return {"message": "Ingredient deleted"}

# ===== RECIPE ENDPOINTS =====
@app.get("/api/products/{product_id}/recipe", response_model=List[schemas.RecipeItem])
def get_product_recipe(product_id: int, db: Session = Depends(get_db)):
    return crud.get_product_recipe(db, product_id)

@app.post("/api/recipes", response_model=schemas.RecipeItem, status_code=status.HTTP_201_CREATED)
def create_recipe_item(recipe: schemas.RecipeItemCreate, db: Session = Depends(get_db)):
    return crud.create_recipe_item(db, recipe)

@app.delete("/api/recipes/{recipe_id}")
def delete_recipe_item(recipe_id: int, db: Session = Depends(get_db)):
    crud.delete_recipe_item(db, recipe_id)
    return {"message": "Recipe item deleted"}

# ===== ORDER ENDPOINTS =====
@app.get("/api/orders", response_model=List[schemas.Order])
def get_orders(status: str = None, db: Session = Depends(get_db)):
    return crud.get_orders(db, status)

@app.get("/api/orders/{order_id}", response_model=schemas.OrderWithItems)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.get("/api/tables/{table_id}/orders", response_model=List[schemas.OrderWithItems])
def get_table_orders(table_id: int, db: Session = Depends(get_db)):
    return crud.get_table_orders(db, table_id)

@app.post("/api/orders", response_model=schemas.Order, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)

@app.put("/api/orders/{order_id}", response_model=schemas.Order)
def update_order(order_id: int, order: schemas.OrderUpdate, db: Session = Depends(get_db)):
    return crud.update_order(db, order_id, order)

@app.post("/api/orders/{order_id}/items", response_model=schemas.OrderItem, status_code=status.HTTP_201_CREATED)
def add_order_item(order_id: int, item: schemas.OrderItemCreate, db: Session = Depends(get_db)):
    return crud.add_order_item(db, order_id, item)

@app.delete("/api/orders/items/{item_id}")
def delete_order_item(item_id: int, db: Session = Depends(get_db)):
    crud.delete_order_item(db, item_id)
    return {"message": "Order item deleted"}

# ===== PAYMENT ENDPOINTS =====
@app.post("/api/payments", response_model=schemas.Payment, status_code=status.HTTP_201_CREATED)
def create_payment(payment: schemas.PaymentCreate, db: Session = Depends(get_db)):
    return crud.create_payment(db, payment)

@app.post("/api/payments/german-style", status_code=status.HTTP_201_CREATED)
def german_style_payment(payment: schemas.GermanStylePaymentRequest, db: Session = Depends(get_db)):
    return crud.german_style_payment(db, payment)

@app.post("/api/orders/{order_id}/close")
def close_order(order_id: int, payment_method: str, db: Session = Depends(get_db)):
    return crud.close_order(db, order_id, payment_method)

# ===== REPORT ENDPOINTS =====
@app.get("/api/reports/daily")
def get_daily_report(date: str, db: Session = Depends(get_db)):
    return crud.get_daily_report(db, date)

@app.get("/api/reports/date-range")
def get_date_range_report(start_date: str, end_date: str, db: Session = Depends(get_db)):
    return crud.get_date_range_report(db, start_date, end_date)

@app.get("/api/reports/top-products")
def get_top_products(limit: int = 10, start_date: str = None, end_date: str = None, db: Session = Depends(get_db)):
    return crud.get_top_products(db, limit, start_date, end_date)

@app.get("/api/reports/export/excel")
def export_report_excel(date: str, db: Session = Depends(get_db)):
    filepath = crud.export_daily_report_excel(db, date)
    return FileResponse(filepath, media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', filename=f"daily_report_{date}.xlsx")

# ===== PRINTER ENDPOINTS =====
@app.post("/api/print/order/{order_id}")
def print_order(order_id: int, db: Session = Depends(get_db)):
    from backend.printer import print_order_receipt
    result = print_order_receipt(db, order_id)
    return {"message": "Order printed", "result": result}

@app.post("/api/print/kitchen/{order_id}")
def print_kitchen_order(order_id: int, db: Session = Depends(get_db)):
    from backend.printer import print_kitchen_order
    result = print_kitchen_order(db, order_id)
    return {"message": "Kitchen order printed", "result": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
