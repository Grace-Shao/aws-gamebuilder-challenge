import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamoDb = DynamoDBDocument.from(
  new DynamoDB({
    region: process.env.AWS_REGION , 
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_dynamo!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_dynamo!,
    },
  })
);

export async function GET() {
  try {
    // Retrieve the userId from cookies
    const userId = (await cookies()).get('userId')?.value;

    console.log('UserId from cookies:', userId);

    if (!userId) {
      console.warn('No userId found in cookies');
      return NextResponse.json({ userId: null });
    }

    // Fetch the session from DynamoDB
    const result = await dynamoDb.get({
      TableName: 'UserSession', 
      Key: { userId },
    });

    console.log('DynamoDB result:', result);

    if (!result.Item) {
      //console.warn(`No session found for userId: ${userId}`);
      return NextResponse.json({ userId: null });
    }

    // Check if the session has expired
    if (new Date(result.Item.expiresAt) < new Date()) {
      console.warn(`Session expired for userId: ${userId}`);
      await dynamoDb.delete({
        TableName: 'UserSession', // Corrected table name
        Key: { userId },
      });
      return NextResponse.json({ userId: null });
    }

    console.log('Session validated for userId:', userId);

    // Return the userId from the session
    return NextResponse.json({ userId });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json({ userId: null }, { status: 500 });
  }
}
