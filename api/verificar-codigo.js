const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });
    const { email, codigoDigitado } = req.body;

    try {
        await client.connect();
        const db = client.db('meuSaaS');
        const registro = await db.collection('codigos').findOne({ email, codigo: codigoDigitado });

        if (registro) {
            await db.collection('codigos').deleteOne({ _id: registro._id });
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ error: 'Código inválido.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro no banco.' });
    } finally {
        await client.close();
    }
}
