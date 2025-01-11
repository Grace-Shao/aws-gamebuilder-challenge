/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignJWT, jwtVerify } from 'jose'

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

export async function decrypt(token: string) {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ['HS256'],
  })
  return payload
}

