import React, { useState } from 'react'

import { DatePicker } from './DatePicker'
import { DatePickerNativeSwap } from './DatePickerNativeSwap'
import { DatePickerProps } from './types'

export default {
  title: 'Form/DatePicker comparison',
}

type Picker = React.ComponentType<React.PropsWithChildren<DatePickerProps>>

const format = (date: Date | null | undefined) =>
  date ? `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB')}` : '—'

const Scenario = ({
  title,
  instructions,
  Component = DatePicker,
  range = false,
  locale = 'en',
  initialStart = null,
  initialEnd = null,
  ...props
}: Partial<DatePickerProps> & {
  title: string
  instructions: string
  Component?: Picker
  initialStart?: Date | null
  initialEnd?: Date | null
}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStart)
  const [endDate, setEndDate] = useState<Date | null>(initialEnd)
  const [events, setEvents] = useState<string[]>([])

  const record = (message: string) =>
    setEvents((previous) => [message, ...previous].slice(0, 4))

  const handleChange = (start: Date, end?: Date) => {
    setStartDate(start)
    setEndDate(end ?? null)
    record(`change: ${format(start)} → ${format(end)}`)
  }

  return (
    <div style={{ flex: '1 1 360px', minWidth: 330, padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p>{instructions}</p>
      <Component
        {...props}
        id={`comparison-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
        label={title}
        placeholderText={range ? 'Select a range' : 'Select a date'}
        locale={locale}
        range={range}
        selected={range ? undefined : startDate}
        selectedRange={range ? { startDate, endDate } : undefined}
        handleChange={handleChange}
        handleClear={() => {
          setStartDate(null)
          setEndDate(null)
          record('clear')
        }}
        handleOpenCalendar={() => record('calendar opened')}
        handleCloseCalendar={() => record('calendar closed')}
      />
      <div style={{ marginTop: 20, fontSize: 14 }}>
        <div>Selected: {format(startDate)} → {format(endDate)}</div>
        <div>Callback log:</div>
        <ol style={{ marginTop: 4 }}>
          {events.map((event, index) => (
            <li key={`${index}-${event}`}>{event}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}

const Section = ({
  children,
  heading,
}: React.PropsWithChildren<{ heading: string }>) => (
  <section style={{ minHeight: 430, borderBottom: '1px solid #ddd' }}>
    <h2>{heading}</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>{children}</div>
  </section>
)

/** Baseline page: exercise every item in UPSTREAM_COMPARISON.md before replacing it. */
export const CurrentBehavior = () => (
  <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
    <h1>Current DatePicker behavior</h1>
    <p>Use each fixture and check its callback log and selected value.</p>
    <Section heading="1. Reverse range selection and preview">
      <Scenario
        title="Reverse range"
        range
        instructions="Select a later day, hover an earlier day, then click it. Check preview, sorted dates, and one change callback."
      />
    </Section>
    <Section heading="2. Range closing">
      <Scenario
        title="Range closing"
        range
        instructions="Select a start day: the calendar should stay open. Select an end day: it should close."
      />
    </Section>
    <Section heading="3. Time input with a range">
      <Scenario
        title="Range with time"
        range
        showTimeInput
        instructions="Select two days and set time for each. Check the displayed format and both callback dates."
      />
      <Scenario
        title="Range with time IS"
        range
        locale="is"
        showTimeInput
        instructions="Check Icelandic date and time formatting with a selected range."
      />
    </Section>
    <Section heading="4. Typed range">
      <Scenario
        title="Typed range"
        range
        instructions="Type 15/10/2026 - 01/10/2026 and press Enter. Also try 1/10/2026-15/10/2026, dot separators, invalid input, and blur without Enter."
      />
      <Scenario
        title="Typed range IS"
        range
        locale="is"
        instructions="Type 15.10.2026 - 01.10.2026 and press Enter; also try slash separators."
      />
    </Section>
    <Section heading="5. Clear button">
      <Scenario
        title="Clear single date"
        initialStart={new Date(2026, 9, 15)}
        isClearable
        clearLabel="Clear date"
        instructions="Activate Clear date by mouse and keyboard; check the empty input and callback log."
      />
      <Scenario
        title="Clear range"
        range
        initialStart={new Date(2026, 9, 1)}
        initialEnd={new Date(2026, 9, 15)}
        isClearable
        clearLabel="Clear range"
        instructions="Activate Clear range; check that both dates disappear."
      />
    </Section>
    <Section heading="6. Month and year controls">
      <Scenario
        title="Month and year"
        initialStart={new Date(2026, 9, 15)}
        displaySelectInput
        minYear={2020}
        maxYear={2030}
        instructions="Open the calendar. Navigate with the month and year selects, arrows, and keyboard."
      />
    </Section>
  </main>
)

/** First experiment: only reverse range selection uses the package's swapRange. */
export const NativeSwapComparison = () => (
  <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
    <h1>Reverse range selection: current vs native swapRange</h1>
    <p>
      In each picker, select a later day, hover an earlier day, then click it.
      Compare the preview, selected range, close behavior, and callback log.
    </p>
    <Section heading="Side by side">
      <Scenario
        title="Current picker"
        range
        instructions="Custom reverse click and hover handling."
      />
      <Scenario
        title="Native swapRange"
        Component={DatePickerNativeSwap}
        range
        instructions="Uses the package's swapRange prop."
      />
    </Section>
  </main>
)
