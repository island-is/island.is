import React, { useEffect } from 'react'
import { act, render } from '@testing-library/react'
import { FormProvider, UseFormReturn, useForm } from 'react-hook-form'
import format from 'date-fns/format'
import set from 'lodash/set'

import { Application } from '@island.is/application/types'

import { ParentalRelations } from '../../constants'
import { PeriodDateRange } from './PeriodDateRange'
import { PeriodActualDateOfBirth } from './PeriodActualDateOfBirth'

type Range = { startDate: Date | null; endDate: Date | null }
type DatePickerProps = {
  id: string
  range?: boolean
  selected?: Date | null
  selectedRange: Range
  handleChange: (startDate: Date, endDate?: Date) => void
}
type CheckboxProps = {
  id: string
  checked: boolean
  onChange: (event: { target: { checked: boolean } }) => void
}

const mockDatePickerRenders: DatePickerProps[] = []
const mockCheckboxRenders: CheckboxProps[] = []

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: React.ReactNode }) => children,
  DatePicker: (props: DatePickerProps) => {
    mockDatePickerRenders.push(props)
    return null
  },
  Checkbox: (props: CheckboxProps) => {
    mockCheckboxRenders.push(props)
    return null
  },
}))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ formatMessage: () => '' }),
}))

const lastDatePicker = () =>
  mockDatePickerRenders[mockDatePickerRenders.length - 1]

const lastCheckbox = (id: string) =>
  [...mockCheckboxRenders].reverse().find((props) => props.id === id)

const toggle = (id: string, checked: boolean) =>
  act(() => lastCheckbox(id)?.onChange({ target: { checked } }))

const actualDobCheckbox = (index: number) =>
  `periods-${index}-actualDateOfBirth`

const shown = ({ startDate, endDate }: Range) => [
  startDate && format(startDate, 'yyyy-MM-dd'),
  endDate && format(endDate, 'yyyy-MM-dd'),
]

const createApplication = (
  periods: object[],
  expectedDateOfBirth = '2027-01-15',
): Application => {
  const externalData: Application['externalData'] = {}
  set(externalData, 'children.data.children', [
    {
      expectedDateOfBirth,
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
  const actualDobProps = {
    application,
    field: { id: `periods[${index}].actualDateOfBirth` },
  } as unknown as React.ComponentProps<typeof PeriodActualDateOfBirth>

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
        <PeriodActualDateOfBirth {...actualDobProps} />
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
    mockCheckboxRenders.length = 0
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

  describe('start on the actual date of birth', () => {
    it('is offered on the first period only', () => {
      renderPeriod(createApplication([savedPeriod]), 0)
      expect(lastCheckbox(actualDobCheckbox(0))).toBeDefined()

      mockCheckboxRenders.length = 0
      renderPeriod(createApplication([savedPeriod]), 1)
      expect(lastCheckbox(actualDobCheckbox(1))).toBeUndefined()
    })

    it('is not offered when the expected date of birth is before this month', () => {
      renderPeriod(createApplication([savedPeriod], '2020-01-15'), 0)

      expect(lastCheckbox(actualDobCheckbox(0))).toBeUndefined()
    })

    it('starts the period on the date of birth and asks only for an end date', () => {
      const getForm = renderPeriod(createApplication([savedPeriod]), 0)

      toggle(actualDobCheckbox(0), true)

      expect(getForm().getValues('periods[0]')).toMatchObject({
        startDate: '2027-01-15',
        endDate: '2027-01-29',
        firstPeriodStart: 'actualDateOfBirth',
        endDateAdjustLength: ['yes'],
      })
      expect(lastDatePicker().range).toBeFalsy()
      expect(lastDatePicker().id).toBe('periods-0-endDate')
    })

    it('goes back to the range picker when unchecked', () => {
      const getForm = renderPeriod(
        createApplication([
          {
            ...savedPeriod,
            firstPeriodStart: 'actualDateOfBirth',
            endDateAdjustLength: ['yes'],
          },
        ]),
        0,
      )
      expect(lastCheckbox(actualDobCheckbox(0))?.checked).toBe(true)

      toggle(actualDobCheckbox(0), false)

      expect(getForm().getValues('periods[0]')).toMatchObject({
        firstPeriodStart: 'estimatedDateOfBirth',
        endDateAdjustLength: [],
      })
      expect(lastDatePicker().range).toBe(true)
    })

    it('marks a first period that does not start on the expected date of birth as a specific date', () => {
      const getForm = renderPeriod(createApplication([savedPeriod]), 0)

      pick(new Date(2027, 1, 1), new Date(2027, 2, 31))
      expect(getForm().getValues('periods[0].firstPeriodStart')).toBe(
        'specificDate',
      )

      pick(new Date(2027, 0, 15), new Date(2027, 2, 31))
      expect(getForm().getValues('periods[0].firstPeriodStart')).toBe(
        'estimatedDateOfBirth',
      )
    })
  })
})
