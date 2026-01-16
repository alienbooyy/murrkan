// Admin panel JavaScript

let currentTab = 'reports';
let allProducts = [];
let allIngredients = [];
let selectedProductId = null;
let editingProductId = null;
let editingIngredientId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    showTab('reports');
    loadTopProducts();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dailyReportDate').value = today;
    document.getElementById('rangeEndDate').value = today;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    document.getElementById('rangeStartDate').value = weekAgo.toISOString().split('T')[0];
});

// Tab management
function showTab(tabName) {
    currentTab = tabName;
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    // Load data based on tab
    switch(tabName) {
        case 'products':
            loadProducts();
            break;
        case 'ingredients':
            loadIngredients();
            break;
        case 'recipes':
            loadProductsForRecipes();
            break;
    }
}

// ===== REPORTS =====

async function loadDailyReport() {
    const date = document.getElementById('dailyReportDate').value;
    if (!date) {
        alert('Lütfen tarih seçin');
        return;
    }
    
    try {
        const response = await fetch(`/api/reports/daily?date=${date}`);
        const report = await response.json();
        displayDailyReport(report);
    } catch (error) {
        console.error('Error loading daily report:', error);
        alert('Rapor yüklenirken hata oluştu');
    }
}

function displayDailyReport(report) {
    const container = document.getElementById('dailyReportContent');
    
    let html = `
        <div class="report-summary">
            <div class="report-card">
                <h3>Toplam Ciro</h3>
                <div class="value">${report.total_revenue.toFixed(2)} ₺</div>
            </div>
            <div class="report-card">
                <h3>Toplam Sipariş</h3>
                <div class="value">${report.total_orders}</div>
            </div>
            <div class="report-card">
                <h3>Toplam Maliyet</h3>
                <div class="value">${report.total_cost.toFixed(2)} ₺</div>
            </div>
            <div class="report-card">
                <h3>Kar</h3>
                <div class="value">${report.profit.toFixed(2)} ₺</div>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <button onclick="exportDailyReportExcel('${report.date}')" class="btn btn-success">Excel'e Aktar</button>
            <button onclick="printDailyReport()" class="btn btn-primary">Yazdır</button>
        </div>
        
        <h3 style="margin-top: 30px;">Ürün Satışları</h3>
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Ürün Adı</th>
                        <th>Satılan Miktar</th>
                        <th>Toplam Gelir</th>
                        <th>Maliyet</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    report.product_sales.forEach(item => {
        html += `
            <tr>
                <td>${item.product_name}</td>
                <td>${item.quantity_sold}</td>
                <td>${item.total_revenue.toFixed(2)} ₺</td>
                <td>${item.cost.toFixed(2)} ₺</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

async function loadDateRangeReport() {
    const startDate = document.getElementById('rangeStartDate').value;
    const endDate = document.getElementById('rangeEndDate').value;
    
    if (!startDate || !endDate) {
        alert('Lütfen başlangıç ve bitiş tarihlerini seçin');
        return;
    }
    
    try {
        const response = await fetch(`/api/reports/date-range?start_date=${startDate}&end_date=${endDate}`);
        const report = await response.json();
        displayDateRangeReport(report);
    } catch (error) {
        console.error('Error loading date range report:', error);
        alert('Rapor yüklenirken hata oluştu');
    }
}

function displayDateRangeReport(report) {
    const container = document.getElementById('rangeReportContent');
    
    let html = `
        <div class="report-summary">
            <div class="report-card">
                <h3>Toplam Ciro</h3>
                <div class="value">${report.total_revenue.toFixed(2)} ₺</div>
            </div>
            <div class="report-card">
                <h3>Toplam Sipariş</h3>
                <div class="value">${report.total_orders}</div>
            </div>
            <div class="report-card">
                <h3>Toplam Maliyet</h3>
                <div class="value">${report.total_cost.toFixed(2)} ₺</div>
            </div>
            <div class="report-card">
                <h3>Kar</h3>
                <div class="value">${report.profit.toFixed(2)} ₺</div>
            </div>
        </div>
        
        <h3 style="margin-top: 30px;">Günlük Detaylar</h3>
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Tarih</th>
                        <th>Ciro</th>
                        <th>Sipariş Sayısı</th>
                        <th>Kar</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    report.daily_breakdown.forEach(day => {
        html += `
            <tr>
                <td>${day.date}</td>
                <td>${day.total_revenue.toFixed(2)} ₺</td>
                <td>${day.total_orders}</td>
                <td>${day.profit.toFixed(2)} ₺</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

async function loadTopProducts() {
    try {
        const response = await fetch('/api/reports/top-products?limit=10');
        const products = await response.json();
        displayTopProducts(products);
    } catch (error) {
        console.error('Error loading top products:', error);
    }
}

function displayTopProducts(products) {
    const container = document.getElementById('topProductsContent');
    
    let html = `
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Sıra</th>
                        <th>Ürün Adı</th>
                        <th>Satılan Miktar</th>
                        <th>Toplam Gelir</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    products.forEach((product, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.product_name}</td>
                <td>${product.quantity_sold}</td>
                <td>${product.total_revenue.toFixed(2)} ₺</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

async function exportDailyReportExcel(date) {
    try {
        window.location.href = `/api/reports/export/excel?date=${date}`;
    } catch (error) {
        console.error('Error exporting report:', error);
        alert('Rapor dışa aktarılırken hata oluştu');
    }
}

function printDailyReport() {
    window.print();
}

// ===== PRODUCTS =====

async function loadProducts() {
    try {
        const response = await fetch('/api/products?active_only=false');
        allProducts = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts() {
    const container = document.getElementById('productsList');
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Ürün Adı</th>
                    <th>Fiyat</th>
                    <th>Kategori</th>
                    <th>Yazıcı</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    allProducts.forEach(product => {
        html += `
            <tr>
                <td>${product.name}</td>
                <td>${product.price.toFixed(2)} ₺</td>
                <td>${product.category}</td>
                <td>${product.printer_destination === 'kitchen' ? 'Mutfak' : 'Fırın'}</td>
                <td>${product.is_active ? 'Aktif' : 'Pasif'}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary" onclick="editProduct(${product.id})">Düzenle</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Sil</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

function showAddProductModal() {
    editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Yeni Ürün Ekle';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    showModal('productModal');
}

function editProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    editingProductId = productId;
    document.getElementById('productModalTitle').textContent = 'Ürün Düzenle';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrinter').value = product.printer_destination;
    document.getElementById('productDescription').value = product.description || '';
    
    showModal('productModal');
}

async function saveProduct() {
    const id = document.getElementById('productId').value;
    const data = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        printer_destination: document.getElementById('productPrinter').value,
        description: document.getElementById('productDescription').value
    };
    
    try {
        let response;
        if (id) {
            response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        
        if (response.ok) {
            alert('Ürün kaydedildi');
            closeProductModal();
            loadProducts();
        }
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Ürün kaydedilirken hata oluştu');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Ürün silindi');
            loadProducts();
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Ürün silinirken hata oluştu');
    }
}

// ===== INGREDIENTS =====

async function loadIngredients() {
    try {
        const response = await fetch('/api/ingredients?active_only=false');
        allIngredients = await response.json();
        displayIngredients();
    } catch (error) {
        console.error('Error loading ingredients:', error);
    }
}

function displayIngredients() {
    const container = document.getElementById('ingredientsList');
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Hammadde Adı</th>
                    <th>Birim</th>
                    <th>Stok</th>
                    <th>Min. Stok</th>
                    <th>Birim Maliyet</th>
                    <th>Durum</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    allIngredients.forEach(ingredient => {
        const lowStock = ingredient.stock_quantity < ingredient.min_stock_level;
        html += `
            <tr ${lowStock ? 'style="background-color: #fee2e2;"' : ''}>
                <td>${ingredient.name}</td>
                <td>${ingredient.unit}</td>
                <td>${ingredient.stock_quantity} ${lowStock ? '⚠️' : ''}</td>
                <td>${ingredient.min_stock_level}</td>
                <td>${ingredient.cost_per_unit.toFixed(2)} ₺</td>
                <td>${ingredient.is_active ? 'Aktif' : 'Pasif'}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary" onclick="editIngredient(${ingredient.id})">Düzenle</button>
                    <button class="btn btn-danger" onclick="deleteIngredient(${ingredient.id})">Sil</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

function showAddIngredientModal() {
    editingIngredientId = null;
    document.getElementById('ingredientModalTitle').textContent = 'Yeni Hammadde Ekle';
    document.getElementById('ingredientForm').reset();
    document.getElementById('ingredientId').value = '';
    showModal('ingredientModal');
}

function editIngredient(ingredientId) {
    const ingredient = allIngredients.find(i => i.id === ingredientId);
    if (!ingredient) return;
    
    editingIngredientId = ingredientId;
    document.getElementById('ingredientModalTitle').textContent = 'Hammadde Düzenle';
    document.getElementById('ingredientId').value = ingredient.id;
    document.getElementById('ingredientName').value = ingredient.name;
    document.getElementById('ingredientUnit').value = ingredient.unit;
    document.getElementById('ingredientStock').value = ingredient.stock_quantity;
    document.getElementById('ingredientMinStock').value = ingredient.min_stock_level;
    document.getElementById('ingredientCost').value = ingredient.cost_per_unit;
    
    showModal('ingredientModal');
}

async function saveIngredient() {
    const id = document.getElementById('ingredientId').value;
    const data = {
        name: document.getElementById('ingredientName').value,
        unit: document.getElementById('ingredientUnit').value,
        stock_quantity: parseFloat(document.getElementById('ingredientStock').value),
        min_stock_level: parseFloat(document.getElementById('ingredientMinStock').value),
        cost_per_unit: parseFloat(document.getElementById('ingredientCost').value)
    };
    
    try {
        let response;
        if (id) {
            response = await fetch(`/api/ingredients/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch('/api/ingredients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        
        if (response.ok) {
            alert('Hammadde kaydedildi');
            closeIngredientModal();
            loadIngredients();
        }
    } catch (error) {
        console.error('Error saving ingredient:', error);
        alert('Hammadde kaydedilirken hata oluştu');
    }
}

async function deleteIngredient(ingredientId) {
    if (!confirm('Bu hammaddeyi silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/ingredients/${ingredientId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Hammadde silindi');
            loadIngredients();
        }
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        alert('Hammadde silinirken hata oluştu');
    }
}

// ===== RECIPES =====

async function loadProductsForRecipes() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        
        const select = document.getElementById('recipeProductSelect');
        select.innerHTML = '<option value="">Ürün seçin...</option>';
        
        allProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadRecipe() {
    const productId = document.getElementById('recipeProductSelect').value;
    if (!productId) {
        document.getElementById('recipeContent').innerHTML = '';
        return;
    }
    
    selectedProductId = productId;
    
    try {
        const response = await fetch(`/api/products/${productId}/recipe`);
        const recipeItems = await response.json();
        
        // Load ingredients if not loaded
        if (allIngredients.length === 0) {
            const ingResponse = await fetch('/api/ingredients');
            allIngredients = await ingResponse.json();
        }
        
        displayRecipe(recipeItems);
    } catch (error) {
        console.error('Error loading recipe:', error);
    }
}

function displayRecipe(recipeItems) {
    const container = document.getElementById('recipeContent');
    
    let html = `
        <button class="btn btn-success" onclick="showAddRecipeItemModal()">Malzeme Ekle</button>
        <div class="data-table" style="margin-top: 20px;">
            <table>
                <thead>
                    <tr>
                        <th>Hammadde</th>
                        <th>Miktar</th>
                        <th>Birim</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    recipeItems.forEach(item => {
        const ingredient = allIngredients.find(i => i.id === item.ingredient_id);
        html += `
            <tr>
                <td>${ingredient ? ingredient.name : 'Bilinmeyen'}</td>
                <td>${item.quantity}</td>
                <td>${ingredient ? ingredient.unit : ''}</td>
                <td class="action-buttons">
                    <button class="btn btn-danger" onclick="deleteRecipeItem(${item.id})">Sil</button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

function showAddRecipeItemModal() {
    if (!selectedProductId) {
        alert('Lütfen önce bir ürün seçin');
        return;
    }
    
    // Populate ingredients select
    const select = document.getElementById('recipeIngredient');
    select.innerHTML = '<option value="">Seçin...</option>';
    
    allIngredients.forEach(ingredient => {
        const option = document.createElement('option');
        option.value = ingredient.id;
        option.textContent = `${ingredient.name} (${ingredient.unit})`;
        select.appendChild(option);
    });
    
    document.getElementById('recipeItemForm').reset();
    showModal('recipeItemModal');
}

async function saveRecipeItem() {
    const data = {
        product_id: parseInt(selectedProductId),
        ingredient_id: parseInt(document.getElementById('recipeIngredient').value),
        quantity: parseFloat(document.getElementById('recipeQuantity').value)
    };
    
    try {
        const response = await fetch('/api/recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Malzeme eklendi');
            closeRecipeItemModal();
            loadRecipe();
        }
    } catch (error) {
        console.error('Error saving recipe item:', error);
        alert('Malzeme eklenirken hata oluştu');
    }
}

async function deleteRecipeItem(recipeId) {
    if (!confirm('Bu malzemeyi silmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Malzeme silindi');
            loadRecipe();
        }
    } catch (error) {
        console.error('Error deleting recipe item:', error);
        alert('Malzeme silinirken hata oluştu');
    }
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

function closeIngredientModal() {
    document.getElementById('ingredientModal').style.display = 'none';
}

function closeRecipeItemModal() {
    document.getElementById('recipeItemModal').style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}
