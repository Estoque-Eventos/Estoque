// ===================================
// AUTENTICAÇÃO - LOGIN E CADASTRO
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se já está autenticado
    checkAuth(false);
    
    // Elementos do DOM
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    
    // Alterna entre formulários
    showRegisterLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm?.classList.add('hidden');
        registerForm?.classList.remove('hidden');
    });
    
    showLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm?.classList.add('hidden');
        loginForm?.classList.remove('hidden');
    });
    
    // Login
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validação básica
        if (!email || !password) {
            showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }
        
        // Busca usuários cadastrados
        const users = getFromStorage('users', []);
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            showNotification('Usuário não encontrado', 'error');
            return;
        }
        
        // Verifica senha (em produção, use hash)
        if (user.password !== password) {
            showNotification('Senha incorreta', 'error');
            return;
        }
        
        // Login bem-sucedido
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            company: user.company
        };
        
        saveToStorage('currentUser', userSession);
        
        if (rememberMe) {
            saveToStorage('rememberUser', email);
        }
        
        showNotification('Login realizado com sucesso!', 'success');
        
        // Redireciona para dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    });
    
    // Cadastro
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const company = document.getElementById('registerCompany').value.trim();
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        
        // Validações
        if (!name || !email || !password || !passwordConfirm) {
            showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('A senha deve ter no mínimo 6 caracteres', 'error');
            return;
        }
        
        if (password !== passwordConfirm) {
            showNotification('As senhas não coincidem', 'error');
            return;
        }
        
        if (!acceptTerms) {
            showNotification('Você precisa aceitar os termos de uso', 'error');
            return;
        }
        
        // Verifica se o e-mail já está cadastrado
        const users = getFromStorage('users', []);
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
            showNotification('Este e-mail já está cadastrado', 'error');
            return;
        }
        
        // Cria novo usuário
        const newUser = {
            id: generateId(),
            name: name,
            email: email,
            company: company,
            password: password, // Em produção, use hash
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        saveToStorage('users', users);
        
        showNotification('Cadastro realizado com sucesso!', 'success');
        
        // Faz login automático
        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            company: newUser.company
        };
        
        saveToStorage('currentUser', userSession);
        
        // Redireciona para dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    });
    
    // Preenche e-mail se "lembrar-me" estava ativo
    const rememberedEmail = getFromStorage('rememberUser');
    if (rememberedEmail) {
        const loginEmailInput = document.getElementById('loginEmail');
        if (loginEmailInput) {
            loginEmailInput.value = rememberedEmail;
            document.getElementById('rememberMe').checked = true;
        }
    }
});
