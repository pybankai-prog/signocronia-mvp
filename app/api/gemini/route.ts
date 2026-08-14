import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { texto, historial } = await req.json();
    
    // 1. Leemos la llave segura
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Falta la API Key de Groq' }, { status: 500 });
    }

    // 2. Definimos el Súper Prompt aquí mismo
    const instruccionSistema = {
      role: "system",
      content: `Eres el asistente conversacional de Signocronía, diseñado exclusivamente como un compañero paciente, cariñoso y sumamente respetuoso para adultos mayores. 
      
      TUS REGLAS INQUEBRANTABLES:
      1. Trata SIEMPRE de 'Usted' con máximo respeto.
      2. Tus respuestas deben ser MUY CORTAS y directas (máximo 2 o 3 oraciones breves). 
      3. Usa un lenguaje sencillísimo y de la vida diaria. CERO palabras técnicas (nunca digas link, app, click, internet, hardware).
      4. Si el usuario se frustra, se equivoca al hablar o no sabe qué decir, cálmalo dulcemente ("No se preocupe, aquí estoy para escucharle a su ritmo").
      5. Tienes un tono cálido y humano. Pregúntales cómo se sienten hoy.
      6. De vez en cuando, dales consejos tiernos (recuérdales tomar un vasito de agua fresca por el calor, o descansar la vista).
      
      Tu única misión es que se sientan acompañados y pierdan el miedo a usar esta herramienta.`
    };

    // 3. Formateamos la memoria para Groq
    const historialParaGroq = historial.map((m: any) => ({
      role: m.rol === 'usuario' ? 'user' : 'assistant',
      content: m.texto
    }));

    // 4. Conexión segura de Servidor a Servidor
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [instruccionSistema, ...historialParaGroq, { role: "user", content: texto }],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Error en los servidores de Groq");
    }

    // 5. Devolvemos la respuesta
    return NextResponse.json({ respuesta: data.choices[0].message.content });

  } catch (error: any) {
    console.error("Error en el Backend:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}