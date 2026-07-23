const vonage = new Vonage({
  apiKey: "c5f521d1",
  apiSecret: "uT08ssF047MQvcDr"
});

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { numero } = req.body;

    if (!numero) {
        return res.status(400).json({ error: 'Numéro manquant' });
    }

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
        console.error("Erreur Vonage:", error);
        return res.status(500).json({ error: error.message || 'Erreur interne SMS' });
    }
};
