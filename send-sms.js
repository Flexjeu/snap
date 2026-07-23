const { Vonage } = require('@vonage/server-sdk');

export default async function handler(req, res) {
    // On n'accepte que les requêtes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { numero } = req.body;

    // Initialisation de Vonage
    // ATTENTION : Remplace 'TON_API_KEY_ICI' par ta vraie clé à 8 caractères
    const vonage = new Vonage({
      apiKey: "c5f521d1",
      apiSecret: "uT08ssF047MQvcDr"
    });

    // Vonage a besoin du format international (33 au lieu de 0 pour la France)
    // On transforme donc "0612345678" en "33612345678"
    const numeroInternational = numero.replace(/^0/, '33');

    // On génère un faux code à 4 chiffres pour le réalisme
    const codeValidation = Math.floor(1000 + Math.random() * 9000);

    const from = "SnapDemo"; // Le nom de l'expéditeur du SMS
    const to = numeroInternational;
    const text = `Votre code de validation SnapDemo est : ${codeValidation}`;

    try {
        // Envoi du SMS
        await vonage.sms.send({to, from, text});
        
        // On renvoie un succès au fichier HTML
        return res.status(200).json({ success: true, code: codeValidation });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Échec de l\'envoi du SMS' });
    }
}
