'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import './auth.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const next = {}
    if (!email.trim()) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email address'
    }
    if (!password) {
      next.password = 'Password is required'
    } else if (password.length < 6) {
      next.password = 'Password must be at least 6 characters'
    }
    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    // Demo-only: no real authentication backend is wired up yet.
    router.push('/dashboard')
  }

  return (
    <main className="auth-shell">
      <md-elevated-card className="auth-card">
        <div className="auth-avatar">
          <md-icon>travel_explore</md-icon>
        </div>

        <div className="auth-heading">
          <h1 className="md-typescale-headline-small">Welcome back</h1>
          <p className="md-typescale-body-medium">
            Log in to continue planning your next trip
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <md-outlined-text-field
            label="Email address"
            type="email"
            name="email"
            value={email}
            onInput={(e) => setEmail(e.target.value)}
            error={Boolean(errors.email) || undefined}
            error-text={errors.email}
            required
          >
            <md-icon slot="leading-icon">mail</md-icon>
          </md-outlined-text-field>

          <md-outlined-text-field
            label="Password"
            type="password"
            name="password"
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            error={Boolean(errors.password) || undefined}
            error-text={errors.password}
            required
          >
            <md-icon slot="leading-icon">lock</md-icon>
          </md-outlined-text-field>

          <md-filled-button
            type="button"
            className="auth-submit"
            disabled={submitting}
            onClick={handleSubmit}
          >
            Log In
          </md-filled-button>

          <div className="auth-links">
            <md-text-button type="button" onClick={() => router.push('/register')}>
              Create account
            </md-text-button>
            <md-text-button type="button">Forgot password?</md-text-button>
          </div>
        </form>
      </md-elevated-card>
    </main>
  )
}
