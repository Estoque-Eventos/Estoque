// ===================================
// FUNÇÕES AUXILIARES E UTILIDADES
// ===================================

/**
 * Exibe uma notificação temporária na tela
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duração em ms (padrão: 3000)
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

/**
 * Formata uma data para o formato brasileiro
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data formatada (DD/MM/YYYY)
 */
function formatDate(date) {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * Formata um valor numérico para moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado (R$ 1.234,56)
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}

/**
 * Calcula a diferença em dias entre duas datas
 * @param {string|Date} date1 - Primeira data
 * @param {string|Date} date2 - Segunda data (padrão: hoje)
 * @returns {number} Diferença em dias
 */
function daysDifference(date1, date2 = new Date()) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = d1 - d2;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Verifica se um produto está próximo do vencimento
 * @param {string|Date} expiryDate - Data de validade
 * @returns {Object} { isExpiring: boolean, isCritical: boolean, daysLeft: number }
 */
function checkExpiry(expiryDate) {
    if (!expiryDate) return { isExpiring: false, isCritical: false, daysLeft: null };
    
    const daysLeft = daysDifference(expiryDate);
    
    return {
        isExpiring: daysLeft <= 30 && daysLeft > 0,
        isCritical: daysLeft <= 7 && daysLeft > 0,
        isExpired: daysLeft <= 0,
        daysLeft: daysLeft
    };
}

/**
 * Verifica se o estoque está baixo
 * @param {number} currentStock - Quantidade atual
 * @param {number} minStock - Estoque mínimo
 * @returns {Object} { isLow: boolean, isOut: boolean }
 */
function checkStock(currentStock, minStock) {
    return {
        isLow: currentStock <= minStock && currentStock > 0,
        isOut: currentStock === 0
    };
}

/**
 * Gera um ID único
 * @returns {string} ID único
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Salva dados no localStorage
 * @param {string} key - Chave
 * @param {*} data - Dados a serem salvos
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
        return false;
    }
}

/**
 * Recupera dados do localStorage
 * @param {string} key - Chave
 * @param {*} defaultValue - Valor padrão se não encontrar
 * @returns {*} Dados recuperados
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Erro ao ler do localStorage:', error);
        return defaultValue;
    }
}

/**
 * Remove dados do localStorage
 * @param {string} key - Chave
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
        return false;
    }
}

/**
 * Verifica se o usuário está autenticado
 * @returns {Object|null} Dados do usuário ou null
 */
function getCurrentUser() {
    return getFromStorage('currentUser', null);
}

/**
 * Verifica autenticação e redireciona se necessário
 * @param {boolean} requireAuth - Se true, requer autenticação
 */
function checkAuth(requireAuth = true) {
    const user = getCurrentUser();
    const isAuthPage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname === '/' ||
                       window.location.pathname === '';
    
    if (requireAuth && !user && !isAuthPage) {
        // Não autenticado, precisa de autenticação, não está na página de login
        window.location.href = 'index.html';
    } else if (!requireAuth && user && !isAuthPage) {
        // Autenticado, não precisa de autenticação, não está na página de login
        window.location.href = 'dashboard.html';
    }
}

/**
 * Faz logout do usuário
 */
function logout() {
    removeFromStorage('currentUser');
    window.location.href = 'index.html';
}

/**
 * Obtém todos os produtos do usuário atual
 * @returns {Array} Lista de produtos
 */
function getUserProducts() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const allProducts = getFromStorage('products', []);
    return allProducts.filter(p => p.userId === user.id);
}

/**
 * Salva um produto
 * @param {Object} product - Dados do produto
 * @returns {boolean} Sucesso
 */
function saveProduct(product) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const allProducts = getFromStorage('products', []);
    
    if (product.id) {
        // Atualização
        const index = allProducts.findIndex(p => p.id === product.id);
        if (index !== -1) {
            allProducts[index] = { ...product, userId: user.id, updatedAt: new Date().toISOString() };
        }
    } else {
        // Novo produto
        product.id = generateId();
        product.userId = user.id;
        product.createdAt = new Date().toISOString();
        product.updatedAt = new Date().toISOString();
        allProducts.push(product);
    }
    
    return saveToStorage('products', allProducts);
}

/**
 * Deleta um produto
 * @param {string} productId - ID do produto
 * @returns {boolean} Sucesso
 */
function deleteProduct(productId) {
    const allProducts = getFromStorage('products', []);
    const filteredProducts = allProducts.filter(p => p.id !== productId);
    return saveToStorage('products', filteredProducts);
}

/**
 * Obtém alertas do estoque
 * @returns {Array} Lista de alertas
 */
