// Main page JavaScript - Table Management and Orders

let currentTable = null;
let currentOrder = null;
let products = [];
let allProducts = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadTables();
    loadProducts();
});

// Load all tables
async function loadTables() {
    try {
        const response = await fetch('/api/tables');
        const tables = await response.json();
        
        const container = document.getElementById('tables-container');
        container.innerHTML = '';
        
        tables.forEach(table => {
            const tableCard = document.createElement('div');
            tableCard.className = `table-card ${table.status}`;
            tableCard.onclick = () => openTable(table);
            
            const statusText = {
                'empty': 'Boş',
                'occupied': 'Dolu',
                'reserved': 'Rezerve'
            };
            
            tableCard.innerHTML = `
                <div class="table-number">Masa ${table.number}</div>
                <div class="table-status">${statusText[table.status]}</div>
            `;
            
            container.appendChild(tableCard);
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
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Open table and show order modal
async function openTable(table) {
    currentTable = table;
    
    // Load existing orders for this table
    try {
        const response = await fetch(`/api/tables/${table.id}/orders`);
        const orders = await response.json();
        
        if (orders.length > 0) {
            currentOrder = orders[0];
        } else {
            currentOrder = null;
        }
        
        document.getElementById('modalTableNumber').textContent = table.number;
        displayProducts();
        updateOrderDisplay();
        showModal('orderModal');
    } catch (error) {
        console.error('Error loading orders:', error);
        alert('Sipariş bilgileri yüklenirken hata oluştu');
    }
}

// Display products in modal
function displayProducts(category = 'all') {
    const container = document.getElementById('productsList');
    container.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.onclick = () => addProductToOrder(product);
        
        productCard.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price.toFixed(2)} ₺</div>
        `;
        
        container.appendChild(productCard);
    });
}

// Filter products by category
function filterProducts(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayProducts(category);
}

// Add product to order
async function addProductToOrder(product) {
    try {
        // Create order if it doesn't exist
        if (!currentOrder) {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_id: currentTable.id,
                    items: []
                })
            });
            currentOrder = await response.json();
        }
        
        // Add item to order
        const response = await fetch(`/api/orders/${currentOrder.id}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: product.id,
                quantity: 1
            })
        });
        
        if (response.ok) {
            // Reload order to get updated items
            const orderResponse = await fetch(`/api/orders/${currentOrder.id}`);
            currentOrder = await orderResponse.json();
            updateOrderDisplay();
            
            // Print to kitchen
            await fetch(`/api/print/kitchen/${currentOrder.id}`, { method: 'POST' });
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Ürün eklenirken hata oluştu');
    }
}

