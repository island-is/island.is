import { FormStatus } from '@island.is/form-system/enums'
import { FormListItem } from '@island.is/form-system/graphql'
import { fireEvent, render, screen, within } from '@testing-library/react'
import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  useContext,
} from 'react'
import { FormsContext } from '../../context/FormsContext'
import { Forms } from './Forms'
import type { SortColumn } from './components/Table/TableHeader'

jest.mock('@apollo/client', () => ({
  useMutation: () => [jest.fn()],
}))
jest.mock('@island.is/form-system/graphql', () => ({
  CREATE_FORM: 'CREATE_FORM',
  IMPORT_FORM: 'IMPORT_FORM',
}))
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))
jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (message: { defaultMessage: string }) =>
      message.defaultMessage,
  }),
}))
jest.mock('@island.is/form-system/ui', () => ({
  m: {
    published: { defaultMessage: 'Útgefið' },
    inProgress: { defaultMessage: 'Í vinnslu' },
    publishedInProgress: { defaultMessage: 'Útgefið í vinnslu' },
    newForm: { defaultMessage: 'Nýtt' },
    importForm: { defaultMessage: 'Flytja inn' },
    name: { defaultMessage: 'Nafn' },
    lastModified: { defaultMessage: 'Síðast breytt' },
    state: { defaultMessage: 'Staða' },
    actions: { defaultMessage: 'Aðgerðir' },
  },
}))
jest.mock('../OrganizationSelect', () => ({
  OrganizationSelect: () => null,
}))
jest.mock('../tableHeader.css', () => ({}))
jest.mock('./Forms.css', () => ({
  statusSummary: 'status-summary',
  status: {},
}))
jest.mock('./components/Table/TableHeader', () => ({
  TableHeader: ({ onSort }: { onSort: (column: SortColumn) => void }) => (
    <button onClick={() => onSort('name')}>Sort by name</button>
  ),
}))
jest.mock('./components/Table/TableRow', () => ({
  TableRow: ({ name }: { name: string }) => (
    <div data-testid="form-row">{name}</div>
  ),
}))
jest.mock('@island.is/island-ui/core', () => {
  const Container = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  )
  return {
    Box: ({
      children,
      onClick,
    }: {
      children?: ReactNode
      onClick?: () => void
    }) => <div onClick={onClick}>{children}</div>,
    Stack: Container,
    GridRow: Container,
    GridColumn: Container,
    Text: Container,
    Tag: ({
      children,
      onClick,
      'aria-pressed': pressed,
    }: ButtonHTMLAttributes<HTMLButtonElement>) =>
      onClick ? (
        <button onClick={onClick} aria-pressed={pressed}>
          {children}
        </button>
      ) : (
        <span>{children}</span>
      ),
    Button: ({
      children,
      onClick,
    }: ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick}>{children}</button>
    ),
    Checkbox: () => null,
    Filter: ({
      labelOpen,
      filterInput,
    }: {
      labelOpen: string
      filterInput: ReactNode
    }) => (
      <div>
        <button>{labelOpen}</button>
        {filterInput}
      </div>
    ),
    FilterInput: ({
      placeholder,
      value,
      onChange,
    }: Pick<InputHTMLAttributes<HTMLInputElement>, 'placeholder' | 'value'> & {
      onChange: (value: string) => void
    }) => (
      <input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ),
    Icon: () => null,
  }
})

const FormsWithContext = ({ forms }: { forms: FormListItem[] }) => {
  const context = useContext(FormsContext)
  return (
    <FormsContext.Provider value={{ ...context, forms }}>
      <Forms />
    </FormsContext.Provider>
  )
}

const makeForms = (statuses: FormListItem['status'][]): FormListItem[] =>
  statuses.map((status, index) => ({
    id: `form-${index}`,
    name: { is: `Form ${index}` },
    modified: '2026-11-26T09:00:00Z',
    isInaccessible: false,
    status,
  }))

it('keeps the status header static while retaining name and date sorting', () => {
  const { TableHeader } = jest.requireActual<
    typeof import('./components/Table/TableHeader')
  >('./components/Table/TableHeader')
  const onSort = jest.fn()
  render(<TableHeader sortColumn={null} sortDirection="asc" onSort={onSort} />)

  fireEvent.click(screen.getByText('Staða'))
  expect(onSort).not.toHaveBeenCalled()

  fireEvent.click(screen.getByText('Nafn'))
  expect(onSort).toHaveBeenLastCalledWith('name')

  fireEvent.click(screen.getByText('Síðast breytt'))
  expect(onSort).toHaveBeenLastCalledWith('lastModified')
})

