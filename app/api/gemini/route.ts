import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    console.log("🟢 1. Recibiendo petición en el Backend...");
    const { texto, historial } = await req.json();

    // Trampa: Busca la llave con cualquiera de los dos nombres
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (apiKey) {
      console.log("🟢 2. Llave detectada en el servidor: ¡SÍ!");
    } else {
      console.log("🔴 2. ERROR: El servidor NO encuentra la llave en .env.local");
      return NextResponse.json({ error: 'Falta la API Key en el servidor' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: "Eres un asistente virtual diseñado exclusivamente para adultos mayores. Tu objetivo es acompañar y ayudar. Tono: extremadamente paciente, respetuoso, afectuoso. Regla ESTRICTA: Tus respuestas deben ser MUY cortas (máximo 2 o 3 oraciones). Cero palabras técnicas, cero anglicismos. Si el usuario se frustra, cálmalo. Cada cierto tiempo recuérdale beber agua o descansar la vista."
    });

    console.log("🟢 3. Enviando mensaje a Google Gemini...");
    const chat = model.startChat({ history: historial });
    const result = await chat.sendMessage(texto);
    const respuesta = result.response.text();
    
    console.log("🟢 4. ¡Respuesta exitosa de Google!");
    return NextResponse.json({ respuesta });

  } catch (error: any) {
    // AQUÍ VEREMOS EL ERROR REAL
    console.error("❌ ERROR CRÍTICO EN EL SERVIDOR:", error.message || error);
    return NextResponse.json({ error: 'Error interno de procesamiento' }, { status: 500 });
  }
}