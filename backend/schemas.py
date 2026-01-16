from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class TableStatusEnum(str, Enum):
    EMPTY = "empty"
    OCCUPIED = "occupied"
    RESERVED = "reserved"

class OrderStatusEnum(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentMethodEnum(str, Enum):
    CASH = "cash"
    CARD = "card"
    GERMAN_STYLE = "german_style"

# Table Schemas
class TableBase(BaseModel):
    number: int
    capacity: int = 4
    status: TableStatusEnum = TableStatusEnum.EMPTY
    x_position: float = 0
    y_position: float = 0
    merged_with: Optional[int] = None

class TableCreate(TableBase):
    pass

class TableUpdate(BaseModel):
    capacity: Optional[int] = None
    status: Optional[TableStatusEnum] = None
    x_position: Optional[float] = None
    y_position: Optional[float] = None
    merged_with: Optional[int] = None

class Table(TableBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Product Schemas
class ProductBase(BaseModel):
    name: str
    price: float
    category: str
    printer_destination: str = "kitchen"
    description: Optional[str] = None
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    printer_destination: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Ingredient Schemas
class IngredientBase(BaseModel):
    name: str
    unit: str
    stock_quantity: float = 0
    min_stock_level: float = 0
    cost_per_unit: float = 0
    is_active: bool = True

class IngredientCreate(IngredientBase):
    pass

class IngredientUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    stock_quantity: Optional[float] = None
    min_stock_level: Optional[float] = None
    cost_per_unit: Optional[float] = None
    is_active: Optional[bool] = None

class Ingredient(IngredientBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Recipe Schemas
class RecipeItemBase(BaseModel):
    product_id: int
    ingredient_id: int
    quantity: float

class RecipeItemCreate(RecipeItemBase):
    pass

class RecipeItem(RecipeItemBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Order Item Schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = 1
    notes: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    unit_price: float
    subtotal: float
    is_paid: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# Order Schemas
class OrderBase(BaseModel):
    table_id: int
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate] = []

class OrderUpdate(BaseModel):
    status: Optional[OrderStatusEnum] = None
    notes: Optional[str] = None
    discount: Optional[float] = None

class Order(OrderBase):
    id: int
    status: OrderStatusEnum
    created_at: datetime
    completed_at: Optional[datetime] = None
    total_amount: float
    payment_method: Optional[PaymentMethodEnum] = None
    discount: float
    model_config = ConfigDict(from_attributes=True)

class OrderWithItems(Order):
    order_items: List[OrderItem] = []
    model_config = ConfigDict(from_attributes=True)

# Payment Schemas
class PaymentBase(BaseModel):
    order_id: int
    amount: float
    payment_method: PaymentMethodEnum
    notes: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# German Style Payment
class GermanStylePaymentRequest(BaseModel):
    order_id: int
    item_ids: List[int]
    payment_method: PaymentMethodEnum

# Report Schemas
class ProductSalesReport(BaseModel):
    product_id: int
    product_name: str
    quantity_sold: int
    total_revenue: float

class DailyReportSummary(BaseModel):
    date: str
    total_revenue: float
    total_orders: int
    total_cost: float
    profit: float
    top_products: List[ProductSalesReport]

class DateRangeReport(BaseModel):
    start_date: str
    end_date: str
    total_revenue: float
    total_orders: int
    total_cost: float
    profit: float
    daily_breakdown: List[DailyReportSummary]
