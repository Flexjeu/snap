const { Vonage } = require('@vonage/server-sdk');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { numero } = req.body;

    // Récupération sécurisée des clés depuis Vercel
    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET
    });

    const numeroInternational = numero.replace(/^0/, '33');
    const codeValidation = Math.floor(1000 + Math.random() * 9000);

    try {
        await vonage.sms.send({
            to: numeroInternational,
            from: "SnapDemo",
            text: `Votre code de validation SnapDemo est : ${codeValidation}`
        });
        
        return res.status(200).json({ success: true, code: codeValidation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
