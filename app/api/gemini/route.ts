import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { texto, historial } = await req.json();
    
    // Leemos la llave segura
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key de Groq' }, { status: 500 });
    }

    const instruccionSistema = {
      role: "system",
      content: "Eres un asistente virtual empático para adultos mayores en Perú. Trata de 'Usted'. Regla ESTRICTA: Tus respuestas deben ser MUY cortas (máximo 2 oraciones). Cero palabras técnicas."
    };

    // Formateamos la memoria para Groq
    const historialParaGroq = historial.map((m: any) => ({
      role: m.rol === 'usuario' ? 'user' : 'assistant',
      content: m.texto
    }));

    // Conexión segura de Servidor a Servidor
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // <--- ¡AQUÍ ESTÁ EL CEREBRO ACTUALIZADO!
        messages: [instruccionSistema, ...historialParaGroq, { role: "user", content: texto }],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Error en los servidores de Groq");
    }

    // Devolvemos la respuesta a tu página web
    return NextResponse.json({ respuesta: data.choices[0].message.content });

  } catch (error: any) {
    console.error("Error en el Backend:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}