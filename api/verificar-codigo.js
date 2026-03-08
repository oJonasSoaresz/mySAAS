const { MongoClient } = require('mongodb');

// URI conectando ao MongoDB (que você configurou na Vercel)
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    // 1. Aceita apenas o método POST (mais seguro)
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { email, codigoDigitado } = req.body;

    try {
        await client.connect();
        const db = client.db('meuSaaS'); // Nome do seu banco
        const collection = db.collection('codigos');

        // 2. Busca o código no banco filtrando por email E código
        const registro = await collection.findOne({ 
            email: email, 
            codigo: codigoDigitado 
        });

        // 3. Se encontrar o registro, o código está correto
        if (registro) {
            // Opcional: deleta o código do banco após o uso (evita reuso)
            await collection.deleteOne({ _id: registro._id });
            
            return res.status(200).json({ success: true, message: 'Código validado!' });
        } else {
            // Se não encontrar, o código está errado ou expirado
            return res.status(401).json({ success: false, message: 'Código inválido.' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao conectar ao banco de dados.' });
    } finally {
        await client.close(); // Fecha a conexão
    }
}
