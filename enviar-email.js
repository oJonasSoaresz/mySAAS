const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  
  // Gera um código de 6 dígitos
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Lembre-se: use seu domínio verificado aqui depois
      to: email,
      subject: 'Seu código de acesso Linkei',
      html: `<h1>Olá!</h1><p>Seu código de acesso é: <strong>${codigo}</strong></p>`
    });

    // IMPORTANTE: Aqui você precisaria salvar esse código num banco de dados
    // associado a este e-mail para verificar depois.
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
