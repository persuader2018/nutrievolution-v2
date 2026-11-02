export default async function handler(req, res) {
  // Solo permitimos peticiones de tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Vercel inyectará aquí tu clave secreta. ¡Nunca llega al navegador!
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key no configurada en Vercel' });
  }

  // Recogemos el modelo y los datos que envía tu web
  const { contents, modelo } = req.body;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await respuesta.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error al comunicar con Gemini' });
  }
}
