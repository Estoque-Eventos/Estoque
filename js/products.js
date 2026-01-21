// ===================================
// GESTÃO DE PRODUTOS - CRUD COMPLETO
// ===================================

// Estado global
let currentPage = 1;
const itemsPerPage = 10;
let filteredProducts = [];
let productToDelete = null;

document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticação
    checkAuth(true);
    
    // Inicializa
    loadProducts();
    initEventListeners();
});

/**
 * Inicializa todos os event listeners
 */
function initEventListeners() {
    // Modal de produto
    const addProductBtn = document.getElementById('addProductBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const productForm = document.getElementById('productForm');
    
    addProductBtn?.addEventListener('click', openProductModal);
    closeModal?.addEventListener('click', closeProductModal);
    cancelBtn?.addEventListener('click', closeProductModal);
    productForm?.addEventListener('submit', handleProductSubmit);
    
    // Modal de confirmação
    const closeConfirmModal = document.getElementById('closeConfirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    closeConfirmModal?.addEventListener('click', closeConfirmModal);
    cancelDeleteBtn?.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn?.addEventListener('click', handleDeleteConfirm);
    
    // Fechar modal ao clicar fora
    const productModal = document.getElementById('productModal');
    const confirmModal = document.getElementById('confirmModal');
    
    productModal?.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });
    
    confirmModal?.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeDeleteModal();
    });
    
    // Busca e filtros
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const clearFilters = document.getElementById('clearFilters');
    const exportBtn = document.getElementById('exportBtn');
    
    searchInput?.addEventListener('input', handleFilters);
    categoryFilter?.addEventListener('change', handleFilters);
    statusFilter?.addEventListener('change', handleFilters);
    clearFilters?.addEventListener('click', clearAllFilters);
    exportBtn?.addEventListener('click', exportToCSV);
    
    // Paginação
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    prevPage?.addEventListener('click', () => changePage(currentPage - 1));
    nextPage?.addEventListener('click', () => changePage(currentPage + 1));
}

/**
 * Carrega e exibe todos os produtos
 */
function loadProducts() {
    const products = getUserProducts();
    filteredProducts = [...products];
    renderProducts();
}

/**
 * Aplica os filtros
 */
function handleFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    let products = getUserProducts();
    
    // Filtro de busca
    if (searchTerm) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.sku.toLowerCase().includes(searchTerm) ||
            (p.supplier && p.supplier.toLowerCase().includes(searchTerm))
        );
    }
    
    // Filtro de categoria
    if (category) {
        products = products.filter(p => p.category === category);
    }
    
    // Filtro de status
    if (status) {
        products = products.filter(p => {
            const stockCheck = checkStock(p.quantity, p.minStock);
            const expiryCheck = p.expiryDate ? checkExpiry(p.expiryDate) : null;
            
            if (status === 'ok') {
                return !stockCheck.isLow && !stockCheck.isOut && 
                       (!expiryCheck || (!expiryCheck.isExpiring && !expiryCheck.isCritical && !expiryCheck.isExpired));
            } else if (status === 'low') {
                return stockCheck.isLow;
            } else if (status === 'out') {
                return stockCheck.isOut;
            } else if (status === 'expiring') {
                return expiryCheck && (expiryCheck.isExpiring || expiryCheck.isCritical || expiryCheck.isExpired);
            }
            return true;
        });
    }
    
    filteredProducts = products;
    currentPage = 1;
    renderProducts();
}

/**
 * Limpa todos os filtros
 */
function clearAllFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('statusFilter').value = '';
    loadProducts();
}

/**
 * Renderiza a tabela de produtos
 */
