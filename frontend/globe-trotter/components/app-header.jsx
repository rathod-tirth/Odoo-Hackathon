'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'
import { currentUser } from '@/lib/mock-data'
import './app-header.css'

export function AppHeader({ active }) {
  const router = useRouter()
  const menuId = useId()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    setMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link href="/dashboard" className="app-wordmark md-typescale-title-large">
          <md-icon>travel_explore</md-icon>
          GlobeTrotter
        </Link>

        <nav className="app-nav md-typescale-label-large" aria-label="Main">
          <Link
            href="/dashboard"
            className={active === 'dashboard' ? 'is-active' : ''}
          >
            Dashboard
          </Link>
          <Link
            href="/trips/new"
            className={active === 'new-trip' ? 'is-active' : ''}
          >
            Plan a trip
          </Link>
        </nav>

        <div className="app-header-actions">
          <ThemeToggle />
          <span style={{ position: 'relative' }}>
            <button
              id={menuId}
              type="button"
              className="user-avatar"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Open account menu"
            >
              {currentUser.initials}
            </button>
            <md-menu
              anchor={menuId}
              open={menuOpen || undefined}
              onclosed={() => setMenuOpen(false)}
            >
              <md-menu-item disabled>
                <div slot="headline">{currentUser.name}</div>
                <div slot="supporting-text">{currentUser.email}</div>
              </md-menu-item>
              <md-divider></md-divider>
              <md-menu-item onClick={handleLogout}>
                <md-icon slot="start">logout</md-icon>
                <div slot="headline">Log out</div>
              </md-menu-item>
            </md-menu>
          </span>
        </div>
      </div>
    </header>
  )
}
