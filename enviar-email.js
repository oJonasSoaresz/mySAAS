const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // A Vercel só permite POST para este endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Nota: use seu domínio verificado aqui depois
      to: email,
      subject: 'Bem-vindo ao Linkei!',
      html: '<p>Obrigado por se cadastrar no <strong>Linkei</strong>!</p>'
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}