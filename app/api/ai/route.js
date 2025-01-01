import { config as dotenvConfig } from "dotenv";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from 'next/server';

dotenvConfig();

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { inputText, topic, systemMessage } = body;

    if (!inputText || !topic || !systemMessage) {
      return NextResponse.json({ message: "Input text, topic, and system message are required." }, { status: 400 });
    }

    const request = {
      modelId: "amazon.nova-micro-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inferenceConfig: {
          max_new_tokens: 200,
        },
        messages: [
          {
            role: "user",
            content: [{ text: `${systemMessage}\n\nUser: Regarding ${topic} in Chinese: ${inputText}` }],
          },
        ],
      }),
    };

    const command = new InvokeModelCommand(request);
    const response = await client.send(command);

    const completion = JSON.parse(Buffer.from(response.body).toString("utf-8"));
    const assistantContent =
      completion?.output?.message?.content?.[0]?.text || "I couldn't process your request. Please try again.";

    console.log("Bedrock Response:", completion);

    return NextResponse.json({ message: assistantContent }, { status: 200 });
  } catch (error) {
    console.error("Error invoking the model:", error);
    return NextResponse.json({ 
      error: "Error processing your request. Please try again.",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

