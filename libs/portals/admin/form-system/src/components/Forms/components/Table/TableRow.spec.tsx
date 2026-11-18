import { FormStatus } from '@island.is/form-system/enums'
import { toast } from '@island.is/island-ui/core'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { TableRow } from './TableRow'

const mockUpdateFormStatus = jest.fn()
const mockGetForm = jest.fn()

jest.mock('@apollo/client', () => ({
  useLazyQuery: () => [mockGetForm],
  useMutation: () => [mockUpdateFormStatus],
}))
jest.mock('@island.is/form-system/graphql', () => ({}))
jest.mock('@island.is/form-system/ui', () => ({
  m: {
    publish: { defaultMessage: 'Publish' },
  },
}))
jest.mock('@island.is/shared/utils', () => ({
  getStaticEnv: () => '',
}))
jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: (message?: { defaultMessage?: string }) =>
      message?.defaultMessage ?? '',
    formatDate: () => '',
  }),
}))
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ search: '' }),
}))
jest.mock('../../../StatusTag/StatusTag', () => ({
  StatusTag: () => null,
}))
jest.mock('react-animate-height', () => ({
  __esModule: true,
  default: () => null,
}))
jest.mock('./TableRow.css', () => ({}))
jest.mock('@island.is/island-ui/core', () => {
  const Container = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  )
  return {
    Box: Container,
    Button: () => null,
    GridColumn: Container,
    DialogPrompt: () => null,
    Divider: () => null,
    DropdownMenu: ({
      items,
    }: {
      items: { title: string; onClick?: () => Promise<unknown> }[]
    }) => (
      <>
        {items
          .filter((item) => item.title === 'Publish')
          .map((item) => (
            <button key={item.title} onClick={item.onClick}>
              {item.title}
            </button>
          ))}
      </>
    ),
    Icon: () => null,
    Inline: Container,
    GridRow: Container,
    Text: Container,
    toast: { error: jest.fn(), warning: jest.fn() },
  }
})

describe('publishing a changed form', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('shows an error toast and leaves forms unchanged when publishing fails', async () => {
    const error = new Error('Unexpected error publishing form')
    mockUpdateFormStatus.mockRejectedValue(error)
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: { id: 'changed-form' } } },
    })
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const setFormsState = jest.fn()

    render(
      <TableRow
        id="changed-form"
        name="Changed form"
        slug="form-i-breytingu"
        status={FormStatus.PUBLISHED_BEING_CHANGED}
        isHeader={false}
        setFormsState={setFormsState}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        'Ekki tókst að birta breytt eyðublað. Athugaðu hvort upprunalega eyðublaðið sé enn útgefið.',
      ),
    )
    expect(mockUpdateFormStatus).toHaveBeenCalledWith({
      variables: {
        input: {
          id: 'changed-form',
          updateFormStatusDto: { newStatus: FormStatus.PUBLISHED },
        },
      },
    })
    expect(setFormsState).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('Error publishing form:', error)
  })
})
