import { cookies } from 'next/headers'
import { encrypt, decrypt } from './encryption'

export async function createSession(userId: string) {
  const expiresIn = 60 * 60 * 24 * 7 // 7 days
  const session = await encrypt({ userId, expiresIn })
  
  ;(await cookies()).set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expiresIn,
    path: '/'
  })
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value
  if (!session) return null
  
  try {
    const decoded = await decrypt(session)
    return decoded
  } catch (error) {
    console.error('Error decoding session:', error) // Log the error
    return null
  }
}


export async function destroySession() {
  (await cookies()).set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/'
  })
}

