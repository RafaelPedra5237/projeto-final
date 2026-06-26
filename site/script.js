// BANCO DE DADOS MOCK (Simulação de uma API)
const products = [
    {
        id: 1,
        name: "Smartphone Android 5G",
        price: 2499.00,
        category: "Eletrônicos",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        description: "Smartphone topo de linha com tela AMOLED de 120Hz, 256GB de armazenamento, câmera tripla de 108MP e bateria de longa duração para te acompanhar o dia inteiro."
    },
    {
        id: 2,
        name: "Notebook Ultrafino Pro",
        price: 4899.00,
        category: "Eletrônicos",
        image: "https://images.unsplash.com/photo-1496181130204-755241544e35?w=400",
        description: "Ideal para produtividade e criatividade. Processador de última geração, 16GB RAM, SSD NVMe de 512GB e uma tela com fidelidade de cores impressionante."
    },
    {
        id: 3,
        name: "Fone de Ouvido Bluetooth Noise Cancelling",
        price: 799.00,
        category: "Acessórios",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        description: "Isole-se do mundo e foque no som. Cancelamento de ruído ativo de nível premium, som de alta fidelidade e até 40 horas de autonomia de bateria."
    },
    {
        id: 4,
        name: "Smartwatch Sport Edition",
        price: 1200.00,
        category: "Eletrônicos",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        description: "Monitore sua saúde 24 horas por dia. Sensor de batimentos cardíacos, oxímetro, GPS integrado e dezenas de modos esportivos para seus treinos."
    },
    {
        id: 5,
        name: "Teclado Mecânico RGB",
        price: 450.00,
        category: "Acessórios",
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400",
        description: "Performance extrema para digitação ou jogos. Switches mecânicos duráveis, layout compacto e iluminação RGB totalmente personalizável via software."
    },
    {
        id: 6,
        name: "Mouse Gamer sem Fio",
        price: 350.00,
        category: "Acessórios",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400",
        description: "Alta precisão com sensor de 16000 DPI. Conexão sem fio ultrarrápida sem delay e design ergonômico feito para destros."
    }
];

let cartCount = 0;
let activeCategory = "Todos";

// SISTEMA DE NAVEGAÇÃO INTERNA (SPA)
function navigateTo(pageId) {
    // Esconde todas as páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Exibe a página selecionada
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Move o scroll para o topo automaticamente ao mudar de aba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FORMATAR MOEDA
function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// CARREGAR COMPONENTES AO INICIAR A PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    renderHomeProducts();
    renderSearchProducts(products);

    // Evento de busca por texto
    document.getElementById('search-btn').addEventListener('click', executeSearch);
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if(e.key === 'Enter') executeSearch();
    });
});

// COMPONENTE: Gerar card HTML do produto
function createProductCard(product) {
    return `
        <div class="product-card" onclick="viewProductDetail(${product.id})">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${formatCurrency(product.price)}</p>
            <button class="btn-primary" onclick="addToCart(event)">Adicionar ao Carrinho</button>
        </div>
    `;
}

// 1. LÓGICA DA PÁGINA INICIAL (HOME)
function renderHomeProducts() {
    const container = document.getElementById('featured-products');
    // Mostra os 3 primeiros itens como "Destaques"
    const featured = products.slice(0, 3);
    container.innerHTML = featured.map(p => createProductCard(p)).join('');
}

// 2. LÓGICA DA PÁGINA DE PESQUISA / LISTAGEM
function renderSearchProducts(productsList) {
    const container = document.getElementById('search-results');
    if(productsList.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gray-color);">Nenhum produto encontrado.</p>`;
        return;
    }
    container.innerHTML = productsList.map(p => createProductCard(p)).join('');
}

function executeSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = products.filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
        const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
        return matchesQuery && matchesCategory;
    });
    renderSearchProducts(filtered);
}

function filterCategory(category) {
    activeCategory = category;
    
    // Atualizar classe ativa dos botões de tag
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        if(tag.textContent === category) tag.classList.add('active');
        else tag.classList.remove('active');
    });

    executeSearch(); // Reaplica a busca unindo texto e categoria
}

// 3. LÓGICA DA PÁGINA DE DETALHES DO PRODUTO
function viewProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const container = document.getElementById('product-detail-container');
    container.innerHTML = `
        <div class="detail-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-info">
            <h1>${product.name}</h1>
            <p style="color: var(--gray-color); margin-bottom: 10px;">Categoria: <strong>${product.category}</strong></p>
            <div class="price">${formatCurrency(product.price)}</div>
            <p>${product.description}</p>
            <button class="btn-primary" style="padding: 15px 30px; font-size: 16px;" onclick="addToCart(event)">
                <i class="fa-solid fa-cart-plus"></i> Comprar Agora
            </button>
        </div>
    `;

    navigateTo('product-detail');
}

// 4. LÓGICA DA PÁGINA DE PERFIL
function saveProfile(event) {
    event.preventDefault();
    const newName = document.getElementById('username').value;
    
    // Atualiza o nome na barra lateral
    document.getElementById('profile-name-side').textContent = newName;
    alert("Perfil atualizado com sucesso!");
}

// INTERAÇÃO GLOBAL: Carrinho de Compras de mentirinha
function addToCart(event) {
    event.stopPropagation(); // Impede que o clique dispare o detalhe do card do produto
    cartCount++;
    document.getElementById('cart-count').textContent = cartCount;
    
    // Pequeno feedback visual amigável
    alert("Produto adicionado ao carrinho!");
}