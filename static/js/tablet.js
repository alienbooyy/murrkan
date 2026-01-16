// Tablet interface JavaScript

let currentTableId = null;
let currentOrder = null;
let products = [];
let allProducts = [];
let orderItems = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadTables();
    loadProducts();
});

// Load all tables for selection
async function loadTables() {
    try {
        const response = await fetch('/api/tables');
        const tables = await response.json();
        
        const select = document.getElementById('tableSelect');
        select.innerHTML = '<option value="">Masa Seçin</option>';
        
        tables.forEach(table => {
            const option = document.createElement('option');
            option.value = table.id;
            option.textContent = `Masa ${table.number}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading tables:', error);
        alert('Masalar yüklenirken hata oluştu');
    }
}

// Load all products
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        products = allProducts;
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        alert('Ürünler yüklenirken hata oluştu');
    }
}

// Select table
async function selectTable() {
    const select = document.getElementById('tableSelect');
    currentTableId = select.value;
    
    if (!currentTableId) {
        document.getElementById('selectedTableNumber').textContent = '-';
        clearOrder();
        return;
    }
    
    // Get table info
    const response = await fetch(`/api/tables/${currentTableId}`);
    const table = await response.json();
    document.getElementById('selectedTableNumber').textContent = table.number;
    
    // Load existing orders
    await loadTableOrders();
}

// Load existing orders for selected table
async function loadTableOrders() {
    if (!currentTableId) return;
    
    try {
        const response = await fetch(`/api/tables/${currentTableId}/orders`);
        const orders = await response.json();
        
        if (orders.length > 0) {
            currentOrder = orders[0];
            orderItems = currentOrder.order_items || [];
        } else {
            currentOrder = null;
            orderItems = [];
        }
        
        updateOrderDisplay();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Display products
function displayProducts(category = 'all') {
    const container = document.getElementById('tabletProducts');
    container.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    filteredProducts.forEach(product => {
        const productBtn = document.createElement('button');
        productBtn.className = 'btn btn-primary tablet-product-btn';
        productBtn.onclick = () => addProductToCart(product);
        
        productBtn.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price.toFixed(2)} ₺</div>
        `;
        
        container.appendChild(productBtn);
    });
}

// Filter products by category
function filterTabletProducts(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayProducts(category);
}

// Add product to cart (local state)
function addProductToCart(product) {
    if (!currentTableId) {
        alert('Lütfen önce masa seçin');
        return;
    }
    
    // Check if product already in cart
    const existingItem = orderItems.find(item => item.product_id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.quantity * existingItem.unit_price;
    } else {
        orderItems.push({
            product_id: product.id,
            product: product,
            quantity: 1,
            unit_price: product.price,
            subtotal: product.price
        });
    }
    
    updateOrderDisplay();
}

// Update order display
function updateOrderDisplay() {
    const container = document.getElementById('tabletOrderItems');
    const totalElement = document.getElementById('tabletOrderTotal');
    
    if (orderItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">Sipariş boş</p>';
        totalElement.textContent = '0.00';
        return;
    }
    
    container.innerHTML = '';
    let total = 0;
    
    orderItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'display: flex; justify-content: space-between; padding: 8px; background: #f9fafb; margin-bottom: 5px; border-radius: 5px;';
        
        itemDiv.innerHTML = `
            <div style="flex: 1;">
                <strong>${item.product.name}</strong>
                <span style="color: #6b7280;"> x${item.quantity}</span>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <span style="font-weight: bold;">${item.subtotal.toFixed(2)} ₺</span>
                <button class="btn btn-danger" style="padding: 5px 10px; font-size: 0.9em;" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
        
        container.appendChild(itemDiv);
        total += item.subtotal;
    });
    
    totalElement.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(index) {
    orderItems.splice(index, 1);
    updateOrderDisplay();
}

// Clear order
function clearOrder() {
    if (orderItems.length > 0 && !confirm('Siparişi temizlemek istediğinizden emin misiniz?')) {
        return;
    }
    
    orderItems = [];
    currentOrder = null;
    updateOrderDisplay();
}

// Send order to kitchen
async function sendOrder() {
    if (!currentTableId) {
        alert('Lütfen masa seçin');
        return;
    }
    
    if (orderItems.length === 0) {
        alert('Sipariş boş');
        return;
    }
    
    try {
        // If no existing order, create one
        if (!currentOrder) {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_id: currentTableId,
                    items: orderItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity
                    }))
                })
            });
            
            if (!response.ok) {
                throw new Error('Sipariş oluşturulamadı');
            }
            
            currentOrder = await response.json();
        } else {
            // Add items to existing order
            for (const item of orderItems) {
                // Check if this is a new item or existing
                const existingOrderItem = currentOrder.order_items?.find(
                    oi => oi.product_id === item.product_id && !oi.id
                );
                
                if (!existingOrderItem) {
                    await fetch(`/api/orders/${currentOrder.id}/items`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            product_id: item.product_id,
                            quantity: item.quantity
                        })
                    });
                }
            }
        }
        
        // Print to kitchen
        await fetch(`/api/print/kitchen/${currentOrder.id}`, { method: 'POST' });
        
        alert('Sipariş gönderildi!');
        
        // Clear local cart
        orderItems = [];
        
        // Reload orders from server
        await loadTableOrders();
        
    } catch (error) {
        console.error('Error sending order:', error);
        alert('Sipariş gönderilirken hata oluştu: ' + error.message);
    }
}
