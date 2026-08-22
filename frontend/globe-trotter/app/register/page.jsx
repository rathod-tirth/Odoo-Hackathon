'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import '../auth.css'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const next = {}
    if (!fullName.trim()) next.fullName = 'Full name is required'
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
    if (!confirmPassword) {
      next.confirmPassword = 'Please confirm your password'
    } else if (confirmPassword !== password) {
      next.confirmPassword = 'Passwords do not match'
    }
    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    // Demo-only: no real account backend is wired up yet.
    router.push('/dashboard')
  }

  return (
    <main className="auth-shell">
      <md-elevated-card className="auth-card">
        <div className="auth-avatar">
          <md-icon>person_add</md-icon>
        </div>

        <div className="auth-heading">
          <h1 className="md-typescale-headline-small">Create your account</h1>
          <p className="md-typescale-body-medium">
            Join GlobeTrotter and start planning
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <md-outlined-text-field
            label="Full name"
            name="fullName"
            value={fullName}
            onInput={(e) => setFullName(e.target.value)}
            error={Boolean(errors.fullName) || undefined}
            error-text={errors.fullName}
            required
          >
            <md-icon slot="leading-icon">person</md-icon>
          </md-outlined-text-field>

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
            supporting-text="At least 6 characters"
            required
          >
            <md-icon slot="leading-icon">lock</md-icon>
          </md-outlined-text-field>

          <md-outlined-text-field
            label="Confirm password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onInput={(e) => setConfirmPassword(e.target.value)}
            error={Boolean(errors.confirmPassword) || undefined}
            error-text={errors.confirmPassword}
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
            Sign Up
          </md-filled-button>

          <div className="auth-links-center md-typescale-body-medium">
            Already have an account?
            <md-text-button type="button" onClick={() => router.push('/')}>
              Log in
            </md-text-button>
          </div>
        </form>
      </md-elevated-card>
    </main>
  )
}
