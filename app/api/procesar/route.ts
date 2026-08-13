import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Inicializamos el cliente de Groq con tu llave secreta
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { textoDelPdf } = body;

    if (!textoDelPdf) {
      return NextResponse.json({ error: 'No se envió texto' }, { status: 400 });
    }

    // Le pedimos a la IA que procese el texto (simplificación/resumen para accesibilidad)
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en accesibilidad. Tu tarea es tomar textos académicos y resumirlos de forma clara, usando oraciones cortas, para que puedan ser convertidos a audio o código Morse fácilmente.'
        },
        {
          role: 'user',
          content: textoDelPdf
        }
      ],
      model: 'llama-3.1-8b-instant',// Modelo súper rápido y gratuito
      temperature: 0.3,
    });

    const textoProcesado = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ resultado: textoProcesado });
    
  } catch (error) {
    console.error('Error en la IA:', error);
    return NextResponse.json({ error: 'Fallo al procesar con IA' }, { status: 500 });
  }
}