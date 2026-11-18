import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import { ApolloError } from '@apollo/client'
import { FormSystemForm } from '@island.is/api/schema'
import { FormStatus } from '@island.is/form-system/enums'
import { toast } from '@island.is/island-ui/core'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ComponentProps, ReactNode, useState } from 'react'
import { FormsContext } from '../../../../context/FormsContext'
import { TableRow } from './TableRow'

const mockUpdateFormStatus = jest.fn<(options: unknown) => Promise<unknown>>()
const mockGetForm = jest.fn<(options: unknown) => Promise<unknown>>()
const mockGetForms = jest.fn<(options: unknown) => Promise<unknown>>()

jest.mock('@apollo/client', () => ({
  ...jest.requireActual<typeof import('@apollo/client')>('@apollo/client'),
  useLazyQuery: (query: unknown) => [
    query === 'GET_FORMS' ? mockGetForms : mockGetForm,
  ],
  useMutation: () => [mockUpdateFormStatus],
}))
jest.mock('@island.is/form-system/graphql', () => ({ GET_FORMS: 'GET_FORMS' }))
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
  default: ({
    children,
    height,
  }: {
    children: ReactNode
    height: number | string
  }) => (height === 0 ? null : <div>{children}</div>),
}))
jest.mock('./TableRow.css', () => ({}))
jest.mock('@island.is/island-ui/core', () => {
  const Container = ({
    children,
    onClick,
  }: {
    children?: ReactNode
    onClick?: () => void
  }) => <div onClick={onClick}>{children}</div>
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
    Icon: ({ icon, color }: { icon: string; color?: string }) => (
      <span data-testid={`icon-${icon}`} data-color={color} />
    ),
    Inline: Container,
    GridRow: Container,
    Stack: Container,
    Text: ({ children, color }: { children?: ReactNode; color?: string }) => (
      <span data-color={color}>{children}</span>
    ),
    toast: { error: jest.fn(), warning: jest.fn() },
  }
})

describe('inaccessible forms', () => {
  it.each([true, false, undefined])(
    'shows a neutral lock and accordion notice only when isInaccessible is true (%s)',
    (isInaccessible) => {
      render(
        <TableRow
          name="Test form"
          isHeader={false}
          isInaccessible={isInaccessible}
          setFormsState={jest.fn()}
        />,
      )

      const name = screen.getByText('Test form')
      expect(name.getAttribute('data-color')).toBeNull()
      const lock = screen.queryByTestId('icon-lockClosed')
      if (isInaccessible) {
        expect(lock).not.toBeNull()
        expect(lock?.getAttribute('data-color')).toBeNull()
      } else {
        expect(lock).toBeNull()
      }
      expect(screen.queryByText('Eyðublaðið er ekki aðgengilegt.')).toBeNull()

      fireEvent.click(name)

      const notice = screen.queryByText('Eyðublaðið er ekki aðgengilegt.')
      if (isInaccessible) {
        expect(notice).not.toBeNull()
        expect(notice?.getAttribute('data-color')).toBeNull()
      } else {
        expect(notice).toBeNull()
      }
    },
  )
})

