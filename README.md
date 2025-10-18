# Sistema de Gestão de Treinamentos Corporativos

Este projeto é uma aplicação Angular para gerenciamento de treinamentos corporativos, permitindo que empresas organizem, acompanhem e gerenciem programas de capacitação de funcionários.

## Visão Geral

<img width="1915" height="912" alt="Captura de tela 2025-10-18 174148" src="https://github.com/user-attachments/assets/9957d984-8826-4fae-9dc5-ad032e997c10" />
<img width="1915" height="911" alt="Captura de tela 2025-10-18 174317" src="https://github.com/user-attachments/assets/2f1be52e-a0a0-4826-b388-fe69a71e6e1f" />


O sistema oferece uma plataforma completa para:
- Gerenciamento de cursos e trilhas de aprendizagem
- Acompanhamento de progresso dos usuários
- Agendamento de atividades e prazos
- Relatórios de desempenho
- Sistema de autenticação com diferentes níveis de acesso

## Tecnologias Utilizadas

- **Angular 19** - Framework principal
- **TypeScript** - Linguagem de programação
- **RxJS** - Programação reativa
- **Angular Material** - Componentes de UI
- **Bootstrap 5** - Framework CSS
- **FullCalendar** - Componente de calendário
- **Ngx-Charts** - Biblioteca de gráficos

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/          # Componentes da aplicação
│   ├── guards/              # Guardas de rota
│   ├── models/              # Modelos de dados
│   ├── services/            # Serviços
│   ├── styles/              # Estilos globais
│   └── utils/               # Funções utilitárias
├── assets/                  # Recursos estáticos
└── environments/            # Configurações de ambiente
```

## Funcionalidades Principais

<img width="1916" height="910" alt="Captura de tela 2025-10-18 174200" src="https://github.com/user-attachments/assets/6836882b-e730-4ef5-a911-9e94297608b4" />
<img width="1915" height="910" alt="Captura de tela 2025-10-18 174215" src="https://github.com/user-attachments/assets/81953583-4514-4e40-ac99-83fbefd84f24" />
<img width="1915" height="910" alt="Captura de tela 2025-10-18 174215" src="https://github.com/user-attachments/assets/82fad066-b835-4e20-94bc-63c372282d34" />
<img width="1916" height="915" alt="Captura de tela 2025-10-18 174245" src="https://github.com/user-attachments/assets/4c3e723d-2269-4a1f-a3cd-fe7f4dcc37a1" />
<img width="1919" height="910" alt="Captura de tela 2025-10-18 174256" src="https://github.com/user-attachments/assets/99aaafe1-4472-4fcb-95c9-345a0b2cca33" />
<img width="1919" height="911" alt="Captura de tela 2025-10-18 174303" src="https://github.com/user-attachments/assets/40ccca70-4655-473e-bd93-980ea3a3a5d2" />


### Para Usuários Comuns:
- **Dashboard Personalizado**: Visão geral dos cursos em andamento e recomendados
- **Catálogo de Cursos**: Navegação por temas como Segurança, Liderança, Compliance, etc.
- **Visualizador de Módulos**: Interface Udemy-style para consumo de conteúdo
- **Trilhas de Aprendizagem**: Caminhos estruturados para desenvolvimento profissional
- **Agenda**: Visualização de prazos e eventos no calendário

### Para Administradores:
- **Gestão de Cursos**: Criação, edição e exclusão de cursos
- **Gerenciamento de Trilhas**: Criação de caminhos de aprendizagem
- **Relatórios**: Acompanhamento de progresso e desempenho
- **Agendamento**: Configuração de eventos e prazos

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (geralmente vem com o Node.js)

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd projeto-final
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

## Execução

### Servidor de Desenvolvimento

Para iniciar um servidor de desenvolvimento local:

```bash
ng serve
```

Ou usando o script npm:

```bash
npm start
```

Após a compilação, acesse `http://localhost:4200/` no seu navegador. A aplicação será recarregada automaticamente sempre que você modificar qualquer arquivo.

### Credenciais de Acesso

- **Administrador**: 
  - Usuário: `admin`
  - Senha: `123456`
  
- **Usuário Comum**:
  - Usuário: `usuario`
  - Senha: `123456`

## Geração de Código

O Angular CLI inclui ferramentas poderosas de scaffolding. Para gerar um novo componente:

```bash
ng generate component nome-do-componente
```

Para outros tipos de artefatos (diretivas, pipes, serviços, etc.):

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```

## Compilação

Para construir o projeto para produção:

```bash
ng build
```

Os artefatos serão armazenados no diretório `dist/`. Por padrão, a compilação para produção inclui otimizações para melhor performance.

## Testes

### Testes Unitários

Para executar testes unitários com o Karma:

```bash
ng test
```

### Testes End-to-End

Para testes end-to-end:

```bash
ng e2e
```

*Nota: O Angular CLI não vem com um framework de testes end-to-end por padrão. Você pode escolher um que se adeque às suas necessidades.*

## Recursos Adicionais

- [Documentação do Angular](https://angular.dev/)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)

## Funcionalidades Detalhadas

### Sistema de Cursos
- Cursos organizados por temas (Segurança, Liderança, Compliance, Soft Skills, Técnico)
- Módulos de diferentes tipos (vídeos, quizzes, leituras, apresentações, assignments)
- Acompanhamento de progresso individual
- Requisitos de conclusão sequencial

### Trilhas de Aprendizagem
- Caminhos estruturados para desenvolvimento profissional
- Agrupamento de cursos relacionados
- Acompanhamento de progresso nas trilhas

### Sistema de Agendamento
- Integração com calendário FullCalendar
- Visualização mensal e semanal
- Eventos personalizados
- Prazos de cursos e trilhas

### Relatórios e Analytics
- Dashboards com métricas de desempenho
- Gráficos de acompanhamento
- Relatórios de conclusão

## Perfis de Usuário

### Administrador
- Acesso completo a todas as funcionalidades
- Gestão de cursos e trilhas
- Relatórios detalhados
- Configuração do sistema

### Usuário Comum
- Acesso ao catálogo de cursos
- Consumo de conteúdo
- Acompanhamento de progresso
- Participação em trilhas de aprendizagem

## Desenvolvimento

### Estrutura de Componentes
- **Login/Register**: Autenticação de usuários
- **Home**: Dashboard principal
- **Trainings**: Lista de treinamentos
- **Learning Paths**: Trilhas de aprendizagem
- **Schedule**: Calendário de eventos
- **Reports**: Relatórios e analytics
- **Course Management**: Gestão de cursos (admin)
- **Course Module Viewer**: Visualizador de conteúdo

### Serviços Principais
- **AuthService**: Gerenciamento de autenticação e sessão
- **TrainingService**: Gerenciamento de cursos, trilhas e treinamentos
- **Guards**: Proteção de rotas baseada em permissões

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 19.2.17.
