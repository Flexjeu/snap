const { Vonage } = require('@vonage/server-sdk');

module.exports = async (req, res) => {
    // Force l'en-en-tête en JSON pour éviter les erreurs "Non-JSON"
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const { numero } = req.body;

        if (!numero) {
            return res.status(400).json({ error: 'Numéro manquant dans la requête' });
        }

        // ⚠️ REMPLACE "MET_TA_CLE_ICI" PAR TA VRAIE CLÉ À 8 CARACTÈRES VONAGE
        const vonage = new Vonage({
          apiKey: "c5f521d1",
          apiSecret: "uT08ssF047MQvcDr"
        });

        const numeroInternational = numero.replace(/^0/, '33');
        const codeValidation = Math.floor(1000 + Math.random() * 9000);

        await vonage.sms.send({
            to: numeroInternational,
            from: "SnapDemo",
            text: `Votre code de validation SnapDemo est : ${codeValidation}`
        });
        
        return res.status(200).json({ success: true, code: codeValidation });
    } catch (error) {
        console.error("Erreur critique Vonage:", error);
        return res.status(500).json({ error: error.message || 'Erreur interne lors de l\'envoi du SMS' });
    }
};
