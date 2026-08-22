'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import {
  currentUser,
  upcomingTrips,
  previousTrips,
  topRegionalSelections,
  budgetHighlights,
} from '@/lib/mock-data'
import './dashboard.css'

export default function DashboardPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')

  return (
    <>
      <AppHeader active="dashboard" />
      <main className="dashboard-page">
        <section className="dashboard-banner">
          <div className="dashboard-banner-text">
            <p className="md-typescale-label-large dashboard-eyebrow">
              Welcome back
            </p>
            <h1 className="md-typescale-headline-medium">
              Where to next, {currentUser.name.split(' ')[0]}?
            </h1>
            <p className="md-typescale-body-large">
              You have {upcomingTrips.length} upcoming trips planned. Keep the
              momentum going.
            </p>
          </div>
          <md-filled-button onClick={() => router.push('/trips/new')}>
            <md-icon slot="icon">add</md-icon>
            Plan a new trip
          </md-filled-button>
        </section>

        <section className="dashboard-toolbar">
          <md-outlined-text-field
            className="dashboard-search"
            label="Search trips and destinations"
            value={search}
            onInput={(e) => setSearch(e.target.value)}
          >
            <md-icon slot="leading-icon">search</md-icon>
          </md-outlined-text-field>
          <div className="dashboard-toolbar-actions">
            <md-outlined-button>
              Group by
              <md-icon slot="icon">unfold_more</md-icon>
            </md-outlined-button>
            <md-outlined-button>
              Filter
              <md-icon slot="icon">filter_list</md-icon>
            </md-outlined-button>
            <md-outlined-button>
              Sort by
              <md-icon slot="icon">sort</md-icon>
            </md-outlined-button>
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="md-typescale-title-large section-title">
            Upcoming trips
          </h2>
          <div className="trip-summary-grid">
            {upcomingTrips.map((trip) => (
              <md-elevated-card key={trip.id} className="trip-summary-card">
                <div className="trip-summary-icon">
                  <md-icon>{trip.icon}</md-icon>
                </div>
                <div className="trip-summary-body">
                  <span className="md-typescale-title-medium">
                    {trip.name}
                  </span>
                  <span className="md-typescale-body-medium trip-summary-meta">
                    {trip.location}
                  </span>
                  <span className="md-typescale-body-small trip-summary-meta">
                    {trip.dates}
                  </span>
                </div>
                <div className="trip-summary-budget">
                  <span className="md-typescale-label-small">BUDGET</span>
                  <span className="md-typescale-title-medium">
                    {trip.budget}
                  </span>
                </div>
              </md-elevated-card>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="md-typescale-title-large section-title">
            Top regional selections
          </h2>
          <div className="destination-grid">
            {topRegionalSelections.map((dest) => (
              <button
                key={dest.id}
                type="button"
                className="destination-tile"
              >
                <md-icon>{dest.icon}</md-icon>
                <span className="md-typescale-label-large">{dest.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="md-typescale-title-large section-title">
            Budget highlights
          </h2>
          <div className="budget-grid">
            {budgetHighlights.map((stat) => (
              <md-outlined-card key={stat.label} className="budget-card">
                <md-icon>{stat.icon}</md-icon>
                <span className="md-typescale-display-small">
                  {stat.value}
                </span>
                <span className="md-typescale-body-medium budget-card-label">
                  {stat.label}
                </span>
              </md-outlined-card>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2 className="md-typescale-title-large section-title">
            Previous trips
          </h2>
          <div className="previous-trips-grid">
            {previousTrips.map((trip) => (
              <md-outlined-card key={trip.id} className="previous-trip-card">
                <div className="previous-trip-cover">
                  <md-icon>{trip.icon}</md-icon>
                </div>
                <span className="md-typescale-title-medium">
                  {trip.name}
                </span>
                <span className="md-typescale-body-small trip-summary-meta">
                  {trip.location}
                </span>
                <span className="md-typescale-body-small trip-summary-meta">
                  {trip.dates}
                </span>
              </md-outlined-card>
            ))}
          </div>
        </section>
      </main>

      <md-fab
        variant="primary"
        label="Plan a trip"
        aria-label="Plan a trip"
        className="dashboard-fab"
        onClick={() => router.push('/trips/new')}
      >
        <md-icon slot="icon">add</md-icon>
      </md-fab>
    </>
  )
}
