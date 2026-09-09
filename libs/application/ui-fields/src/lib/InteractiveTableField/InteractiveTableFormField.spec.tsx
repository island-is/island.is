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

const makeRows = (count: number) =>
  Array.from({ length: count }, (_, index) => [
    `Gjaldflokkur ${index}`,
    '453-78857-53',
    '31.08.2025',
    '565.990 kr.',
  ])

const buildField = (rowCount: number) =>
  buildInteractiveTableField({
    id: 'selectedDebts',
    selectable: true,
    header: ['Gjaldflokkur', 'Gjaldgrunnur', 'Eindagi', 'Skuldir'],
    rows: makeRows(rowCount),
  }) as InteractiveTableField

const renderField = (rowCount: number) =>
  render(
    <InteractiveTableFormField
      field={buildField(rowCount)}
      application={application}
    />,
    { wrapper: Wrapper },
  )

const renderHeader = (header: InteractiveTableField['header']) =>
  render(
    <InteractiveTableFormField
      field={
        buildInteractiveTableField({
          id: 'selectedDebts',
          header,
          rows: makeRows(1),
        }) as InteractiveTableField
      }
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

describe('InteractiveTableFormField rows', () => {
  it('renders every row', () => {
    renderField(60)

    const ids = rowCheckboxIds()
    expect(ids).toHaveLength(60)
    expect(ids[0]).toBe('selectedDebts-select-0')
    expect(ids[59]).toBe('selectedDebts-select-59')
  })

  it.each([[100], [281]])(
    'mounts every row for a customer with %i debts',
    (debtCount) => {
      renderField(debtCount)

      expect(rowCheckboxIds()).toHaveLength(debtCount)
    },
  )

  it('seeds a default answer for every row', async () => {
    renderField(60)

    await waitFor(() => {
      expect(form?.getValues('selectedDebts')).toHaveLength(60)
    })

    expect(form?.getValues('selectedDebts')).toEqual(Array(60).fill(false))
  })
})
describe('InteractiveTableFormField header tooltip', () => {
  const headerWithTooltip = [
    'Gjaldflokkur',
    { label: 'Gjaldgr.', tooltip: 'Gjaldgrunnur' },
    'Eindagi',
    'Skuldir',
  ]

  it('spells the abbreviated header out on hover', async () => {
    renderHeader(headerWithTooltip)

    await userEvent.hover(screen.getByText('Gjaldgr.'))

    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible())
    expect(screen.getByRole('tooltip')).toHaveTextContent('Gjaldgrunnur')
  })

  it('spells it out for the keyboard as well', async () => {
    renderHeader(headerWithTooltip)

    await userEvent.tab()

    expect(screen.getByText('Gjaldgr.')).toHaveFocus()
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible())
    expect(screen.getByRole('tooltip')).toHaveTextContent('Gjaldgrunnur')
  })

  it('leaves headers without a tooltip untouched', async () => {
    renderHeader(headerWithTooltip)

    await userEvent.hover(screen.getByText('Gjaldflokkur'))

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
