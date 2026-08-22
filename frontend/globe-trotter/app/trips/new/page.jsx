'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { suggestedPlaces } from '@/lib/mock-data'
import './new-trip.css'

export default function CreateTripPage() {
  const router = useRouter()
  const [tripName, setTripName] = useState('')
  const [place, setPlace] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState(null)
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const [errors, setErrors] = useState({})

  function togglePlace(id) {
    setSelectedPlaces((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }

  function handleCoverChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setCoverImage({ name: file.name, url: URL.createObjectURL(file) })
  }

  function validate() {
    const next = {}
    if (!tripName.trim()) next.tripName = 'Trip name is required'
    if (!place.trim()) next.place = 'Select a place for this trip'
    if (!startDate) next.startDate = 'Start date is required'
    if (!endDate) next.endDate = 'End date is required'
    if (startDate && endDate && endDate < startDate) {
      next.endDate = 'End date must be after start date'
    }
    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    // Demo-only: trip details aren't persisted, just carried forward visually.
    router.push('/trips/new/itinerary')
  }

  return (
    <>
      <AppHeader active="new-trip" />
      <main className="new-trip-page">
        <div className="new-trip-header">
          <h1 className="md-typescale-headline-medium">Plan a new trip</h1>
          <p className="md-typescale-body-large">
            Give your trip a name, choose your dates, and we&apos;ll help you
            build the itinerary next.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <md-elevated-card className="new-trip-card">
            <div className="new-trip-form-grid">
              <md-outlined-text-field
                className="full-width"
                label="Trip name"
                value={tripName}
                onInput={(e) => setTripName(e.target.value)}
                error={Boolean(errors.tripName) || undefined}
                error-text={errors.tripName}
                required
              />

              <md-outlined-text-field
                className="full-width"
                label="Select a place"
                placeholder="e.g. Kyoto, Japan"
                value={place}
                onInput={(e) => setPlace(e.target.value)}
                error={Boolean(errors.place) || undefined}
                error-text={errors.place}
                required
              >
                <md-icon slot="leading-icon">location_on</md-icon>
              </md-outlined-text-field>

              <md-outlined-text-field
                label="Start date"
                type="date"
                value={startDate}
                onInput={(e) => setStartDate(e.target.value)}
                error={Boolean(errors.startDate) || undefined}
                error-text={errors.startDate}
                required
              />

              <md-outlined-text-field
                label="End date"
                type="date"
                value={endDate}
                onInput={(e) => setEndDate(e.target.value)}
                error={Boolean(errors.endDate) || undefined}
                error-text={errors.endDate}
                required
              />

              <md-outlined-text-field
                className="full-width"
                label="Description"
                type="textarea"
                rows={4}
                value={description}
                onInput={(e) => setDescription(e.target.value)}
                supporting-text="Optional — add notes about this trip"
              />
            </div>

            <div className="new-trip-cover-upload">
              <div className="new-trip-cover-preview">
                {coverImage ? (
                  <img src={coverImage.url} alt="Trip cover preview" />
                ) : (
                  <md-icon>image</md-icon>
                )}
              </div>
              <div className="new-trip-cover-text">
                <span className="md-typescale-body-medium">
                  {coverImage ? coverImage.name : 'Cover image (optional)'}
                </span>
                <span className="md-typescale-body-small">
                  PNG or JPG, up to 10MB
                </span>
              </div>
              <md-outlined-button type="button">
                <label htmlFor="cover-upload" className="upload-label">
                  Upload
                </label>
                <md-icon slot="icon">upload</md-icon>
              </md-outlined-button>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  opacity: 0,
                  pointerEvents: 'none',
                }}
                tabIndex={-1}
              />
            </div>
          </md-elevated-card>

          <section style={{ marginTop: 32 }}>
            <h2 className="md-typescale-title-large suggestion-section-title">
              Suggestions for places to visit
            </h2>
            <p className="md-typescale-body-medium" style={{ margin: '0 0 16px', color: 'var(--md-sys-color-on-surface-variant)' }}>
              Tap to add ideas to this trip&apos;s itinerary
            </p>
            <div className="suggestion-grid">
              {suggestedPlaces.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    'suggestion-tile' +
                    (selectedPlaces.includes(item.id) ? ' is-selected' : '')
                  }
                  onClick={() => togglePlace(item.id)}
                >
                  <md-icon>{item.icon}</md-icon>
                  <span className="md-typescale-body-medium">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <div className="new-trip-actions" style={{ marginTop: 32 }}>
            <md-outlined-button
              type="button"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </md-outlined-button>
            <md-filled-button type="button" onClick={handleSubmit}>
              Save &amp; Continue to Itinerary
            </md-filled-button>
          </div>
        </form>
      </main>
    </>
  )
}
