/**
 * The ábendingar list is capped by the API at 100 rows and, per the contract,
 * rarely passes 20 — small enough that it is sorted and paged entirely in the
 * browser. What these tests pin is the part of that which is not obvious:
 *
 *  - the server's own order is a RANKING (the most extreme in each direction),
 *    so it has to survive being sorted away from and be reachable again;
 *  - the prop the rows arrive in is owned by SalaryAnalysisResults' state, so
 *    sorting must not reorder it in place;
 *  - the ordinal header carries a tooltip, which must stay out of the sort
 *    button.
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { PayDispersionTable } from './PayDispersionTable'

type PayDispersionDto = SalaryAnalysisResponseDto['payDispersion']
type PayDispersionEmployee = PayDispersionDto['employees'][number]

// Renders the defaultMessage with its placeholders filled, rather than the
// descriptor object: the sort buttons take their accessible name from an
// interpolated message, so a mock that returns the descriptor would leave every
// header with the same unusable name.
jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (
      message: { defaultMessage?: string } | string | undefined,
      values?: Record<string, string | number>,
    ) => {
      if (!message) return message
      const text =
        typeof message === 'string' ? message : message.defaultMessage ?? ''
      return Object.entries(values ?? {}).reduce(
        (acc, [key, value]) => acc.split(`{${key}}`).join(String(value)),
        text,
      )
    },
  }),
}))

const employee = (
  ordinal: number,
  overrides: Partial<PayDispersionEmployee> = {},
): PayDispersionEmployee => ({
  employeeOrdinal: ordinal,
  gender: 'FEMALE',
  score: 100 * ordinal,
  regularHourlyWage: 4000,
  expectedHourlyWage: 5000,
  deviationPercent: -20,
  payStatus: 'UNDERPAID',
  studentizedResidual: -2.5,
  ...overrides,
})

const dispersion = (employees: PayDispersionEmployee[]): PayDispersionDto => ({
  available: true,
  blockers: [],
  population: 'ALL_EMPLOYEES',
  threshold: 2,
  cohortResidualSpreadPercentUp: 19.55,
  cohortResidualSpreadPercentDown: -16.35,
  employees,
  countBelowExpected: employees.length,
  countAboveExpected: 0,
  chanceCriticalSpreads: 3.5,
})

// The first cell of every body row is the employee's ordinal, so the rendered
// order reads straight off them. Row 0 is the header.
const renderedOrdinals = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent)

const sortBy = (column: string) =>
  userEvent.click(screen.getByRole('button', { name: `Raða eftir ${column}` }))

// TablePagination puts the same "go to page N" label on the numbered control
// and on the next/prev arrow that lands on the same page, so page two is two
// buttons. Either one does; the first is the numbered one.
const goToPage = (page: number) =>
  userEvent.click(
    screen.getAllByRole('button', { name: `Fara á síðu ${page}` })[0],
  )

describe('PayDispersionTable', () => {
  describe('pagination', () => {
    it('leaves a list at the API soft cap on one page, with no pager', () => {
      const employees = Array.from({ length: 20 }, (_, i) => employee(i + 1))
      render(<PayDispersionTable payDispersion={dispersion(employees)} />)

      expect(renderedOrdinals()).toHaveLength(20)
      expect(
        screen.queryByRole('button', { name: 'Fara á síðu 2' }),
      ).not.toBeInTheDocument()
    })

    it('pages a longer list twenty rows at a time', async () => {
      const employees = Array.from({ length: 25 }, (_, i) => employee(i + 1))
      render(<PayDispersionTable payDispersion={dispersion(employees)} />)

      expect(renderedOrdinals()).toHaveLength(20)
      expect(renderedOrdinals()[0]).toBe('1')

      await goToPage(2)

      expect(renderedOrdinals()).toEqual(['21', '22', '23', '24', '25'])
    })

    it('returns to the first page when the order changes under the reader', async () => {
      const employees = Array.from({ length: 25 }, (_, i) => employee(i + 1))
      render(<PayDispersionTable payDispersion={dispersion(employees)} />)

      await goToPage(2)
      expect(renderedOrdinals()[0]).toBe('21')

      await sortBy('Stig')

      expect(renderedOrdinals()[0]).toBe('1')
    })
  })

  describe('sorting', () => {
    // Server order is none of the column orders, so every assertion below can
    // only pass for the order it names.
    const employees = [
      employee(3, { score: 300 }),
      employee(1, { score: 100 }),
      employee(2, { score: 200 }),
    ]

    it('cycles a column ascending, descending, then back to the order the server ranked', async () => {
      render(<PayDispersionTable payDispersion={dispersion(employees)} />)
      expect(renderedOrdinals()).toEqual(['3', '1', '2'])

      await sortBy('Stig')
      expect(renderedOrdinals()).toEqual(['1', '2', '3'])

      await sortBy('Stig')
      expect(renderedOrdinals()).toEqual(['3', '2', '1'])

      await sortBy('Stig')
      expect(renderedOrdinals()).toEqual(['3', '1', '2'])
    })

    it('never reorders the array it was handed', async () => {
      const source = [...employees]
      render(<PayDispersionTable payDispersion={dispersion(source)} />)

      await sortBy('Stig')

      expect(source.map((e) => e.employeeOrdinal)).toEqual([3, 1, 2])
    })

    it('announces the sorted column through aria-sort', async () => {
      render(<PayDispersionTable payDispersion={dispersion(employees)} />)
      const stig = () => screen.getByRole('columnheader', { name: /Stig/ })

      expect(stig()).toHaveAttribute('aria-sort', 'none')

      await sortBy('Stig')
      expect(stig()).toHaveAttribute('aria-sort', 'ascending')

      await sortBy('Stig')
      expect(stig()).toHaveAttribute('aria-sort', 'descending')

      await sortBy('Stig')
      expect(stig()).toHaveAttribute('aria-sort', 'none')
    })

    it('sorts Kyn by the label the reader can see, not by the enum', async () => {
      render(
        <PayDispersionTable
          payDispersion={dispersion([
            employee(1, { gender: 'NEUTRAL' }),
            employee(2, { gender: 'MALE' }),
            employee(3, { gender: 'FEMALE' }),
          ])}
        />,
      )

      await sortBy('Kyn')

      // Karl, Kona, Kynsegin.
      expect(renderedOrdinals()).toEqual(['2', '3', '1'])
    })

    it('sorts Launafrávik signed, so the two directions stay apart', async () => {
      render(
        <PayDispersionTable
          payDispersion={dispersion([
            employee(1, { deviationPercent: -30, payStatus: 'UNDERPAID' }),
            employee(2, { deviationPercent: 40, payStatus: 'OVERPAID' }),
            employee(3, { deviationPercent: -10, payStatus: 'UNDERPAID' }),
          ])}
        />,
      )

      await sortBy('Frávik')

      expect(renderedOrdinals()).toEqual(['1', '3', '2'])
    })

    it('offers no sort control on a list that cannot be reordered', () => {
      render(<PayDispersionTable payDispersion={dispersion([employee(1)])} />)

      expect(
        screen.queryByRole('button', { name: /^Raða eftir/ }),
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('columnheader', { name: /Stig/ }),
      ).not.toHaveAttribute('aria-sort')
    })

    it('keeps the ordinal tooltip outside the sort button', () => {
      render(<PayDispersionTable payDispersion={dispersion(employees)} />)

      const button = screen.getByRole('button', { name: 'Raða eftir #' })

      expect(button).toHaveTextContent('#')
      expect(within(button).queryByRole('button')).not.toBeInTheDocument()
      // The tooltip trigger is focusable; nesting it would take it out of the
      // tab order and make the button invalid.
      expect(button.querySelector('[tabindex]')).toBeNull()
    })
  })

  describe('rows withheld', () => {
    it('still renders nothing for a population the contract does not list', () => {
      render(
        <PayDispersionTable
          payDispersion={{
            ...dispersion([employee(1), employee(2)]),
            population: 'EXCLUDING_MINIMUM_SET',
          }}
        />,
      )

      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })
})
