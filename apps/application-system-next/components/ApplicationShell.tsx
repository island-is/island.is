'use client'

import { useFormActions } from '../hooks/useFormActions'
import { FormRenderer } from './FormRenderer'
import type { SdfScreen } from '../lib/graphql'

interface ApplicationShellProps {
  applicationId: string
  initialScreen: SdfScreen
}

export function ApplicationShell({
  applicationId,
  initialScreen,
}: ApplicationShellProps) {
  const {
    screen,
    isPending,
    error,
    answers,
    onAnswerChange,
    nextPage,
    prevPage,
    submit,
  } = useFormActions(applicationId, initialScreen)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        gap: '2rem',
        fontFamily: 'IBM Plex Sans, sans-serif',
      }}
    >
      {/* Stepper sidebar */}
      <aside>
        <nav>
          {screen.stepper.sections.map((section, idx) => (
            <div key={section.id} style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.25rem',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    background:
                      idx === screen.stepper.activeSectionIndex
                        ? '#0061ff'
                        : section.isComplete
                          ? '#00B85C'
                          : '#e6e6e6',
                    color:
                      idx === screen.stepper.activeSectionIndex ||
                      section.isComplete
                        ? 'white'
                        : '#666',
                  }}
                >
                  {section.isComplete ? '\u2713' : idx + 1}
                </div>
                <span
                  style={{
                    fontWeight:
                      idx === screen.stepper.activeSectionIndex ? 700 : 400,
                    color:
                      idx === screen.stepper.activeSectionIndex
                        ? '#00003C'
                        : '#666',
                  }}
                >
                  {section.title}
                </span>
              </div>
              {idx === screen.stepper.activeSectionIndex &&
                section.children.length > 0 && (
                  <div style={{ marginLeft: '2.5rem', marginTop: '0.5rem' }}>
                    {section.children.map((sub, subIdx) => (
                      <div
                        key={sub.id}
                        style={{
                          padding: '0.25rem 0',
                          fontSize: '14px',
                          color:
                            subIdx === screen.stepper.activeSubSectionIndex
                              ? '#0061ff'
                              : '#999',
                          fontWeight:
                            subIdx === screen.stepper.activeSubSectionIndex
                              ? 600
                              : 400,
                        }}
                      >
                        {sub.title}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#00003C' }}>
            {screen.header.title}
          </h1>
          {screen.header.description && (
            <p style={{ color: '#555', marginTop: '0.5rem', lineHeight: 1.6 }}>
              {screen.header.description}
            </p>
          )}
        </header>

        {error && (
          <div
            style={{
              padding: '1rem',
              background: '#FFF0F0',
              border: '1px solid #B30038',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              color: '#B30038',
            }}
          >
            {error}
          </div>
        )}

        <FormRenderer
          components={screen.page.components}
          errors={screen.page.errors}
          answers={answers.current}
          onAnswerChange={onAnswerChange}
        />

        {/* Footer */}
        <footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e6e6e6',
          }}
        >
          <div>
            {screen.footer.canGoBack && (
              <button
                type="button"
                onClick={prevPage}
                disabled={isPending}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid #ccdfff',
                  background: 'transparent',
                  color: '#0061ff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isPending ? 'wait' : 'pointer',
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                Back
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {screen.footer.buttons.map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => {
                  if (btn.actionType === 'SUBMIT') {
                    submit(btn.id)
                  } else if (btn.actionType === 'NEXT_PAGE') {
                    nextPage()
                  }
                }}
                disabled={isPending}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  border:
                    btn.variant === 'PRIMARY'
                      ? 'none'
                      : btn.variant === 'REJECT'
                        ? '1px solid #B30038'
                        : '1px solid #ccdfff',
                  background:
                    btn.variant === 'PRIMARY'
                      ? '#0061ff'
                      : btn.variant === 'REJECT'
                        ? '#FFF0F0'
                        : 'transparent',
                  color:
                    btn.variant === 'PRIMARY'
                      ? 'white'
                      : btn.variant === 'REJECT'
                        ? '#B30038'
                        : '#0061ff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isPending ? 'wait' : 'pointer',
                  opacity: isPending ? 0.6 : 1,
                }}
              >
                {isPending ? '...' : btn.text}
              </button>
            ))}
          </div>
        </footer>
      </main>
    </div>
  )
}
