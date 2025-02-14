import * as functions from 'firebase-functions';
import * as cors from 'cors';

const corsHandler = cors({ origin: true });

export const callAnthropic = functions.https.onRequest((request, response) => {
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
    } catch (error: any) {
      console.error('Error:', error);
      response.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message 
      });
    }
  });
}); 