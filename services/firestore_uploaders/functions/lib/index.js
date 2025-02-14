"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAnthropic = void 0;
const functions = require("firebase-functions");
const cors = require("cors");
const corsHandler = cors({ origin: true });
exports.callAnthropic = functions.https.onRequest((request, response) => {
    return corsHandler(request, response, async () => {
        // Only allow POST requests
        if (request.method !== 'POST') {
            response.status(405).send('Method Not Allowed');
            return;
        }
        try {
            const { prompt, context } = request.body;
            const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': functions.config().anthropic.key,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    messages: [{
                            role: 'user',
                            content: `You are the helpful AI assistant oomi on Justin Crisp's website, you're little silly and very helpful. Use this context about Justin to inform your response: ${context}\n\nUser question: ${prompt}`
                        }],
                    max_tokens: 1024
                })
            });
            const data = await anthropicResponse.json();
            response.json(data);
        }
        catch (error) {
            console.error('Error:', error);
            response.status(500).json({
                error: 'Internal Server Error',
                message: error.message
            });
        }
    });
});
//# sourceMappingURL=index.js.map