describe('publishing a form', () => {
  beforeEach(() => {
    mockGetForms.mockReset()
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  const renderChangedForm = () => {
    const setFormsState =
      jest.fn<ComponentProps<typeof TableRow>['setFormsState']>()
    render(
      <FormsContext.Consumer>
        {(context) => (
          <FormsContext.Provider
            value={{ ...context, organizationNationalId: '1234567890' }}
          >
            <TableRow
              id="changed-form"
              name="Changed form"
              slug="form-i-breytingu"
              status={FormStatus.PUBLISHED_BEING_CHANGED}
              isInaccessible
              isHeader={false}
              setFormsState={setFormsState}
            />
          </FormsContext.Provider>
        )}
      </FormsContext.Consumer>,
    )
    return setFormsState
  }

  it.each([FormStatus.IN_DEVELOPMENT, FormStatus.PUBLISHED_BEING_CHANGED])(
    'clears the inaccessible lock and notice after publishing from %s',
    async (status) => {
      const form: FormSystemForm = {
        id: 'form',
        name: { is: 'Test form', en: 'Test form' },
        status,
        slug:
          status === FormStatus.PUBLISHED_BEING_CHANGED
            ? 'form-i-breytingu'
            : 'form',
        created: '2026-01-01T00:00:00Z',
        modified: '2026-01-01T00:00:00Z',
        allowProceedOnValidationFail: false,
        draftDaysToLive: 0,
        enableApplicationPdfDownload: false,
        hasSummaryScreen: false,
        isInaccessible: true,
        isTranslated: true,
        submissionDaysToLive: 0,
        validateEligibility: false,
      }
      mockGetForm.mockResolvedValue({
        data: { formSystemForm: { form } },
      })
      mockUpdateFormStatus.mockResolvedValue({
        data: {
          updateFormSystemFormStatus: {
            form: { id: 'original-form', slug: 'form-archived-123' },
          },
        },
      })
      const FormRow = () => {
        const [forms, setForms] = useState([form])
        return (
          <TableRow
            id={forms[0].id}
            name={forms[0].name?.is ?? ''}
            slug={forms[0].slug ?? ''}
            status={forms[0].status}
            isInaccessible={forms[0].isInaccessible}
            isHeader={false}
            setFormsState={setForms}
          />
        )
      }
      render(<FormRow />)
      fireEvent.click(screen.getByText('Test form'))
      expect(screen.queryByTestId('icon-lockClosed')).not.toBeNull()
      expect(
        screen.queryByText('Eyðublaðið er ekki aðgengilegt.'),
      ).not.toBeNull()

      fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

      await waitFor(() =>
        expect(screen.queryByTestId('icon-lockClosed')).toBeNull(),
      )
      expect(screen.queryByText('Eyðublaðið er ekki aðgengilegt.')).toBeNull()
      expect(screen.queryByRole('button', { name: 'Publish' })).toBeNull()
    },
  )

  it.each([
    {
      failure: 'an unexpected publish error',
      error: new Error('Unexpected error publishing form'),
      failsWhileLoading: false,
    },
    {
      failure: 'a publish request that fails before reaching the server',
      error: new ApolloError({ networkError: new Error('Failed to fetch') }),
      failsWhileLoading: false,
    },
    {
      failure: 'a failed form query',
      error: new ApolloError({ networkError: new Error('Failed to fetch') }),
      failsWhileLoading: true,
    },
  ])(
    'reports $failure after reconciling any attempted publish',
    async ({ error, failsWhileLoading }) => {
      mockUpdateFormStatus.mockRejectedValue(error)
      mockGetForm.mockResolvedValue({
        data: { formSystemForm: { form: { id: 'changed-form' } } },
      })
      const refreshedForms = [
        { id: 'changed-form', status: FormStatus.PUBLISHED_BEING_CHANGED },
      ]
      mockGetForms.mockResolvedValue({
        data: { formSystemForms: { forms: refreshedForms } },
      })
      if (failsWhileLoading) {
        mockGetForm.mockRejectedValueOnce(error)
      }
      const setFormsState = renderChangedForm()
      fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

      await waitFor(() =>
        expect(toast.error).toHaveBeenCalledWith(
          'Ekki er hægt að gefa út breytt eyðublað ef upphaflega útgefna formið hefur verið tekið úr útgáfu. Ef þetta á ekki við, vinsamlegast reyndu aftur.',
        ),
      )
      if (failsWhileLoading) {
        expect(mockUpdateFormStatus).not.toHaveBeenCalled()
        expect(mockGetForms).not.toHaveBeenCalled()
        expect(setFormsState).not.toHaveBeenCalled()
      } else {
        expect(mockUpdateFormStatus).toHaveBeenCalledWith({
          variables: {
            input: {
              id: 'changed-form',
              updateFormStatusDto: { newStatus: FormStatus.PUBLISHED },
            },
          },
        })
        expect(mockGetForms).toHaveBeenCalledWith({
          variables: { input: { nationalId: '1234567890' } },
        })
        expect(setFormsState).toHaveBeenCalledWith(refreshedForms)
      }
      expect(screen.queryByTestId('icon-lockClosed')).not.toBeNull()
      expect(console.error).toHaveBeenCalledWith(
        'Error publishing form:',
        error,
      )
    },
  )

  it('waits for the refresh and adopts an already-published revision without reporting failure', async () => {
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: { id: 'changed-form' } } },
    })
    mockUpdateFormStatus.mockRejectedValue(new Error('File cleanup failed'))
    let finishRefresh: (result: unknown) => void = () => {
      throw new Error('Refresh has not started')
    }
    mockGetForms.mockReturnValue(
      new Promise((resolve) => {
        finishRefresh = resolve
      }),
    )
    const refreshedForms = [
      {
        id: 'changed-form',
        status: FormStatus.PUBLISHED,
        slug: 'form',
        isInaccessible: false,
      },
    ]
    const setFormsState = renderChangedForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() => expect(mockGetForms).toHaveBeenCalledTimes(1))
    expect(setFormsState).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
    expect(toast.warning).not.toHaveBeenCalled()

    await act(async () => {
      finishRefresh({ data: { formSystemForms: { forms: refreshedForms } } })
    })

    expect(setFormsState).toHaveBeenCalledWith(refreshedForms)
    expect(toast.error).not.toHaveBeenCalled()
    expect(toast.warning).not.toHaveBeenCalled()
  })

  it.each([
    {
      failure: 'a rejected refresh',
      refresh: () => Promise.reject(new Error('Refresh failed')),
    },
    {
      failure: 'a refresh error alongside partial data',
      refresh: () =>
        Promise.resolve({
          error: new ApolloError({ networkError: new Error('Refresh failed') }),
          data: { formSystemForms: { forms: [] } },
        }),
    },
    {
      failure: 'a missing forms list',
      refresh: () => Promise.resolve({ data: {} }),
    },
  ])('reports an unconfirmed outcome for $failure', async ({ refresh }) => {
    mockGetForm.mockResolvedValue({
      data: { formSystemForm: { form: { id: 'changed-form' } } },
    })
    mockUpdateFormStatus.mockRejectedValue(new Error('Publish request failed'))
    mockGetForms.mockImplementation(refresh)
    const setFormsState = renderChangedForm()
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }))

    await waitFor(() =>
      expect(toast.warning).toHaveBeenCalledWith(
        'Ekki tókst að staðfesta hvort eyðublaðið var gefið út. Endurhlaðaðu síðuna áður en þú reynir aftur.',
      ),
    )
    expect(setFormsState).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(
      'Error refreshing forms after publishing:',
      expect.any(Error),
    )
  })
})
