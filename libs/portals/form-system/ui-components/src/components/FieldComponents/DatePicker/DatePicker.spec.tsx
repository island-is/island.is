import { FormSystemField, FormSystemFieldSettings } from '@island.is/api/schema'
import { DatePicker } from '@island.is/island-ui/core'
import { render } from '@testing-library/react'
import format from 'date-fns/format'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { IntlProvider } from 'react-intl'
import { DatePickerField } from './DatePicker'

jest.mock('@island.is/island-ui/core', () => ({
  DatePicker: jest.fn(() => null),
}))

const item = {
  id: 'date-picker',
  name: { is: 'Date' },
  values: [],
} as unknown as FormSystemField

const Wrapper = ({ children }: { children: ReactNode }) => {
  const methods = useForm()
  return (
    <IntlProvider locale="is" defaultLocale="is" messages={{}}>
      <FormProvider {...methods}>{children}</FormProvider>
    </IntlProvider>
  )
}

const expectBounds = (minDate: string, maxDate?: string) => {
  const calls = jest.mocked(DatePicker).mock.calls
  const props = calls[calls.length - 1][0]
  expect(props.minDate && format(props.minDate, 'yyyy-MM-dd')).toBe(minDate)
  expect(props.maxDate && format(props.maxDate, 'yyyy-MM-dd')).toBe(maxDate)
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
  jest.setSystemTime(new Date(2026, 0, 31, 15))
})

afterEach(() => {
  jest.useRealTimers()
})

it.each<{
  settings: FormSystemFieldSettings
  minDate: string
  maxDate?: string
}>([
  {
    settings: { minDateDaysFromToday: 0, maxDateDaysFromToday: 0 },
    minDate: '2026-01-31',
    maxDate: '2026-01-31',
  },
  {
    settings: { minDateDaysFromToday: -7, maxDateDaysFromToday: 14 },
    minDate: '2026-01-24',
    maxDate: '2026-02-14',
  },
  {
    settings: {
      minDate: '2026-01-28',
      maxDate: '2026-02-07',
      minDateDaysFromToday: -7,
      maxDateDaysFromToday: 14,
    },
    minDate: '2026-01-28',
    maxDate: '2026-02-07',
  },
  {
    settings: {
      minDate: '2026-02-01',
      minDateDaysFromToday: 0,
      maxDateDaysFromToday: 7,
    },
    minDate: '2026-02-01',
    maxDate: '2026-02-07',
  },
  {
    settings: {
      maxDate: '2026-02-01',
      minDateDaysFromToday: 0,
      maxDateDaysFromToday: 7,
    },
    minDate: '2026-01-31',
    maxDate: '2026-02-01',
  },
  {
    settings: {
      minDate: '2020-01-01',
      maxDate: '2030-01-01',
      minDateDaysFromToday: 1,
      maxDateDaysFromToday: 2,
    },
    minDate: '2026-02-01',
    maxDate: '2026-02-02',
  },
  {
    settings: {
      minDate: '2020-01-01',
      maxDate: '2030-01-01',
      minDateDaysFromToday: null,
      maxDateDaysFromToday: null,
    },
    minDate: '2020-01-01',
    maxDate: '2030-01-01',
  },
  { settings: {}, minDate: '1970-01-01' },
])('applies date bounds for $settings', ({ settings, minDate, maxDate }) => {
  render(
    <DatePickerField item={{ ...item, fieldSettings: settings }} lang="is" />,
    {
      wrapper: Wrapper,
    },
  )
  expectBounds(minDate, maxDate)
})

it('updates bounds when settings change and restores defaults when cleared', () => {
  const { rerender } = render(<DatePickerField item={item} lang="is" />, {
    wrapper: Wrapper,
  })
  rerender(
    <DatePickerField
      item={{
        ...item,
        fieldSettings: { minDateDaysFromToday: 3, maxDateDaysFromToday: 10 },
      }}
      lang="is"
    />,
  )
  expectBounds('2026-02-03', '2026-02-10')
  rerender(<DatePickerField item={item} lang="is" />)
  expectBounds('1970-01-01')
})