function renderProducts() {
    const productsTable = document.getElementById('productsTable');
    if (!productsTable) return;
    
    // Atualiza badges
    updateBadges();
    
    if (filteredProducts.length === 0) {
        productsTable.innerHTML = `
            <tr>
                <td colspan="9" class="empty-cell">
                    <div class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <p>Nenhum produto encontrado</p>
                        ${getUserProducts().length === 0 ? `
                            <button class="btn btn-primary" onclick="document.getElementById('addProductBtn').click()">
                                <i class="fas fa-plus"></i> Adicionar Primeiro Produto
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
        updatePagination(0);
        return;
    }
    
    // Paginação
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    productsTable.innerHTML = paginatedProducts.map(product => {
        const stockCheck = checkStock(product.quantity, product.minStock);
        const expiryCheck = product.expiryDate ? checkExpiry(product.expiryDate) : null;
        
        let statusBadge = '';
        let statusClass = 'status-ok';
        let statusText = 'Normal';
        let statusIcon = 'fa-check-circle';
        
        if (stockCheck.isOut) {
            statusClass = 'status-out';
            statusText = 'Sem estoque';
            statusIcon = 'fa-times-circle';
        } else if (stockCheck.isLow) {
            statusClass = 'status-low';
            statusText = 'Estoque baixo';
            statusIcon = 'fa-exclamation-triangle';
        } else if (expiryCheck && expiryCheck.isExpired) {
            statusClass = 'status-expiring';
            statusText = 'Vencido';
            statusIcon = 'fa-calendar-times';
        } else if (expiryCheck && expiryCheck.isCritical) {
            statusClass = 'status-expiring';
            statusText = `Vence em ${expiryCheck.daysLeft}d`;
            statusIcon = 'fa-clock';
        } else if (expiryCheck && expiryCheck.isExpiring) {
            statusClass = 'status-expiring';
            statusText = `Vence em ${expiryCheck.daysLeft}d`;
            statusIcon = 'fa-clock';
        }
        
        statusBadge = `<span class="status-badge ${statusClass}"><i class="fas ${statusIcon}"></i> ${statusText}</span>`;
        
        return `
            <tr>
                <td><strong>${product.sku}</strong></td>
                <td>${product.name}</td>
                <td>${product.category || '-'}</td>
                <td><strong>${product.quantity}</strong> ${product.unit || 'UN'}</td>
                <td>${product.minStock} ${product.unit || 'UN'}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.expiryDate ? formatDate(product.expiryDate) : '-'}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="editProduct('${product.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="confirmDeleteProduct('${product.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    updatePagination(totalPages);
}

/**
 * Atualiza controles de paginação
 */
function updatePagination(totalPages) {
    const pageInfo = document.getElementById('pageInfo');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (totalPages === 0) {
        pageInfo.textContent = 'Página 0 de 0';
        prevPage.disabled = true;
        nextPage.disabled = true;
        return;
    }
    
    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
}

/**
 * Muda a página
 */
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderProducts();
}

/**
 * Abre modal de produto (novo ou editar)
 */
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');
    
    form.reset();
    
    if (productId) {
        // Modo edição
        const products = getUserProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Editar Produto';
        
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productSku').value = product.sku;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productSupplier').value = product.supplier || '';
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productMinStock').value = product.minStock;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productUnit').value = product.unit || 'UN';
        document.getElementById('productDescription').value = product.description || '';
        
        if (product.expiryDate) {
            document.getElementById('productExpiry').value = product.expiryDate;
        }
    } else {
        // Modo criação
        modalTitle.innerHTML = '<i class="fas fa-box"></i> Novo Produto';
        document.getElementById('productId').value = '';
    }
    
    modal.classList.add('active');
}

/**
 * Fecha modal de produto
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
}

/**
 * Processa o envio do formulário
 */
function handleProductSubmit(e) {
    e.preventDefault();
    
    const product = {
        id: document.getElementById('productId').value || null,
        name: document.getElementById('productName').value.trim(),
        sku: document.getElementById('productSku').value.trim(),
        category: document.getElementById('productCategory').value,
        supplier: document.getElementById('productSupplier').value.trim(),
        quantity: parseInt(document.getElementById('productQuantity').value),
        minStock: parseInt(document.getElementById('productMinStock').value),
        price: parseFloat(document.getElementById('productPrice').value),
        unit: document.getElementById('productUnit').value,
        expiryDate: document.getElementById('productExpiry').value || null,
        description: document.getElementById('productDescription').value.trim()
    };
    
    // Validações
    if (!product.name || !product.sku || !product.category) {
        showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    if (product.quantity < 0 || product.minStock < 0 || product.price < 0) {
        showNotification('Os valores numéricos devem ser positivos', 'error');
        return;
    }
    
    // Verifica se o SKU já existe (exceto no próprio produto em edição)
    const products = getUserProducts();
    const existingSku = products.find(p => 
        p.sku.toLowerCase() === product.sku.toLowerCase() && 
        p.id !== product.id
    );
    
    if (existingSku) {
        showNotification('Já existe um produto com este SKU', 'error');
        return;
    }
    
    // Salva o produto
    if (saveProduct(product)) {
        showNotification(
            product.id ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!',
            'success'
        );
        closeProductModal();
        loadProducts();
    } else {
        showNotification('Erro ao salvar produto', 'error');
    }
}

/**
 * Edita um produto
 */
function editProduct(productId) {
    openProductModal(productId);
}

/**
 * Confirma exclusão de produto
 */
function confirmDeleteProduct(productId) {
    productToDelete = productId;
    const modal = document.getElementById('confirmModal');
    modal.classList.add('active');
}

/**
 * Fecha modal de confirmação
 */
function closeDeleteModal() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('active');
    productToDelete = null;
}

/**
 * Executa a exclusão do produto
 */
function handleDeleteConfirm() {
    if (!productToDelete) return;
    
    if (deleteProduct(productToDelete)) {
        showNotification('Produto excluído com sucesso!', 'success');
        closeDeleteModal();
        loadProducts();
    } else {
        showNotification('Erro ao excluir produto', 'error');
    }
}

// Torna funções globais para uso nos onclick do HTML
window.editProduct = editProduct;
window.confirmDeleteProduct = confirmDeleteProduct;
