import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const client = new PollyClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_polly,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_polly
    },
})

export async function POST(request) {
    try {
        const data = await request.json();
        const params = {
            Engine: "standard",
            OutputFormat: "mp3",
            Text: data.text,
            TextType: "text",
            VoiceId: data.voiceId
        };
        const command = new SynthesizeSpeechCommand(params);
        const response = await client.send(command);

        const chunks = [];
        for await (const chunk of response.AudioStream) {
            chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);
        return new Response(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString()
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}