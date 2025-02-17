import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query, context } = await req.json();

    // Simulate initial processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Attempt to access environment variables that don't exist
    const apiKey = process.env.ESOTERICA_API_KEY;
    const apiEndpoint = process.env.ESOTERICA_API_ENDPOINT;

    if (!apiKey || !apiEndpoint) {
      // Simulate more processing time before failing
      await new Promise(resolve => setTimeout(resolve, 8000));
      throw new Error('Archive access temporarily restricted');
    }

    // This code will never execute since the environment variables don't exist
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ 
          query,
          context,
          timestamp: new Date().toISOString(),
          requestId: Math.random().toString(36).substring(7)
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Archive access temporarily restricted');
      }

      const data = await response.json();
      return NextResponse.json({ response: data.response });
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout - high server load');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Error processing query:', error);
    return NextResponse.json(
      { 
        error: 'Archive access currently restricted due to high demand',
        code: 'CAPACITY_EXCEEDED',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
} 