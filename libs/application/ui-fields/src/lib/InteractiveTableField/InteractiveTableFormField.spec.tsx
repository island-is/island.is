import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FC, PropsWithChildren } from 'react'
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  InteractiveTableField,
} from '@island.is/application/types'
import { buildInteractiveTableField } from '@island.is/application/core'
import { InteractiveTableFormField } from './InteractiveTableFormField'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    formatMessage: (message: unknown) =>
      typeof message === 'string'
        ? message
        : (message as { defaultMessage: string }).defaultMessage,
    lang: 'is',
  }),
}))

jest.mock('@island.is/react-spa/bff', () => ({
  useUserInfo: () => undefined,
}))

const application: Application = {
  id: 'test-application',
  assignees: [],
  typeId: ApplicationTypes.PAY_DEBTS,
  externalData: {},
  answers: {},
  applicant: '1111112219',
  state: 'draft',
  modified: new Date(),
  created: new Date(),
  status: ApplicationStatus.IN_PROGRESS,
  applicantActors: [],
}

let form: UseFormReturn | undefined

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const methods = useForm()
  form = methods

  return <FormProvider {...methods}>{children}</FormProvider>
}

const PAGE_SIZE = 50

const makeRows = (count: number) =>
  Array.from({ length: count }, (_, index) => [
    `Gjaldflokkur ${index}`,
    '453-78857-53',
    '31.08.2025',
    '565.990 kr.',
  ])

const buildField = (rowCount: number, pageSize?: number) =>
  buildInteractiveTableField({
    id: 'selectedDebts',
    selectable: true,
    pageSize,
    header: ['Gjaldflokkur', 'Gjaldgrunnur', 'Eindagi', 'Skuldir'],
    rows: makeRows(rowCount),
  }) as InteractiveTableField

const renderField = (rowCount: number, pageSize?: number) =>
  render(
    <InteractiveTableFormField
      field={buildField(rowCount, pageSize)}
      application={application}
    />,
    { wrapper: Wrapper },
  )

const rowCheckboxIds = () =>
  Array.from(
    document.querySelectorAll<HTMLInputElement>(
      'input[id^="selectedDebts-select-"]',
    ),
  )
    .map((input) => input.id)
    .filter((id) => id !== 'selectedDebts-select-all')

const goToPage = (page: number) =>
  userEvent.click(screen.getByRole('button', { name: String(page) }))

describe('InteractiveTableFormField pagination', () => {
  it('renders only the first page when there are more rows than the page size', () => {
    renderField(60, PAGE_SIZE)

    const ids = rowCheckboxIds()
    expect(ids).toHaveLength(PAGE_SIZE)
    expect(ids[0]).toBe('selectedDebts-select-0')
    expect(ids[PAGE_SIZE - 1]).toBe('selectedDebts-select-49')
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
  })

  it('keeps absolute row indices on the second page', async () => {
    renderField(60, PAGE_SIZE)

    await goToPage(2)

    const ids = rowCheckboxIds()
    expect(ids).toHaveLength(10)
    expect(ids[0]).toBe('selectedDebts-select-50')
    expect(ids[9]).toBe('selectedDebts-select-59')
    expect(screen.getByText('Gjaldflokkur 59')).toBeInTheDocument()
  })

  it('renders no pagination control when every row fits on one page', () => {
    renderField(PAGE_SIZE, PAGE_SIZE)

    expect(rowCheckboxIds()).toHaveLength(PAGE_SIZE)
    expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument()
  })

  it('renders every row when no page size is set', () => {
    renderField(60)

    expect(rowCheckboxIds()).toHaveLength(60)
    expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument()
  })

  it.each([
    [100, 2],
    [281, 6],
  ])(
    'mounts only one page of rows for a customer with %i debts',
    (debtCount, expectedPages) => {
      renderField(debtCount, PAGE_SIZE)

      expect(rowCheckboxIds()).toHaveLength(PAGE_SIZE)
      expect(
        screen.getByRole('button', { name: String(expectedPages) }),
      ).toBeInTheDocument()
    },
  )

  it('seeds a default answer for every row, including rows on later pages', async () => {
    renderField(60, PAGE_SIZE)

    await waitFor(() => {
      expect(form?.getValues('selectedDebts')).toHaveLength(60)
    })

    expect(form?.getValues('selectedDebts')).toEqual(Array(60).fill(false))
  })

  it('keeps a selection made on the first page after paging away and back', async () => {
    renderField(60, PAGE_SIZE)

    const checkbox = document.getElementById(
      'selectedDebts-select-0',
    ) as HTMLInputElement
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()

    await goToPage(2)
    expect(document.getElementById('selectedDebts-select-0')).toBeNull()

    await goToPage(1)
    expect(document.getElementById('selectedDebts-select-0')).toBeChecked()
  })
})
