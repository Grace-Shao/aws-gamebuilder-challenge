import { config as dotenvConfig } from "dotenv";
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from 'next/server';

// Load environment variables from .env file
dotenvConfig();

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_dynamo,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_dynamo
    }
});

export async function PATCH(req) {
    const tableName = "UserProgress"

    const body = await req.json() // Parse the incoming request body
    let { newItemId } = body
    const { newItemType } = body

    let currentItemId = ""

    // Get the currently equipped item
    let response = null
    try {
        const getEquippedItem = new GetItemCommand({
            TableName: tableName,
            Key: { "userId": { "S": "1" } }
        })

        response = await client.send(getEquippedItem);
        currentItemId = response.Item.currentClothes.M[newItemType]
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if requested item is already equipped
    if (currentItemId["N"] === newItemId) {
        // unequip item instead of replacing it
        newItemId = "-1";
    }
    
    // Update clothes in database
    response.Item.currentClothes.M[newItemType] = {"N": `${newItemId}`};

    try {
        const setNewClothes = new UpdateItemCommand({
            TableName: tableName,
            Key: { "userId": { "S": "1" } },
            UpdateExpression: "SET currentClothes = :newClothes",
            ExpressionAttributeValues: { ":newClothes": response.Item.currentClothes},
            ReturnValues: "ALL_NEW"
        })
        response = await client.send(setNewClothes);

        return NextResponse.json(response.Attributes, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