function getStockAlerts() {
    const products = getUserProducts();
    const alerts = [];
    
    products.forEach(product => {
        // Alerta de estoque baixo
        const stockCheck = checkStock(product.quantity, product.minStock);
        if (stockCheck.isOut) {
            alerts.push({
                type: 'danger',
                icon: 'fas fa-exclamation-circle',
                title: 'Produto sem estoque',
                description: `${product.name} está sem estoque disponível`,
                product: product,
                priority: 3
            });
        } else if (stockCheck.isLow) {
            alerts.push({
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                title: 'Estoque baixo',
                description: `${product.name} está com apenas ${product.quantity} unidades (mínimo: ${product.minStock})`,
                product: product,
                priority: 2
            });
        }
        
        // Alerta de validade
        if (product.expiryDate) {
            const expiryCheck = checkExpiry(product.expiryDate);
            if (expiryCheck.isExpired) {
                alerts.push({
                    type: 'danger',
                    icon: 'fas fa-calendar-times',
                    title: 'Produto vencido',
                    description: `${product.name} venceu em ${formatDate(product.expiryDate)}`,
                    product: product,
                    priority: 3
                });
            } else if (expiryCheck.isCritical) {
                alerts.push({
                    type: 'danger',
                    icon: 'fas fa-clock',
                    title: 'Validade crítica',
                    description: `${product.name} vence em ${expiryCheck.daysLeft} dias`,
                    product: product,
                    priority: 3
                });
            } else if (expiryCheck.isExpiring) {
                alerts.push({
                    type: 'warning',
                    icon: 'fas fa-clock',
                    title: 'Validade próxima',
                    description: `${product.name} vence em ${expiryCheck.daysLeft} dias`,
                    product: product,
                    priority: 2
                });
            }
        }
    });
    
    // Ordena por prioridade
    alerts.sort((a, b) => b.priority - a.priority);
    
    return alerts;
}

/**
 * Obtém estatísticas do estoque
 * @returns {Object} Estatísticas
 */
function getStockStats() {
    const products = getUserProducts();
    
    let totalValue = 0;
    let lowStockCount = 0;
    let expiringCount = 0;
    
    products.forEach(product => {
        totalValue += (product.quantity * product.price);
        
        const stockCheck = checkStock(product.quantity, product.minStock);
        if (stockCheck.isLow || stockCheck.isOut) {
            lowStockCount++;
        }
        
        if (product.expiryDate) {
            const expiryCheck = checkExpiry(product.expiryDate);
            if (expiryCheck.isExpiring || expiryCheck.isCritical || expiryCheck.isExpired) {
                expiringCount++;
            }
        }
    });
    
    return {
        totalProducts: products.length,
        totalValue: totalValue,
        lowStock: lowStockCount,
        expiring: expiringCount
    };
}

/**
 * Exporta produtos para CSV
 */
function exportToCSV() {
    const products = getUserProducts();
    
    if (products.length === 0) {
        showNotification('Não há produtos para exportar', 'warning');
        return;
    }
    
    // Cabeçalho
    let csv = 'SKU;Nome;Categoria;Quantidade;Estoque Mínimo;Preço Unitário;Unidade;Fornecedor;Validade;Descrição\n';
    
    // Dados
    products.forEach(product => {
        csv += `${product.sku};`;
        csv += `${product.name};`;
        csv += `${product.category};`;
        csv += `${product.quantity};`;
        csv += `${product.minStock};`;
        csv += `${product.price};`;
        csv += `${product.unit || 'UN'};`;
        csv += `${product.supplier || ''};`;
        csv += `${product.expiryDate ? formatDate(product.expiryDate) : ''};`;
        csv += `${product.description || ''}\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `estoque_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Produtos exportados com sucesso!', 'success');
}

/**
 * Atualiza a data atual no header
 */
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('pt-BR', options);
    }
}

/**
 * Inicializa comportamento da sidebar em mobile
 */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', () => {
            sidebar?.classList.toggle('active');
        });
    }
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar?.classList.remove('active');
        });
    }
    
    // Fechar sidebar ao clicar fora em mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (sidebar && 
                sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !mobileSidebarToggle?.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

/**
 * Atualiza informações do usuário na sidebar
 */
function updateUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    
    const userNameElements = document.querySelectorAll('#userName');
    const userEmailElements = document.querySelectorAll('#userEmail');
    
    userNameElements.forEach(el => el.textContent = user.name);
    userEmailElements.forEach(el => el.textContent = user.email);
}

/**
 * Atualiza badges de produtos e alertas
 */
function updateBadges() {
    const stats = getStockStats();
    const alerts = getStockAlerts();
    
    const totalProductsBadges = document.querySelectorAll('#totalProductsBadge');
    const alertsBadges = document.querySelectorAll('#alertsBadge');
    
    totalProductsBadges.forEach(el => el.textContent = stats.totalProducts);
    alertsBadges.forEach(el => {
        el.textContent = alerts.length;
        el.style.display = alerts.length > 0 ? 'inline-block' : 'none';
    });
}

/**
 * Inicializa botão de logout
 */
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                logout();
            }
        });
    }
}

/**
 * Inicializa navegação para alertas
 */
function initAlertsNav() {
    const alertsNav = document.getElementById('alertsNav');
    if (alertsNav) {
        alertsNav.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'dashboard.html#alerts';
        });
    }
}

// Inicialização comum para todas as páginas do dashboard
if (document.querySelector('.dashboard-page')) {
    document.addEventListener('DOMContentLoaded', () => {
        updateCurrentDate();
        initSidebar();
        updateUserInfo();
        updateBadges();
        initLogout();
        initAlertsNav();
    });
}
