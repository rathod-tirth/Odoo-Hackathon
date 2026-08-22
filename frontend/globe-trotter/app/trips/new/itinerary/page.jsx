'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/app-header'
import { defaultItinerarySections } from '@/lib/mock-data'
import './itinerary.css'

let nextSectionId = 100

export default function ItineraryBuilderPage() {
  const router = useRouter()
  const [sections, setSections] = useState(defaultItinerarySections)

  function updateSection(id, patch) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, ...patch } : section,
      ),
    )
  }

  function addSection() {
    nextSectionId += 1
    setSections((prev) => [
      ...prev,
      {
        id: `section-${nextSectionId}`,
        title: `Section ${prev.length + 1}`,
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
      },
    ])
  }

  function removeSection(id) {
    setSections((prev) => prev.filter((section) => section.id !== id))
  }

  function moveSection(id, direction) {
    setSections((prev) => {
      const index = prev.findIndex((section) => section.id === id)
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= prev.length) return prev
      const next = [...prev]
      const [moved] = next.splice(index, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
  }

  function handleFinish(event) {
    event.preventDefault()
    // Demo-only: itinerary data isn't persisted, just shown for the flow.
    router.push('/dashboard')
  }

  return (
    <>
      <AppHeader active="new-trip" />
      <main className="itinerary-page">
        <div className="itinerary-header">
          <h1 className="md-typescale-headline-medium">Build your itinerary</h1>
          <p className="md-typescale-body-large">
            Break your trip into sections — travel, hotels, or activities —
            and set a date range and budget for each.
          </p>
        </div>

        <form onSubmit={handleFinish}>
          <div className="itinerary-sections">
            {sections.map((section, index) => (
              <md-elevated-card
                key={section.id}
                className="itinerary-section-card"
              >
                <div className="itinerary-section-head">
                  <md-outlined-text-field
                    className="itinerary-section-title-field"
                    label={`Section ${index + 1} title`}
                    value={section.title}
                    onInput={(e) =>
                      updateSection(section.id, { title: e.target.value })
                    }
                  />
                  <div className="itinerary-section-controls">
                    <md-icon-button
                      aria-label="Move section up"
                      disabled={index === 0}
                      onClick={() => moveSection(section.id, -1)}
                    >
                      <md-icon>arrow_upward</md-icon>
                    </md-icon-button>
                    <md-icon-button
                      aria-label="Move section down"
                      disabled={index === sections.length - 1}
                      onClick={() => moveSection(section.id, 1)}
                    >
                      <md-icon>arrow_downward</md-icon>
                    </md-icon-button>
                    <md-icon-button
                      aria-label="Remove section"
                      disabled={sections.length <= 1}
                      onClick={() => removeSection(section.id)}
                    >
                      <md-icon>delete</md-icon>
                    </md-icon-button>
                  </div>
                </div>

                <md-outlined-text-field
                  label="All the necessary information about this section"
                  type="textarea"
                  rows={2}
                  supporting-text="This can be anything like travel details, hotel, or any other activity"
                  value={section.description}
                  onInput={(e) =>
                    updateSection(section.id, {
                      description: e.target.value,
                    })
                  }
                />

                <div className="itinerary-section-fields">
                  <md-outlined-text-field
                    label="Start date"
                    type="date"
                    value={section.startDate}
                    onInput={(e) =>
                      updateSection(section.id, {
                        startDate: e.target.value,
                      })
                    }
                  />
                  <md-outlined-text-field
                    label="End date"
                    type="date"
                    value={section.endDate}
                    onInput={(e) =>
                      updateSection(section.id, { endDate: e.target.value })
                    }
                  />
                  <md-outlined-text-field
                    label="Budget of this section"
                    prefix-text="$"
                    type="number"
                    value={section.budget}
                    onInput={(e) =>
                      updateSection(section.id, { budget: e.target.value })
                    }
                  />
                </div>
              </md-elevated-card>
            ))}
          </div>

          <md-outlined-button
            type="button"
            className="itinerary-add-section"
            onClick={addSection}
          >
            Add another section
            <md-icon slot="icon">add</md-icon>
          </md-outlined-button>

          <div className="itinerary-actions">
            <md-outlined-button
              type="button"
              onClick={() => router.push('/trips/new')}
            >
              Back
            </md-outlined-button>
            <md-filled-button type="button" onClick={handleFinish}>
              Finish planning
            </md-filled-button>
          </div>
        </form>
      </main>
    </>
  )
}
