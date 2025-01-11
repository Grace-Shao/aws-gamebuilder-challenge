'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ErrorModal } from "@/components/error-modal"
import { register } from '@/action/auth'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeTerms) {
      setErrorMessage('You must agree to the terms of service')
      setIsErrorModalOpen(true)
      return
    }

    try {
      const result = await register(username, password, firstName, lastName)
      if (result.success) {
        router.push('/lessonPage')
      } else {
        if (result.error === 'USERNAME_EXISTS') {
          setErrorMessage('This username already exists. Please choose a different one.')
        } else {
          setErrorMessage(result.error || 'An error occurred during registration')
        }
        setIsErrorModalOpen(true)
      }
    } catch (err) {
      console.error('Registration error:', err) // Log the error for debugging
      setErrorMessage('An unexpected error occurred. Please try again.')
      setIsErrorModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              type="text" 
              placeholder="Choose a username" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Create a password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              type="text" 
              placeholder="Enter your first name" 
              required 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              type="text" 
              placeholder="Enter your last name" 
              required 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="agree-terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              required
            />
            <Label htmlFor="agree-terms" className="ml-2">
              By creating an account, I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            </Label>
          </div>
          <Button type="submit" className="w-full">Create Account</Button>
        </form>
        <div className="text-center">
          <p className="text-sm">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
      <ErrorModal 
        isOpen={isErrorModalOpen} 
        onClose={() => setIsErrorModalOpen(false)} 
        errorMessage={errorMessage}
      />
    </div>
  )
}
