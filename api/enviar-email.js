const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
  
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });

  // Gera um código de 6 dígitos aleatório
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Lembre-se: domínio não verificado limita o envio
      to: email,
      subject: 'Seu código de acesso Linkei',
      html: `<p>Seu código é: <strong>${codigo}</strong></p>`
    });

    return res.status(200).json({ message: 'Enviado!' });
  } catch (error) {
    console.error("ERRO DETALHADO:", error);
    return res.status(500).json({ error: error.message });
  }
}
