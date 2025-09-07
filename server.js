import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4200;

// Serve arquivos estáticos da pasta dist
app.use(express.static(path.join(__dirname, 'dist')));

// Captura todas as rotas para SPA
app.get('/dist', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
