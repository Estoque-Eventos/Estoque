// ===================================
// DASHBOARD - MÉTRICAS E ALERTAS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Verifica autenticação
    checkAuth(true);
    
    // Inicializa dashboard
    loadDashboard();
    
    // Atualiza a cada 30 segundos
    setInterval(updateStats, 30000);
    
    // Evento de atualizar alertas
    const refreshAlertsBtn = document.getElementById('refreshAlerts');
    refreshAlertsBtn?.addEventListener('click', () => {
        loadAlerts();
        showNotification('Alertas atualizados', 'success', 2000);
    });
    
    // Verifica se há âncora de alertas na URL
    if (window.location.hash === '#alerts') {
        setTimeout(() => {
            document.querySelector('.alerts-container')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
});

/**
 * Carrega todas as informações do dashboard
 */
function loadDashboard() {
    updateStats();
    loadAlerts();
    loadCharts();
    loadRecentProducts();
}

/**
 * Atualiza as estatísticas do dashboard
 */
function updateStats() {
    const stats = getStockStats();
    
    // Atualiza os cards de estatísticas
    document.getElementById('totalProducts').textContent = stats.totalProducts;
    document.getElementById('lowStock').textContent = stats.lowStock;
    document.getElementById('expiringProducts').textContent = stats.expiring;
    document.getElementById('totalValue').textContent = formatCurrency(stats.totalValue);
}

/**
 * Carrega e exibe os alertas prioritários
 */
function loadAlerts() {
    const alerts = getStockAlerts();
    const alertsContainer = document.getElementById('alertsContainer');
    
    if (!alertsContainer) return;
    
    if (alerts.length === 0) {
        alertsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <p>Nenhum alerta no momento</p>
            </div>
        `;
        return;
    }
    
    // Mostra apenas os 10 primeiros alertas
    const topAlerts = alerts.slice(0, 10);
    
    alertsContainer.innerHTML = topAlerts.map(alert => `
        <div class="alert-item alert-${alert.type}">
            <div class="alert-icon">
                <i class="${alert.icon}"></i>
            </div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-description">${alert.description}</div>
            </div>
            <a href="products.html" class="alert-action">
                <i class="fas fa-chevron-right"></i>
            </a>
        </div>
    `).join('');
}

/**
 * Carrega os gráficos
 */
function loadCharts() {
    loadCategoryChart();
    loadStockChart();
}

/**
 * Gráfico de produtos por categoria
 */
function loadCategoryChart() {
    const products = getUserProducts();
    
    // Agrupa por categoria
    const categories = {};
    products.forEach(product => {
        const category = product.category || 'Sem categoria';
        categories[category] = (categories[category] || 0) + 1;
    });
    
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    // Destrói gráfico anterior se existir
    if (window.categoryChartInstance) {
        window.categoryChartInstance.destroy();
    }
    
    if (labels.length === 0) {
        ctx.parentElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-pie"></i>
                <p>Adicione produtos para visualizar estatísticas</p>
            </div>
        `;
        return;
    }
    
    window.categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#2563eb',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#06b6d4',
                    '#8b5cf6',
                    '#ec4899',
                    '#14b8a6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Gráfico de produtos com menor estoque
 */
function loadStockChart() {
    const products = getUserProducts();
    
    // Pega os 8 produtos com menor estoque (baseado no percentual de estoque atual vs mínimo)
    const sortedProducts = products
        .filter(p => p.quantity > 0) // Apenas produtos em estoque
        .map(p => ({
            name: p.name,
            quantity: p.quantity,
            minStock: p.minStock,
            percentage: ((p.quantity / p.minStock) * 100)
        }))
        .sort((a, b) => a.percentage - b.percentage)
        .slice(0, 8);
    
    const ctx = document.getElementById('stockChart');
    if (!ctx) return;
    
    // Destrói gráfico anterior se existir
    if (window.stockChartInstance) {
        window.stockChartInstance.destroy();
    }
    
    if (sortedProducts.length === 0) {
        ctx.parentElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-bar"></i>
                <p>Adicione produtos para visualizar estatísticas</p>
            </div>
        `;
        return;
    }
    
    const labels = sortedProducts.map(p => p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name);
    const quantities = sortedProducts.map(p => p.quantity);
    const minStocks = sortedProducts.map(p => p.minStock);
    
    window.stockChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Quantidade Atual',
                    data: quantities,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                },
                {
                    label: 'Estoque Mínimo',
                    data: minStocks,
                    backgroundColor: '#ef4444',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} unidades`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

/**
 * Carrega os produtos recentes
 */
function loadRecentProducts() {
    const products = getUserProducts();
    const recentProductsTable = document.getElementById('recentProductsTable');
    
    if (!recentProductsTable) return;
    
    if (products.length === 0) {
        recentProductsTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty-cell">Nenhum produto cadastrado</td>
            </tr>
        `;
        return;
    }
    
    // Ordena por data de criação e pega os 5 mais recentes
    const recentProducts = products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    recentProductsTable.innerHTML = recentProducts.map(product => {
        const stockCheck = checkStock(product.quantity, product.minStock);
        const expiryCheck = product.expiryDate ? checkExpiry(product.expiryDate) : null;
        
        let statusBadge = '';
        let statusClass = 'status-ok';
        let statusText = 'Normal';
        
        if (stockCheck.isOut) {
            statusClass = 'status-out';
            statusText = 'Sem estoque';
        } else if (stockCheck.isLow) {
            statusClass = 'status-low';
            statusText = 'Estoque baixo';
        } else if (expiryCheck && (expiryCheck.isExpired || expiryCheck.isCritical)) {
            statusClass = 'status-expiring';
            statusText = expiryCheck.isExpired ? 'Vencido' : 'Validade crítica';
        } else if (expiryCheck && expiryCheck.isExpiring) {
            statusClass = 'status-expiring';
            statusText = 'Vence em breve';
        }
        
        statusBadge = `<span class="status-badge ${statusClass}">${statusText}</span>`;
        
        return `
            <tr>
                <td><strong>${product.name}</strong></td>
                <td>${product.category || '-'}</td>
                <td>${product.quantity} ${product.unit || 'UN'}</td>
                <td>${product.expiryDate ? formatDate(product.expiryDate) : '-'}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}
