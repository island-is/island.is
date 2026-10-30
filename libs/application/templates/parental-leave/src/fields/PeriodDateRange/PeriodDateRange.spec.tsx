import React, { useEffect } from 'react'
import { act, render } from '@testing-library/react'
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form'
import format from 'date-fns/format'
import set from 'lodash/set'

import { Application } from '@island.is/application/types'

import { ParentalRelations } from '../../constants'
import { PeriodDateRange } from './PeriodDateRange'

type Range = { startDate: Date | null; endDate: Date | null }
type DatePickerProps = {
  selectedRange: Range
  handleChange: (startDate: Date, endDate?: Date) => void
}

const mockDatePickerRenders: DatePickerProps[] = []

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: React.ReactNode }) => children,
  DatePicker: (props: DatePickerProps) => {
    mockDatePickerRenders.push(props)
    return null
  },
}))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ formatMessage: () => '' }),
}))

const lastDatePicker = () =>
  mockDatePickerRenders[mockDatePickerRenders.length - 1]

const shown = ({ startDate, endDate }: Range) => [
  startDate && format(startDate, 'yyyy-MM-dd'),
  endDate && format(endDate, 'yyyy-MM-dd'),
]

const createApplication = (periods: object[]): Application => {
  const externalData: Application['externalData'] = {}
  set(externalData, 'children.data.children', [
    {
      expectedDateOfBirth: '2027-01-15',
      parentalRelation: ParentalRelations.primary,
      hasRights: true,
      remainingDays: 180,
    },
  ])

  return {
    id: 'application',
    answers: { selectedChild: '0', periods },
    externalData,
  } as unknown as Application
}

const savedPeriod = {
  startDate: '2027-01-15',
  endDate: '2027-01-29',
  ratio: '100',
  firstPeriodStart: 'estimatedDateOfBirth',
  useLength: 'no',
}

const renderPeriod = (application: Application, index: number) => {
  let form: UseFormReturn | undefined

  const props = {
    application,
    field: { id: `periods[${index}].endDate` },
  } as unknown as React.ComponentProps<typeof PeriodDateRange>

  const Harness = () => {
    const methods = useForm({ defaultValues: application.answers })
    // The real screen re-renders on every form change (`PeriodRatioWarning`
    // watches the picked dates), which is what used to reset the picker.
    methods.watch()
    useEffect(() => {
      form = methods
    })

    return (
      <FormProvider {...methods}>
        <PeriodDateRange {...props} />
      </FormProvider>
    )
  }

  render(<Harness />)

  return () => form as UseFormReturn
}

const pick = (startDate: Date, endDate: Date) =>
  act(() => lastDatePicker().handleChange(startDate, endDate))

describe('PeriodDateRange', () => {
  beforeEach(() => {
    mockDatePickerRenders.length = 0
  })

  it('defaults a new period to the day after the previous one, 15 days long', () => {
    renderPeriod(createApplication([savedPeriod]), 1)

    expect(shown(lastDatePicker().selectedRange)).toEqual([
      '2027-01-30',
      '2027-02-13',
    ])
  })

  it('shows the range picked for a new period, not the default', () => {
    const getForm = renderPeriod(createApplication([savedPeriod]), 1)

    pick(new Date(2027, 0, 30), new Date(2027, 8, 30))

    expect(shown(lastDatePicker().selectedRange)).toEqual([
      '2027-01-30',
      '2027-09-30',
    ])
    expect(getForm().getValues('periods[1]')).toMatchObject({
      startDate: '2027-01-30',
      endDate: '2027-09-30',
    })
  })

  it('shows the range picked for a saved period, not the saved one', () => {
    renderPeriod(createApplication([savedPeriod]), 0)

    pick(new Date(2027, 1, 1), new Date(2027, 2, 31))

    expect(shown(lastDatePicker().selectedRange)).toEqual([
      '2027-02-01',
      '2027-03-31',
    ])
  })

  it('keeps the same range object across unrelated re-renders', () => {
    const getForm = renderPeriod(createApplication([savedPeriod]), 1)
    const before = lastDatePicker().selectedRange
    const rendersBefore = mockDatePickerRenders.length

    act(() => getForm().setValue('comment', 'unrelated'))

    expect(mockDatePickerRenders.length).toBeGreaterThan(rendersBefore)
    expect(lastDatePicker().selectedRange).toBe(before)
  })
})
