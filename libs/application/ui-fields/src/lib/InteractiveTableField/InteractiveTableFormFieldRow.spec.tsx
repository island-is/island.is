import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FC, PropsWithChildren } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import * as styles from './InteractiveTableFormField.css'
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

  it.each([true, false])(
    'pins the chevron to the right edge whether the title truncates (%s) or not',
    (truncate) => {
      renderRow({
        columns: [
          { truncate, expandable: true },
          { truncate: false },
          { truncate: false },
          { truncate: false },
        ],
      })

      expect(getToggle().closest(`.${styles.expandableCell}`)).not.toBeNull()
    },
  )

  describe('truncated expandable cell', () => {
    const longName = 'Gjaldflokkur með mjög löngu heiti sem kemst ekki fyrir'

    const overflow = (scrollWidth: number, clientWidth: number) => {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
        configurable: true,
        get: () => scrollWidth,
      })
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
        configurable: true,
        get: () => clientWidth,
      })
    }

    const renderTruncated = () =>
      renderRow({
        row: [longName, '453-78857-53', '2025/08', '565.990 kr.'],
        columns: [
          { truncate: true, expandable: true },
          { truncate: false },
          { truncate: false },
          { truncate: false },
        ],
      })

    afterEach(() => {
      Reflect.deleteProperty(HTMLElement.prototype, 'scrollWidth')
      Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth')
    })

    // The tooltip stays mounted while closed and carries the same text, so the
    // anchor has to be picked out by element rather than by text alone.
    const anchor = () =>
      screen
        .getAllByText(longName)
        .find((element) => element.tagName === 'SPAN') as HTMLElement

    it('shows the full name in a tooltip when it does not fit', async () => {
      overflow(400, 200)
      renderTruncated()

      await userEvent.hover(anchor())

      await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible())
      expect(screen.getByRole('tooltip')).toHaveTextContent(longName)
    })

    it('adds no tooltip when the name already fits', async () => {
      overflow(200, 200)
      renderTruncated()

      await userEvent.hover(anchor())

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('still toggles the sub-table when the name is truncated', async () => {
      overflow(400, 200)
      renderTruncated()

      const toggle = screen.getByRole('button', { name: new RegExp(longName) })
      await userEvent.click(toggle)

      expect(toggle).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByText('Höfuðstóll')).toBeInTheDocument()
    })
  })

  describe('amount column', () => {
    const amountProps = {
      hasInputColumn: true,
      inputFieldId: 'debtsToPay',
      inputMaxAmount: 565990,
      colSpan: 6,
    }

    const renderAmountRow = async () => {
      renderRow(amountProps)
      await userEvent.click(screen.getByRole('checkbox'))
      const input = screen.getByRole('textbox')
      await userEvent.clear(input)
      return input
    }

    it('pre-fills the full debt when the row is selected', async () => {
      renderRow(amountProps)

      expect(screen.getByRole('textbox')).toHaveValue('')
      await userEvent.click(screen.getByRole('checkbox'))
      expect(screen.getByRole('textbox')).toHaveValue('565.990 kr.')
    })

    it('does not accept a zero amount', async () => {
      const input = await renderAmountRow()

      await userEvent.type(input, '0')

      expect(input).toHaveValue('')
    })

    it('drops the minus sign so a negative amount cannot be entered', async () => {
      const input = await renderAmountRow()

      await userEvent.type(input, '-5')

      expect(input).toHaveValue('5 kr.')
    })

    it('does not accept an amount above the debt', async () => {
      const input = await renderAmountRow()

      await userEvent.type(input, '565991')

      expect(input).toHaveValue('56.599 kr.')
    })

    it('accepts an amount between one and the debt', async () => {
      const input = await renderAmountRow()

      await userEvent.type(input, '1000')

      expect(input).toHaveValue('1.000 kr.')
    })
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
