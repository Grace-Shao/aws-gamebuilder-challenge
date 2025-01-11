'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { logout } from '@/action/auth'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const result = await logout()
    if (result.success) {
      router.push('/login')
    } else {
      console.error(result.error)
    }
  }

  return (
    <Button onClick={handleSignOut}>Sign Out</Button>
  )
}

