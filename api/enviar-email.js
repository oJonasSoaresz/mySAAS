const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { email } = req.body;
  // Gera um código de 6 dígitos aleatório
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Lembre-se: use seu domínio verificado aqui depois
      to: email,
      subject: 'Seu código de acesso Linkei',
      html: `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
    <h2 style="color: #333;">Bem-vindo à família Linkei!</h2>
    <p style="font-size: 16px; color: #555;">Olá,</p>
    <p style="font-size: 16px; color: #555;">Você solicitou um código de acesso para entrar na sua conta. Aqui está o seu código:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; color: #000;">
        ${codigo}
      </span>
    </div>
    
    <p style="font-size: 14px; color: #888;">Este código expira em 10 minutos. Se você não solicitou este e-mail, ignore-o.</p>
    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
    <p style="font-size: 12px; color: #aaa;">Linkei - Conectando seu micro-SaaS ao mundo.</p>
  </div>
`
    });

    return res.status(200).json({ message: 'Código enviado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}



