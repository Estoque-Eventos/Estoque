# 📦 Sistema de Gestão de Estoque

Sistema web completo e profissional para gerenciamento de estoque de produtos, desenvolvido com HTML5, CSS3 e JavaScript puro. Inspirado em soluções ERP como TOTVS, oferece controle total sobre produtos, alertas inteligentes e visualizações estatísticas.

![Status](https://img.shields.io/badge/status-ativo-success)
![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![Licença](https://img.shields.io/badge/licença-MIT-green)

## 🎯 Características Principais

### ✅ Funcionalidades Implementadas

#### 🔐 Sistema de Autenticação
- **Login seguro** com validação de credenciais
- **Cadastro de novos usuários** com confirmação de senha
- **Sessão persistente** com opção "Lembrar-me"
- **Dados isolados por usuário** - cada usuário gerencia seu próprio estoque
- Armazenamento seguro no localStorage

#### 📊 Dashboard Completo
- **Cards de métricas em tempo real:**
  - Total de produtos cadastrados
  - Produtos com estoque baixo
  - Produtos próximos ao vencimento
  - Valor total do estoque em R$
- **Sistema de alertas prioritários** com diferentes níveis de criticidade
- **Gráficos interativos** (Chart.js):
  - Distribuição de produtos por categoria (gráfico de rosca)
  - Produtos com menor estoque vs estoque mínimo (gráfico de barras)
- **Tabela de produtos recentes** com status visual

#### 🎯 Alertas Inteligentes
- **Alerta de Estoque Baixo:**
  - Detecta quando quantidade atual ≤ estoque mínimo
  - Alerta crítico quando estoque = 0
  - Notificações visuais em vermelho/laranja
- **Alerta de Validade:**
  - Aviso 30 dias antes do vencimento (amarelo)
  - Alerta crítico 7 dias antes (vermelho)
  - Notificação de produtos vencidos
- **Contador de alertas** no menu de navegação
- **Lista priorizada** de alertas no dashboard

#### 📦 Gestão Completa de Produtos (CRUD)
- **Cadastro de produtos** com campos completos:
  - Nome do produto
  - SKU/Código único
  - Categoria (Alimentos, Bebidas, Limpeza, Higiene, Eletrônicos, Outros)
  - Quantidade atual
  - Estoque mínimo
  - Preço unitário (R$)
  - Unidade de medida (UN, KG, L, CX, PC)
  - Data de validade
  - Fornecedor
  - Descrição detalhada
- **Edição de produtos existentes** com todos os dados
- **Exclusão de produtos** com confirmação
- **Validação de SKU duplicado**
- **Validação de dados** numéricos e obrigatórios

#### 🔍 Busca e Filtros Avançados
- **Busca em tempo real** por nome, SKU ou fornecedor
- **Filtro por categoria** (todas ou específica)
- **Filtro por status:**
  - Em estoque (normal)
  - Estoque baixo
  - Sem estoque
  - Validade próxima
- **Limpar filtros** com um clique
- **Paginação** (10 produtos por página)

#### 📤 Exportação de Dados
- **Exportar para CSV** todos os produtos
- Formato compatível com Excel/LibreOffice
- Inclui todos os campos do produto

#### 🎨 Design Profissional
- **Interface moderna e limpa** inspirada em TOTVS
- **Paleta de cores corporativa:**
  - Azul primário (#2563eb)
  - Verde para sucesso (#10b981)
  - Amarelo para avisos (#f59e0b)
  - Vermelho para alertas críticos (#ef4444)
- **Sidebar lateral** com navegação intuitiva
- **Cards com ícones** Font Awesome
- **Badges de status** coloridos e visuais
- **Animações suaves** e transições elegantes
- **100% Responsivo** - funciona perfeitamente em:
  - Desktop (1920px+)
  - Laptop (1024px - 1920px)
  - Tablet (768px - 1024px)
  - Mobile (320px - 768px)

#### 📱 Mobile First
- **Sidebar retrátil** em dispositivos móveis
- **Menu hambúrguer** para navegação
- **Tabelas responsivas** com scroll horizontal
- **Botões e formulários otimizados** para touch
- **Layout adaptativo** para todas as telas

## 🚀 Como Usar

### 1️⃣ Acesso Inicial
1. Abra o arquivo `index.html` no navegador
2. Você verá a tela de login

### 2️⃣ Criar uma Conta
1. Clique em "**Cadastre-se**"
2. Preencha os dados:
   - Nome completo
   - E-mail (será seu login)
   - Empresa (opcional)
   - Senha (mínimo 6 caracteres)
   - Confirme a senha
3. Aceite os termos de uso
4. Clique em "**Criar conta**"
5. Você será redirecionado automaticamente ao dashboard

### 3️⃣ Fazer Login
1. Digite seu e-mail e senha
2. (Opcional) Marque "Lembrar-me" para não precisar digitar o e-mail novamente
3. Clique em "**Entrar**"

### 4️⃣ Cadastrar Produtos
1. No dashboard ou na página de produtos, clique em "**+ Novo Produto**"
2. Preencha todos os campos obrigatórios (marcados com *)
3. Defina o estoque mínimo para receber alertas automáticos
4. (Opcional) Adicione data de validade para alertas de vencimento
5. Clique em "**Salvar Produto**"

### 5️⃣ Visualizar Alertas
- Os alertas aparecem automaticamente no **dashboard**
- O contador de alertas fica visível no **menu lateral**
- Clique no item "**Alertas**" para ver todos os alertas prioritários

### 6️⃣ Editar ou Excluir Produtos
1. Vá para "**Produtos**" no menu
2. Na tabela, use os botões:
   - **✏️ Editar** - abre o formulário preenchido
   - **🗑️ Excluir** - solicita confirmação antes de remover

### 7️⃣ Buscar e Filtrar
1. Use a **barra de busca** para encontrar produtos por nome, SKU ou fornecedor
2. Selecione uma **categoria** específica no filtro
3. Escolha um **status** (estoque baixo, sem estoque, etc.)
4. Clique em "**Limpar filtros**" para resetar

### 8️⃣ Exportar Dados
1. Na página de produtos, clique em "**📥 Exportar**"
2. Um arquivo CSV será baixado automaticamente
3. Abra com Excel, Google Sheets ou LibreOffice

## 📂 Estrutura do Projeto

```
gestao-estoque/
│
├── index.html              # Página de login/cadastro
├── dashboard.html          # Dashboard principal com métricas
├── products.html           # Gestão de produtos (CRUD)
│
├── css/
│   └── style.css          # Estilos completos do sistema
│
├── js/
│   ├── auth.js            # Autenticação (login/cadastro)
│   ├── dashboard.js       # Lógica do dashboard e gráficos
│   ├── products.js        # CRUD de produtos
│   └── utils.js           # Funções auxiliares e alertas
│
└── README.md              # Este arquivo
```

## 💾 Armazenamento de Dados

O sistema utiliza **localStorage** do navegador para persistência de dados:

### Estrutura de Dados

#### Usuários (`users`)
```javascript
{
  id: "string",           // ID único gerado automaticamente
  name: "string",         // Nome completo
  email: "string",        // E-mail (usado como login)
  company: "string",      // Empresa (opcional)
  password: "string",     // Senha (em produção, usar hash)
  createdAt: "ISO date"   // Data de criação
}
```

#### Sessão Atual (`currentUser`)
```javascript
{
  id: "string",
  name: "string",
  email: "string",
  company: "string"
}
```

#### Produtos (`products`)
```javascript
{
  id: "string",           // ID único gerado automaticamente
  userId: "string",       // ID do usuário proprietário
  name: "string",         // Nome do produto
  sku: "string",          // SKU/Código único
  category: "string",     // Categoria do produto
  supplier: "string",     // Fornecedor (opcional)
  quantity: number,       // Quantidade atual em estoque
  minStock: number,       // Estoque mínimo para alertas
  price: number,          // Preço unitário
  unit: "string",         // Unidade (UN, KG, L, CX, PC)
  expiryDate: "YYYY-MM-DD", // Data de validade (opcional)
  description: "string",  // Descrição detalhada (opcional)
  createdAt: "ISO date",  // Data de criação
  updatedAt: "ISO date"   // Data da última atualização
}
```

## 🎨 Paleta de Cores

```css
--primary-color: #2563eb;      /* Azul primário */
--success-color: #10b981;      /* Verde sucesso */
--warning-color: #f59e0b;      /* Amarelo aviso */
--danger-color: #ef4444;       /* Vermelho crítico */
--text-primary: #0f172a;       /* Texto principal */
--text-secondary: #475569;     /* Texto secundário */
--bg-primary: #ffffff;         /* Fundo branco */
--bg-secondary: #f8fafc;       /* Fundo cinza claro */
```

## 📊 Bibliotecas Utilizadas

- **[Font Awesome 6.4.0](https://fontawesome.com/)** - Ícones profissionais
- **[Google Fonts - Inter](https://fonts.google.com/)** - Tipografia moderna
- **[Chart.js](https://www.chartjs.org/)** - Gráficos interativos

## 🔒 Segurança

### ⚠️ Importante - Uso em Produção

Este sistema foi desenvolvido para fins de **demonstração e uso local**. Para uso em produção, considere:

1. **Senhas:**
   - Implementar hash de senhas (bcrypt, argon2)
   - Adicionar salt para maior segurança
   
2. **Autenticação:**
   - Usar tokens JWT
   - Implementar refresh tokens
   - Adicionar autenticação de dois fatores (2FA)
   
3. **Backend:**
   - Migrar do localStorage para banco de dados real
   - Implementar API REST com Node.js/PHP/Python
   - Adicionar validação server-side
   
4. **HTTPS:**
   - Servir apenas via HTTPS
   - Implementar CSP (Content Security Policy)

## 🌟 Recursos Futuros (Roadmap)

### Próximas Funcionalidades
- [ ] Relatórios em PDF
- [ ] Histórico de movimentações
- [ ] Entrada e saída de produtos
- [ ] Múltiplos usuários com permissões (admin, operador, visualizador)
- [ ] Integração com código de barras
- [ ] Notificações por e-mail
- [ ] Modo escuro (dark mode)
- [ ] Multi-idiomas (i18n)
- [ ] Backup e restauração de dados
- [ ] Dashboard customizável

## 🐛 Solução de Problemas

### Problema: Dados não são salvos
- **Causa:** localStorage desabilitado no navegador
- **Solução:** Habilite o localStorage nas configurações do navegador

### Problema: Gráficos não aparecem
- **Causa:** Chart.js não carregou ou erro no CDN
- **Solução:** Verifique sua conexão com a internet e recarregue a página

### Problema: Layout quebrado no mobile
- **Causa:** JavaScript não carregou corretamente
- **Solução:** Limpe o cache do navegador (Ctrl+Shift+Del)

### Problema: Login não funciona
- **Causa:** Dados corrompidos no localStorage
- **Solução:** Abra o console (F12) e execute: `localStorage.clear()`

## 📄 Licença

Este projeto está sob a licença MIT. Você é livre para usar, modificar e distribuir conforme necessário.

## 👨‍💻 Desenvolvido com

- ❤️ Paixão por desenvolvimento web
- ☕ Muito café
- 🎯 Foco em UX/UI profissional
- 📚 Boas práticas de código

## 📞 Suporte

Para dúvidas, sugestões ou reportar bugs:
- Abra uma issue no repositório
- Entre em contato com o desenvolvedor

---

**Versão:** 1.0.0  
**Última atualização:** Janeiro 2026  
**Status:** ✅ Totalmente funcional e pronto para uso

🚀 **Comece agora a gerenciar seu estoque de forma profissional!**
