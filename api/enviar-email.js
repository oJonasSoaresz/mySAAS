const { Resend } = require('resend');
const { MongoClient } = require('mongodb');

const resend = new Resend(process.env.RESEND_API_KEY);
const client = new MongoClient(process.env.MONGODB_URI);
let cachedDb = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Conexão reutilizável
    if (!cachedDb) {
      await client.connect();
      cachedDb = client.db('meuSaaS');
    }

    // Salva ou atualiza o código no banco
    await cachedDb.collection('codigos').updateOne(
        { email: email }, 
        { $set: { codigo: codigo, createdAt: new Date() } }, 
        { upsert: true }
    );

    // Envia o e-mail
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Seu código de acesso Linkei',
      html: `<p>Seu código é: <strong>${codigo}</strong></p>`
    });

    return res.status(200).json({ message: 'Enviado!' });
  } catch (error) {
    console.error("ERRO DETALHADO NO BACKEND:", error);
    return res.status(500).json({ error: error.message });
  }
}
