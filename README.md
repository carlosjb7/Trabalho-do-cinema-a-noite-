# Cinema à Noite

Projeto de aprendizado em desenvolvimento web com páginas de filmes, cadastro e autenticação. O repositório reúne contribuições de Carlos Gomes de Souza Junior e Alissao85, conforme o histórico do GitHub.

## Tecnologias presentes

- HTML, CSS e JavaScript na interface.
- Node.js e Express no servidor.
- PostgreSQL, biblioteca pg, bcrypt e express-session na implementação do backend.

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| index.html e demais páginas HTML | Interface e páginas temáticas de filmes |
| css/ | Estilos da interface |
| js/ | Scripts do navegador |
| imagens/ e produtos/ | Recursos do projeto |
| server.js | Rotas de cadastro, login e sessão |
| package.json e package-lock.json | Dependências do backend |

## Visualizar a interface

Baixe e extraia o repositório e abra index.html no navegador, preservando as pastas de recursos. Essa visualização isolada não comprova o funcionamento de cadastro, login ou persistência no banco.

## Estado do projeto

O backend está em desenvolvimento e precisa de revisão de configuração, segurança e testes de integração antes do uso. A presença das rotas não significa que todos os fluxos estejam validados. Não utilize dados pessoais reais em demonstrações.

## Próximas melhorias

- Externalizar configurações sensíveis em variáveis de ambiente.
- Revisar autenticação, sessões, validação de entrada e exposição de arquivos estáticos.
- Documentar preparação de um banco de testes e instalação das dependências.
- Registrar testes de cadastro, login, logout e tratamento de erros.
- Revisar o versionamento de node_modules e adotar .gitignore em uma alteração acordada com os colaboradores.

## Autoria e colaboração

Projeto colaborativo. Consulte o histórico de commits e pull requests para identificar as contribuições de cada participante. Melhorias de documentação preservam o código e os créditos existentes.
