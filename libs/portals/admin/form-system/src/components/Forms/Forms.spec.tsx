import { FormStatus } from '@island.is/form-system/enums'
import { FormListItem } from '@island.is/form-system/graphql'
import { render, screen, within } from '@testing-library/react'
import { ButtonHTMLAttributes, ReactNode, useContext } from 'react'
import { FormsContext } from '../../context/FormsContext'
import { Forms } from './Forms'

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
  },
}))
jest.mock('../OrganizationSelect', () => ({
  OrganizationSelect: () => null,
}))
jest.mock('../tableHeader.css', () => ({}))
jest.mock('./components/Table/TableHeader', () => ({
  TableHeader: () => null,
}))
jest.mock('./components/Table/TableRow', () => ({
  TableRow: () => null,
}))
jest.mock('@island.is/island-ui/core', () => {
  const Container = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  )
  return {
    Box: Container,
    Stack: Container,
    GridRow: Container,
    Text: Container,
    Tag: ({ children }: { children: ReactNode }) => <span>{children}</span>,
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
    FilterInput: ({ placeholder }: { placeholder: string }) => (
      <input placeholder={placeholder} />
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
