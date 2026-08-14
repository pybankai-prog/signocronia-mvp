import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { texto, historial } = await req.json();

    // Leemos la llave secreta
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key en el servidor' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: "Eres un asistente virtual diseñado exclusivamente para adultos mayores. Tu objetivo es acompañar y ayudar. Tono: extremadamente paciente, respetuoso (trata de 'Usted'), afectuoso. Regla ESTRICTA: Tus respuestas deben ser MUY cortas (máximo 2 o 3 oraciones). Cero palabras técnicas, cero anglicismos (no digas link, app, click). Si el usuario se frustra, cálmalo diciendo 'No se preocupe, vamos paso a paso'. Cada cierto tiempo recuérdale beber agua o descansar la vista."
    });

    const chat = model.startChat({ history: historial });
    const result = await chat.sendMessage(texto);
    const respuesta = result.response.text();

    return NextResponse.json({ respuesta });

  } catch (error) {
    console.error("Error en el servidor oculto:", error);
    return NextResponse.json({ error: 'Error interno de procesamiento' }, { status: 500 });
  }
}