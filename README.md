# FrontEnd PI - Senac

Este repositório contém o código-fonte do front-end desenvolvido para o Projeto Integrador do curso de Coding Mobile do Senac. O projeto foi desenvolvido utilizando React e Bootstrap para criação de uma interface de usuário moderna, responsiva e funcional.

## 📚 Tecnologias Utilizadas

- **React** — Biblioteca JavaScript para construção de interfaces de usuário
- **Create React App** — Ferramenta para inicializar e configurar projetos React
- **Bootstrap** — Framework de CSS para design responsivo
- **JavaScript (ES6+)** — Linguagem de programação principal
- **HTML5** — Estruturação das páginas web
- **CSS3** — Estilização das páginas web

## 🛠️ Estrutura de Pastas
FrontEnd-PI-Senac-CM/
│
├── public/ # Arquivos estáticos públicos (favicon, index.html)
├── src/ # Código-fonte da aplicação
│ ├── components/ # Componentes React reutilizáveis
│ ├── assets/ # Itens estáticos
│ ├── pages/ # Páginas principais da aplicação
│ ├── router/ # Arquivos relativos as rotas
│ ├── utils/ # Arquivos relativos a aplicações gerais e recorrentes
│ ├── Api/ # Lógica de comunicação com a API
│ ├── App.js # Componente raiz da aplicação
│ └── index.js # Ponto de entrada do React
├── package.json # Gerenciamento de dependências e scripts
└── .gitignore # Arquivos ignorados pelo Git


## ⚙️ Como Rodar o Projeto Localmente

1. Clone este repositório:
   ```bash
   git clone https://github.com/GabrielMartinsDoliveira/FrontEnd-PI-Senac-CM.git
Navegue até o diretório do projeto:

bash
cd FrontEnd-PI-Senac-CM
Instale as dependências:

bash
npm install
Inicie o servidor de desenvolvimento:

bash
npm start
O servidor estará rodando em: https://forenseek.onrender.com/

Logins para testar funcionalidades:

Administrador: matrícula - 000.111.222-33, senha - teste0987

Perito: matrícula - 123.456.789-01, senha - teste1234

Assistente: matrícula - 222.111.212.31, senha - marconi123

🔐 Funcionalidades Principais
Interface amigável e responsiva com Bootstrap

Integração com a API do back-end para operações CRUD

Navegação entre páginas com React Router

Componentes reutilizáveis e organizados

Separação de responsabilidades via diretórios distintos (serviços, componentes, páginas)

👥 Colaboradores
Gabriel Martins

Mateus Henrique de Assis

Erick Lopes

Este projeto é de uso educacional e acadêmico no contexto do curso de Coding Mobile do Senac.

🚀 Melhorias Futuras
Utilização da localização do usuário ao criar certas entidades

Implementação de testes automatizados com Jest e React Testing Library

Otimização de performance e SEO

Melhorias em acessibilidade (A11Y)