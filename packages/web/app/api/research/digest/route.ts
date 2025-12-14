
import { NextResponse } from 'next/server';
import { GrokService } from '@meme-lord/data-ops';

export async function POST() {
    try {
        const grok = new GrokService();
        const digest = await grok.generateMorningDigest();
        return NextResponse.json(digest);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
    }
}
