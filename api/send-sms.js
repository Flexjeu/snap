module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const numero = body ? body.numero : null;

        if (!numero) {
            return res.status(400).json({ error: 'Numéro manquant' });
        }

        const numeroInternational = numero.replace(/^0/, '33');
        const codeValidation = Math.floor(1000 + Math.random() * 9000);

        // Appel direct à l'API Vonage sans SDK externe
        const vonageResponse = await fetch('https://rest.nexmo.com/sms/json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                api_key: 'c5f521d1',
                api_secret: 'uT08ssF047MQvcDr',
                to: numeroInternational,
                from: 'SnapDemo',
                text: `Votre code de validation SnapDemo est : ${codeValidation}`
            })
        });

        const data = await vonageResponse.json();

        if (data.messages && data.messages[0].status === "0") {
            return res.status(200).json({ success: true, code: codeValidation });
        } else {
            const errorText = data.messages ? data.messages[0]['error-text'] : 'Erreur Vonage';
            return res.status(500).json({ error: errorText });
        }
    } catch (error) {
        console.error("Erreur critique:", error);
        return res.status(500).json({ error: error.message || 'Erreur interne' });
    }
};
