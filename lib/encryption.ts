import { SignJWT, jwtVerify, JWTPayload } from 'jose'

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

// Define a type for the payload
type Payload = Record<string, unknown>; // Allows any key-value pairs with stricter typing than `any`

export async function encrypt(payload: Payload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

export async function decrypt(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ['HS256'],
  })
  return payload
}