// Update order display
function updateOrderDisplay() {
    const container = document.getElementById('orderItems');
    const totalElement = document.getElementById('orderTotal');
    
    if (!currentOrder || !currentOrder.order_items || currentOrder.order_items.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">Henüz ürün eklenmedi</p>';
        totalElement.textContent = '0.00';
        return;
    }
    
    container.innerHTML = '';
    
    currentOrder.order_items.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        orderItem.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-name">${item.product ? item.product.name : 'Ürün'}</div>
                <div class="order-item-price">${item.unit_price.toFixed(2)} ₺</div>
            </div>
            <div class="order-item-quantity">
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: bold; font-size: 1.1em;">${item.subtotal.toFixed(2)} ₺</div>
                <button class="btn btn-danger" style="padding: 8px 15px; margin-top: 5px;" onclick="removeOrderItem(${item.id})">Sil</button>
            </div>
        `;
        
        container.appendChild(orderItem);
    });
    
    totalElement.textContent = currentOrder.total_amount.toFixed(2);
}

// Update item quantity
async function updateItemQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeOrderItem(itemId);
        return;
    }
    
    // For now, we'll remove and re-add with new quantity
    // In production, you'd want a dedicated update endpoint
    await removeOrderItem(itemId, false);
    
    // Reload current order
    const orderResponse = await fetch(`/api/orders/${currentOrder.id}`);
    currentOrder = await orderResponse.json();
    updateOrderDisplay();
}

// Remove order item
async function removeOrderItem(itemId, updateDisplay = true) {
    try {
        const response = await fetch(`/api/orders/items/${itemId}`, {
            method: 'DELETE'
        });
        
        if (response.ok && updateDisplay) {
            // Reload order
            const orderResponse = await fetch(`/api/orders/${currentOrder.id}`);
            currentOrder = await orderResponse.json();
            updateOrderDisplay();
        }
    } catch (error) {
        console.error('Error removing item:', error);
        alert('Ürün silinirken hata oluştu');
    }
}

// Print order
async function printOrder() {
    if (!currentOrder) {
        alert('Sipariş bulunamadı');
        return;
    }
    
    try {
        const response = await fetch(`/api/print/order/${currentOrder.id}`, {
            method: 'POST'
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error printing:', error);
        alert('Yazdırma sırasında hata oluştu');
    }
}

// Show German style payment modal
function showGermanStylePayment() {
    if (!currentOrder || !currentOrder.order_items || currentOrder.order_items.length === 0) {
        alert('Sipariş bulunamadı');
        return;
    }
    
    const container = document.getElementById('germanPaymentItems');
    container.innerHTML = '';
    
    currentOrder.order_items.forEach(item => {
        if (!item.is_paid) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'german-payment-item';
            itemDiv.innerHTML = `
                <input type="checkbox" id="gpitem_${item.id}" value="${item.id}" onchange="updateGermanTotal()">
                <label for="gpitem_${item.id}" style="flex: 1; cursor: pointer;">
                    <strong>${item.product ? item.product.name : 'Ürün'}</strong> x${item.quantity} - ${item.subtotal.toFixed(2)} ₺
                </label>
            `;
            container.appendChild(itemDiv);
        }
    });
    
    document.getElementById('germanPaymentTotal').textContent = '0.00';
    showModal('germanPaymentModal');
}

// Update German style payment total
function updateGermanTotal() {
    let total = 0;
    const checkboxes = document.querySelectorAll('#germanPaymentItems input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        const itemId = parseInt(checkbox.value);
        const item = currentOrder.order_items.find(i => i.id === itemId);
        if (item) {
            total += item.subtotal;
        }
    });
    
    document.getElementById('germanPaymentTotal').textContent = total.toFixed(2);
}

// Process German style payment
async function processGermanPayment(paymentMethod) {
    const checkboxes = document.querySelectorAll('#germanPaymentItems input[type="checkbox"]:checked');
    const itemIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (itemIds.length === 0) {
        alert('Lütfen ödeme yapılacak ürünleri seçin');
        return;
    }
    
    try {
        const response = await fetch('/api/payments/german-style', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                order_id: currentOrder.id,
                item_ids: itemIds,
                payment_method: paymentMethod
            })
        });
        
        if (response.ok) {
            alert('Ödeme alındı');
            closeGermanPaymentModal();
            
            // Reload order and table status
            const orderResponse = await fetch(`/api/orders/${currentOrder.id}`);
            currentOrder = await orderResponse.json();
            updateOrderDisplay();
            
            if (currentOrder.status === 'completed') {
                closeOrderModal();
                loadTables();
            }
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('Ödeme işlemi sırasında hata oluştu');
    }
}

// Show payment modal
function showPaymentModal() {
    if (!currentOrder) {
        alert('Sipariş bulunamadı');
        return;
    }
    
    document.getElementById('paymentTotal').textContent = currentOrder.total_amount.toFixed(2);
    showModal('paymentModal');
}

// Process full payment
async function processPayment(paymentMethod) {
    try {
        const response = await fetch(`/api/orders/${currentOrder.id}/close`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                payment_method: paymentMethod
            })
        });
        
        if (response.ok) {
            alert('Ödeme tamamlandı');
            closePaymentModal();
            closeOrderModal();
            loadTables();
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('Ödeme işlemi sırasında hata oluştu');
    }
}

// Close table (cancel order)
async function closeTable() {
    if (!confirm('Masayı kapatmak istediğinizden emin misiniz?')) {
        return;
    }
    
    if (currentOrder && currentOrder.status === 'pending') {
        if (!confirm('Ödenmemiş sipariş var. Yine de kapatmak istiyor musunuz?')) {
            return;
        }
    }
    
    closeOrderModal();
    loadTables();
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
    document.getElementById(modalId).style.display = 'flex';
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('show');
    document.getElementById('orderModal').style.display = 'none';
    currentTable = null;
    currentOrder = null;
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('show');
    document.getElementById('paymentModal').style.display = 'none';
}

function closeGermanPaymentModal() {
    document.getElementById('germanPaymentModal').classList.remove('show');
    document.getElementById('germanPaymentModal').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
        event.target.style.display = 'none';
    }
}
