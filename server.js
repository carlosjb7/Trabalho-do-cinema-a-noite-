const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuração do banco de dados
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_GD3pHlWqXR5h@ep-purple-moon-ac8bn24w-pooler.sa-east-1.aws.neon.tech/cadastros?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('.')); // Servir arquivos estáticos

// Configuração de sessão
app.use(session({
  secret: 'seu-secret-key-aqui-mude-em-producao',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true em produção com HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para verificar autenticação
function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Não autenticado' });
  }
}

// Criar tabela users se não existir
async function criarTabela() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
      );
    `;
    await pool.query(query);
    console.log('Tabela users verificada/criada com sucesso');
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
  }
}

// Inicializar tabela
criarTabela();

// Rota POST /cadastrar
app.post('/cadastrar', async (req, res) => {
  try {
    const { nome, cpf, email, senha } = req.body;

    // Validação de campos
    if (!nome || !cpf || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Falha ao salvar os dados! Motivo: todos os campos são obrigatórios'
      });
    }

    // Remover formatação do CPF
    const cpfLimpo = cpf.replace(/\D/g, '');

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir no banco
    const result = await pool.query(
      'INSERT INTO users (nome, cpf, email, senha) VALUES ($1, $2, $3, $4) RETURNING id',
      [nome, cpfLimpo, email, senhaHash]
    );

    res.json({
      success: true,
      message: 'dados salvos com sucesso',
      redirect: '/autenticacao.html'
    });

  } catch (error) {
    let mensagemErro = 'Falha ao salvar os dados! Motivo: ';

    if (error.code === '23505') { // Violação de constraint única
      if (error.constraint === 'users_cpf_key') {
        mensagemErro += 'CPF já cadastrado';
      } else if (error.constraint === 'users_email_key') {
        mensagemErro += 'Email já cadastrado';
      } else {
        mensagemErro += 'Dados duplicados';
      }
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      mensagemErro += 'erro de conexão com o banco de dados';
    } else {
      mensagemErro += error.message || 'erro desconhecido';
    }

    res.status(500).json({
      success: false,
      message: mensagemErro
    });
  }
});

// Rota POST /login
app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const login = email || req.body.cpf; // Aceita email ou cpf

    if (!login || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Falha no login! Motivo: email/CPF e senha são obrigatórios'
      });
    }

    // Buscar usuário por email ou CPF
    const query = login.includes('@') 
      ? 'SELECT * FROM users WHERE email = $1'
      : 'SELECT * FROM users WHERE cpf = $1';

    const result = await pool.query(query, [login]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Falha no login! Motivo: email/CPF não encontrado'
      });
    }

    const user = result.rows[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Falha no login! Motivo: senha incorreta'
      });
    }

    // Criar sessão
    req.session.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      cpf: user.cpf
    };

    res.json({
      success: true,
      message: 'login realizado com sucesso',
      redirect: '/index.html',
      user: {
        nome: user.nome
      }
    });

  } catch (error) {
    let mensagemErro = 'Falha no login! Motivo: ';

    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      mensagemErro += 'erro de conexão com o banco de dados';
    } else {
      mensagemErro += error.message || 'erro desconhecido';
    }

    res.status(500).json({
      success: false,
      message: mensagemErro
    });
  }
});

// Rota GET /logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao fazer logout'
      });
    }
    res.json({
      success: true,
      redirect: '/index.html'
    });
  });
});

// Rota GET /check-session
app.get('/check-session', (req, res) => {
  if (req.session.user) {
    res.json({
      authenticated: true,
      user: req.session.user
    });
  } else {
    res.json({
      authenticated: false
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

