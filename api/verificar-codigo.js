const { MongoClient } = require('mongodb');

// Define a conexão fora do handler para reutilização
const client = new MongoClient(process.env.MONGODB_URI);
let cachedDb = null;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { email, codigoDigitado } = req.body;

    try {
        // Reutiliza a conexão se já existir
        if (!cachedDb) {
            await client.connect();
            cachedDb = client.db('meuSaaS');
        }
        
        const collection = cachedDb.collection('codigos');

        const registro = await collection.findOne({ 
            email: email, 
            codigo: codigoDigitado 
        });

        if (registro) {
            await collection.deleteOne({ _id: registro._id });
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ error: 'Código inválido.' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Erro no banco.' });
    }
}
