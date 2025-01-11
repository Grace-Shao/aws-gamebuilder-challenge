import { config as dotenvConfig } from "dotenv";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Load environment variables from .env file
dotenvConfig();
const URL = process.env.URL


const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_dynamo,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_dynamo
    }
});


export async function GET() {
    const tableName = "UserProgress"

    const userId = (await cookies()).get('userId')?.value;
    if (!userId) {
        return NextResponse.json({ message: 'User is not logged in' }, { status: 200 });
    }
    
    try {
        const getUserInventory = new GetItemCommand({
            TableName: tableName,
            Key: { "userId": { "S": userId } }
        })

        const response = await client.send(getUserInventory);
        const clothesMap = response.Item.currentClothes.M

        // a map of clothingType: imageUrl
        let clothesImagesMap = {};
        if (clothesMap) {
            // goes through key, val of currentClothes and extracts imgUrl to put in clothesImagesMap
            for (let [key, value] of Object.entries(clothesMap)) {
                console.log(key, value);

                // fetch the inventory
                let inventoryResponse;
                try {
                    // if nothing is equiped for that clothing spot
                    if (value.N === "-1") {
                        console.log(`No item equipped for ${key}`);
                        continue;
                    }
                    const res = await fetch(URL + `/api/db/inventory/${value.N}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    inventoryResponse = await res.json();
                } catch (error) {
                    console.error('Failed to fetch inventory value for', key, error);
                    continue;
                }

                // push the images from each storeItem into the arr
                if (inventoryResponse?.imageUrl?.S) {
                    clothesImagesMap[key] = inventoryResponse.imageUrl.S;
                } else {
                console.warn(`No valid imageUrl found for ${key}`);
                }
               
            }
        }
        return NextResponse.json({ success: true, clothesImagesMap }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