const expectCountsAboveFilters = (counts: [number, number, number]) => {
  const expected = [
    `Útgefið${counts[0]}`,
    `Í vinnslu${counts[1]}`,
    `Útgefið í vinnslu${counts[2]}`,
  ].join('')

  const filters = screen.getByRole('button', { name: 'Opna síu' }).parentElement
  if (!filters) throw new Error('Missing form filters')
  expect(filters.previousElementSibling?.textContent).toBe(expected)
  expect(
    within(filters).getByPlaceholderText('Sía eftir leitarorði'),
  ).toBeTruthy()
  expect(screen.getAllByText('Útgefið')).toHaveLength(1)
}

it('shows each status total together above the filter and search controls', () => {
  render(
    <FormsWithContext
      forms={makeForms([
        FormStatus.PUBLISHED,
        FormStatus.IN_DEVELOPMENT,
        FormStatus.PUBLISHED_BEING_CHANGED,
        FormStatus.PUBLISHED,
        FormStatus.PUBLISHED_BEING_CHANGED,
        FormStatus.PUBLISHED_BEING_CHANGED,
        FormStatus.ARCHIVED,
      ])}
    />,
  )

  expectCountsAboveFilters([2, 1, 3])
})

it('shows zero counts for an empty organization and updates when forms change', () => {
  const { rerender } = render(<FormsWithContext forms={[]} />)
  expectCountsAboveFilters([0, 0, 0])

  rerender(<FormsWithContext forms={makeForms([FormStatus.IN_DEVELOPMENT])} />)
  expectCountsAboveFilters([0, 1, 0])

  rerender(<FormsWithContext forms={[]} />)
  expectCountsAboveFilters([0, 0, 0])
})

it.each([
  ['Útgefið', [1, 3, 2, 5, 0, 4]],
  ['Í vinnslu', [2, 5, 1, 3, 0, 4]],
  ['Útgefið í vinnslu', [0, 4, 2, 5, 1, 3]],
])('moves %s forms first without hiding other statuses', (label, order) => {
  render(
    <FormsWithContext
      forms={makeForms([
        FormStatus.PUBLISHED_BEING_CHANGED,
        FormStatus.PUBLISHED,
        FormStatus.IN_DEVELOPMENT,
        FormStatus.PUBLISHED,
        FormStatus.PUBLISHED_BEING_CHANGED,
        FormStatus.IN_DEVELOPMENT,
      ])}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: label }))

  expect(
    screen.getAllByTestId('form-row').map((row) => row.textContent),
  ).toEqual(order.map((index) => `Form ${index}`))
  expect(
    screen.getByRole('button', { name: label, pressed: true }),
  ).toBeTruthy()
  expectCountsAboveFilters([2, 2, 2])
})

it('replaces the selected status priority and resets it when sorting by a column', () => {
  render(
    <FormsWithContext
      forms={makeForms([FormStatus.IN_DEVELOPMENT, FormStatus.PUBLISHED])}
    />,
  )

  fireEvent.click(screen.getByRole('button', { name: 'Útgefið' }))
  expect(screen.getAllByTestId('form-row')[0].textContent).toBe('Form 1')

  fireEvent.click(screen.getByRole('button', { name: 'Í vinnslu' }))
  expect(screen.getAllByTestId('form-row')[0].textContent).toBe('Form 0')
  expect(
    screen.getByRole('button', { name: 'Útgefið', pressed: false }),
  ).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'Sort by name' }))
  expect(
    screen.getByRole('button', { name: 'Í vinnslu', pressed: false }),
  ).toBeTruthy()
  expect(
    screen.getAllByTestId('form-row').map((row) => row.textContent),
  ).toEqual(['Form 0', 'Form 1'])
})

it('preserves search filters and keeps forms visible when a status has no matches', () => {
  render(
    <FormsWithContext
      forms={makeForms([FormStatus.IN_DEVELOPMENT, FormStatus.PUBLISHED])}
    />,
  )
  fireEvent.change(screen.getByPlaceholderText('Sía eftir leitarorði'), {
    target: { value: 'Form 1' },
  })

  fireEvent.click(screen.getByRole('button', { name: 'Í vinnslu' }))
  expect(
    screen.getAllByTestId('form-row').map((row) => row.textContent),
  ).toEqual(['Form 1'])

  fireEvent.change(screen.getByPlaceholderText('Sía eftir leitarorði'), {
    target: { value: '' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Útgefið í vinnslu' }))
  expect(
    screen.getAllByTestId('form-row').map((row) => row.textContent),
  ).toEqual(['Form 0', 'Form 1'])
  expectCountsAboveFilters([1, 1, 0])
})
