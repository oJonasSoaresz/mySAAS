const { Resend } = require('resend');
const { MongoClient } = require('mongodb');

const resend = new Resend(process.env.RESEND_API_KEY);
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await client.connect();
    const db = client.db('meuSaaS');
    await db.collection('codigos').updateOne(
        { email: email }, 
        { $set: { codigo: codigo, createdAt: new Date() } }, 
        { upsert: true }
    );

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Seu código de acesso Linkei',
      html: `<p>Seu código é: <strong>${codigo}</strong></p>`
    });

    return res.status(200).json({ message: 'Enviado!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    await client.close();
  }
}
