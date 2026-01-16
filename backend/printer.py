"""
Printer integration using ESC/POS for thermal printers
This module handles printing receipts and kitchen orders
"""
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

# Note: For actual printer implementation, you'll need to configure printer addresses
# Example: printer = Network("192.168.1.100") or Usb(0x04b8, 0x0e28)

def format_price(price: float) -> str:
    """Format price in Turkish Lira"""
    return f"{price:,.2f} ₺"

def print_order_receipt(db: Session, order_id: int, printer_ip: Optional[str] = None) -> dict:
    """
    Print customer receipt for an order
    
    Args:
        db: Database session
        order_id: Order ID to print
        printer_ip: Optional printer IP address (for network printers)
    
    Returns:
        dict with status and message
    """
    from backend import crud
    
    order = crud.get_order(db, order_id)
    if not order:
        return {"status": "error", "message": "Order not found"}
    
    try:
        # In production, uncomment this to use actual printer
        # if printer_ip:
        #     from escpos.printer import Network
        #     printer = Network(printer_ip)
        # else:
        #     from escpos.printer import Usb
        #     printer = Usb(0x04b8, 0x0e28)  # Configure your printer's vendor/product ID
        
        # For now, create a text representation
        receipt_text = generate_receipt_text(order)
        
        # Actual printing would be:
        # printer.set(align='center')
        # printer.text("RESTAURANT NAME\n")
        # printer.text("================\n\n")
        # printer.set(align='left')
        # ... print items ...
        # printer.cut()
        
        # Save to file for demonstration
        import os
        os.makedirs("reports", exist_ok=True)
        filename = f"reports/receipt_{order_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(receipt_text)
        
        return {
            "status": "success",
            "message": "Receipt printed successfully",
            "file": filename
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Printing error: {str(e)}"
        }

def generate_receipt_text(order) -> str:
    """Generate receipt text for an order"""
    lines = []
    lines.append("=" * 40)
    lines.append("RESTORAN ADI".center(40))
    lines.append("=" * 40)
    lines.append("")
    lines.append(f"Tarih: {order.created_at.strftime('%d.%m.%Y %H:%M')}")
    lines.append(f"Masa: {order.table.number}")
    lines.append(f"Sipariş No: {order.id}")
    lines.append("-" * 40)
    lines.append("")
    
    for item in order.order_items:
        product_name = item.product.name[:25]
        lines.append(f"{product_name:<25} x{item.quantity:>2}")
        price_str = format_price(item.subtotal)
        lines.append(f"{' '*28}{price_str:>12}")
        if item.notes:
            lines.append(f"  Not: {item.notes}")
        lines.append("")
    
    lines.append("-" * 40)
    
    if order.discount > 0:
        lines.append(f"{'Ara Toplam:':<28}{format_price(order.total_amount + order.discount):>12}")
        lines.append(f"{'İndirim:':<28}{format_price(order.discount):>12}")
    
    lines.append(f"{'TOPLAM:':<28}{format_price(order.total_amount):>12}")
    lines.append("")
    
    if order.payment_method:
        payment_method_tr = {
            "cash": "Nakit",
            "card": "Kredi Kartı",
            "german_style": "Alman Usulü"
        }
        lines.append(f"Ödeme: {payment_method_tr.get(order.payment_method, order.payment_method)}")
    
    lines.append("")
    lines.append("=" * 40)
    lines.append("Teşekkür ederiz!".center(40))
    lines.append("İyi günler dileriz.".center(40))
    lines.append("=" * 40)
    
    return "\n".join(lines)

def print_kitchen_order(db: Session, order_id: int, printer_type: str = "kitchen") -> dict:
    """
    Print kitchen/oven order ticket
    
    Args:
        db: Database session
        order_id: Order ID to print
        printer_type: 'kitchen' or 'oven' to determine which printer to use
    
    Returns:
        dict with status and message
    """
    from backend import crud
    
    order = crud.get_order(db, order_id)
    if not order:
        return {"status": "error", "message": "Order not found"}
    
    try:
        # Filter items based on printer destination
        items_to_print = [
            item for item in order.order_items
            if item.product.printer_destination == printer_type
        ]
        
        if not items_to_print:
            return {
                "status": "info",
                "message": f"No items for {printer_type} printer"
            }
        
        # Generate kitchen ticket text
        ticket_text = generate_kitchen_ticket_text(order, items_to_print)
        
        # Save to file for demonstration
        import os
        os.makedirs("reports", exist_ok=True)
        filename = f"reports/kitchen_{printer_type}_{order_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(ticket_text)
        
        return {
            "status": "success",
            "message": f"{printer_type.capitalize()} order printed successfully",
            "file": filename
        }
    
    except Exception as e:
        return {
            "status": "error",
            "message": f"Printing error: {str(e)}"
        }

def generate_kitchen_ticket_text(order, items) -> str:
    """Generate kitchen ticket text"""
    lines = []
    lines.append("=" * 40)
    lines.append("MUTFAK SİPARİŞİ".center(40))
    lines.append("=" * 40)
    lines.append("")
    lines.append(f"Saat: {datetime.now().strftime('%H:%M:%S')}")
    lines.append(f"Masa: {order.table.number}")
    lines.append(f"Sipariş No: {order.id}")
    lines.append("-" * 40)
    lines.append("")
    
    for item in items:
        lines.append(f"{item.quantity} x {item.product.name}")
        if item.notes:
            lines.append(f"  >>> {item.notes} <<<")
        lines.append("")
    
    lines.append("=" * 40)
    
    return "\n".join(lines)

def auto_print_order(db: Session, order_id: int) -> dict:
    """
    Automatically print order to appropriate printers
    Kitchen items go to kitchen printer, oven items to oven printer
    """
    results = {
        "kitchen": None,
        "oven": None,
        "receipt": None
    }
    
    # Print to kitchen
    kitchen_result = print_kitchen_order(db, order_id, "kitchen")
    results["kitchen"] = kitchen_result
    
    # Print to oven
    oven_result = print_kitchen_order(db, order_id, "oven")
    results["oven"] = oven_result
    
    return results
