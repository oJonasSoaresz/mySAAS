const { Resend } = require('resend');
const { MongoClient } = require('mongodb'); // Importe o MongoClient

const resend = new Resend(process.env.RESEND_API_KEY);
const client = new MongoClient(process.env.MONGODB_URI); // Conecte usando a variável da Vercel

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { email } = req.body;
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // 1. Salvar no MongoDB
    await client.connect();
    const db = client.db('meuSaaS'); // Nome do seu banco
    await db.collection('codigos').updateOne(
        { email: email }, 
        { $set: { codigo: codigo, createdAt: new Date() } }, 
        { upsert: true } // Se o email já tiver um código, atualiza o antigo
    );

    // 2. Enviar o e-mail pelo Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Seu código de acesso Linkei',
      html: `... (seu HTML aqui) ...`
    });

    return res.status(200).json({ message: 'Código enviado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
