import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FC, PropsWithChildren } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { InteractiveTableFormFieldRow } from './InteractiveTableFormFieldRow'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    formatMessage: (message: unknown) =>
      typeof message === 'string'
        ? message
        : (message as { defaultMessage: string }).defaultMessage,
    lang: 'is',
  }),
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

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  const methods = useForm()

  return (
    <FormProvider {...methods}>
      <table>
        <tbody>{children}</tbody>
      </table>
    </FormProvider>
  )
}

const expandedHeader = ['Gjalddagi', 'Eindagi', 'Höfuðstóll', 'Vextir']
const expandedRows = [['01.08.2025', '31.08.2025', '200.000 kr.', '9.222 kr.']]

const baseProps = {
  row: ['Gjaldflokkur 1', '453-78857-53', '2025/08', '565.990 kr.'],
  rowIndex: 0,
  application,
  selectable: true,
  fieldId: 'selectedDebts',
  hasInputColumn: false,
  inputPlaceholder: 'kr.',
  columns: [
    { truncate: false, expandable: true },
    { truncate: false },
    { truncate: false },
    { truncate: false },
  ],
  colSpan: 5,
  expandedHeader,
  expandedRows,
}

const renderRow = (props: Partial<typeof baseProps> = {}) =>
  render(<InteractiveTableFormFieldRow {...baseProps} {...props} />, {
    wrapper: Wrapper,
  })

const getToggle = () => screen.getByRole('button', { name: /Gjaldflokkur 1/ })

describe('InteractiveTableFormFieldRow', () => {
  it('renders the expandable cell as a collapsed toggle', () => {
    renderRow()

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Höfuðstóll')).not.toBeInTheDocument()
  })

  it('reveals the sub-table when the toggle is clicked', async () => {
    renderRow()

    await userEvent.click(getToggle())

    expect(getToggle()).toHaveAttribute('aria-expanded', 'true')
    expandedHeader.forEach((cell) =>
      expect(screen.getByText(cell)).toBeInTheDocument(),
    )
    expandedRows[0].forEach((cell) =>
      expect(screen.getByText(cell)).toBeInTheDocument(),
    )
  })

  it('collapses the sub-table again when the toggle is clicked twice', async () => {
    renderRow()

    await userEvent.click(getToggle())
    await userEvent.click(getToggle())

    expect(getToggle()).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders a plain cell when the row has no sub-table rows', () => {
    renderRow({ expandedRows: [] })

    expect(
      screen.queryByRole('button', { name: /Gjaldflokkur 1/ }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Gjaldflokkur 1')).toBeInTheDocument()
  })

  it('renders a plain cell when no column is marked expandable', () => {
    renderRow({
      columns: [
        { truncate: false },
        { truncate: false },
        { truncate: false },
        { truncate: false },
      ],
    })

    expect(
      screen.queryByRole('button', { name: /Gjaldflokkur 1/ }),
    ).not.toBeInTheDocument()
  })
})
