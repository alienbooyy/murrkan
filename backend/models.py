from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base
import enum

class TableStatus(str, enum.Enum):
    EMPTY = "empty"
    OCCUPIED = "occupied"
    RESERVED = "reserved"

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    CARD = "card"
    GERMAN_STYLE = "german_style"

class Table(Base):
    __tablename__ = "tables"
    
    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, unique=True, nullable=False)
    capacity = Column(Integer, default=4)
    status = Column(SQLEnum(TableStatus), default=TableStatus.EMPTY)
    x_position = Column(Float, default=0)
    y_position = Column(Float, default=0)
    merged_with = Column(Integer, ForeignKey("tables.id"), nullable=True)
    
    orders = relationship("Order", back_populates="table")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    price = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    printer_destination = Column(String(20), default="kitchen")  # kitchen or oven
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order_items = relationship("OrderItem", back_populates="product")
    recipe_items = relationship("RecipeItem", back_populates="product")

class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    unit = Column(String(20), nullable=False)  # gr, kg, adet, lt, ml, etc.
    stock_quantity = Column(Float, default=0)
    min_stock_level = Column(Float, default=0)
    cost_per_unit = Column(Float, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    recipe_items = relationship("RecipeItem", back_populates="ingredient")

class RecipeItem(Base):
    __tablename__ = "recipe_items"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    
    product = relationship("Product", back_populates="recipe_items")
    ingredient = relationship("Ingredient", back_populates="recipe_items")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    total_amount = Column(Float, default=0)
    payment_method = Column(SQLEnum(PaymentMethod), nullable=True)
    discount = Column(Float, default=0)
    notes = Column(Text, nullable=True)
    
    table = relationship("Table", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    is_paid = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(SQLEnum(PaymentMethod), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    
    order = relationship("Order", back_populates="payments")

class DailyReport(Base):
    __tablename__ = "daily_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, index=True)
    total_revenue = Column(Float, default=0)
    total_orders = Column(Integer, default=0)
    total_cost = Column(Float, default=0)
    profit = Column(Float, default=0)
    report_data = Column(Text, nullable=True)  # JSON data with detailed breakdown
    created_at = Column(DateTime, default=datetime.utcnow)
