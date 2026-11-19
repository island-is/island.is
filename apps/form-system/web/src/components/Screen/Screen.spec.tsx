import { useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import {
  NotificationCommands,
  SectionTypes,
} from '@island.is/form-system/enums'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { Footer } from '../Footer/Footer'
import { Field } from './components/Field/Field'
import { Screen } from './Screen'

jest.mock('../../context/ApplicationProvider', () => ({
  useApplicationContext: jest.fn(),
}))
jest.mock('@apollo/client', () => ({ useMutation: jest.fn() }))
jest.mock('@island.is/form-system/graphql', () => ({
  removeTypename: (value: unknown) => value,
}))
jest.mock('@island.is/shared/components', () => ({
  Markdown: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))
jest.mock('@island.is/form-system/ui', () => ({
  SectionTypes: jest.requireActual<
    typeof import('@island.is/form-system/enums')
  >('@island.is/form-system/enums').SectionTypes,
  m: {
    addMulti: 'Add',
    removeMulti: 'Remove',
    basicErrorMessage: 'Generic error',
  },
}))
jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: (message: string) => message,
  }),
}))
jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: (message: string) => message }),
}))
jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridColumn: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  AlertMessage: ({
    type,
    title,
    message,
  }: {
    type: string
    title?: ReactNode
    message?: ReactNode
  }) => (
    <div role="alert" data-type={type}>
      {title}
      {message}
    </div>
  ),
  Icon: () => null,
  Stack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Checkbox: ({ onChange, disabled }: ComponentProps<'input'>) => (
    <input type="checkbox" onChange={onChange} disabled={disabled} />
  ),
  Button: ({
    children,
    onClick,
    disabled,
  }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))
jest.mock('../Footer/Footer', () => ({
  Footer: ({
    externalDataAgreement,
    onConfirmPremises,
    isValidateEligibilityError,
  }: ComponentProps<typeof Footer>) => {
    return externalDataAgreement ? (
      <button
        disabled={isValidateEligibilityError}
        onClick={async () => mockConfirmation(await onConfirmPremises?.())}
      >
        Confirm
      </button>
    ) : null
  },
}))
jest.mock('./components/Applicants/Applicants', () => ({
  Applicants: () => null,
}))
jest.mock('./components/Completed/Completed', () => ({ Completed: () => null }))
jest.mock('./components/Payment/Payment', () => ({ Payment: () => null }))
jest.mock('./components/Summary/Summary', () => ({ Summary: () => null }))
jest.mock('./components/Field/Field', () => ({
  Field: ({ field, valueIndex = 0 }: ComponentProps<typeof Field>) => (
    <output>{`${field.id}:${valueIndex}`}</output>
  ),
}))

const field = (
  id: string,
  isPartOfMultiset: boolean,
  count = 1,
): FormSystemField => ({
  id,
  screenId: 'screen',
  name: { is: id },
  isRequired: false,
  isPartOfMultiset,
  values: Array.from({ length: count }, () => ({ json: { text: 'value' } })),
})
const dispatch = jest.fn()
const notifyExternal = jest.fn()
const mockConfirmation = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  notifyExternal.mockResolvedValue({
    data: {
      notifyFormSystemExternalSystem: {
        operationSuccessful: true,
        screenError: { hasError: false },
      },
    },
  })
  jest
    .mocked(useMutation)
    .mockReturnValue([notifyExternal, { loading: false }] as never)
})

const renderScreen = (isMulti = true) => {
  const fields = [
    field('standalone-first', false, 4),
    field('repeated-first', true, 2),
    field('standalone-second', false),
    field('repeated-second', true, 2),
    field('standalone-last', false),
  ]
  const section = { sectionType: SectionTypes.INPUT, isCompleted: false }
  jest.mocked(useApplicationContext).mockReturnValue({
    state: {
      currentScreen: { data: { id: 'screen', isMulti, multiMax: 3, fields } },
      currentSection: { index: 0, data: section },
      sections: [section],
      application: {},
    },
    dispatch,
  } as unknown as ReturnType<typeof useApplicationContext>)
  render(<Screen />)
}

it('keeps leading fields above the multiset and moves interleaved standalone fields below its controls', () => {
  renderScreen()
  expect(
    Array.from(document.querySelectorAll('output, button')).map(
      (element) => element.textContent,
    ),
  ).toEqual([
    'standalone-first:0',
    'repeated-first:0',
    'repeated-second:0',
    'repeated-first:1',
    'repeated-second:1',
    'Remove',
    'Add',
    'standalone-second:0',
    'standalone-last:0',
  ])

  fireEvent.click(screen.getByRole('button', { name: 'Add' }))
  expect(screen.getByText('repeated-second:2')).toBeTruthy()
  expect(dispatch).toHaveBeenCalledWith({
    type: 'ADD_MULTISET_ITEM',
    payload: {},
  })
  expect(
    screen.getByRole('button', { name: 'Add' }).hasAttribute('disabled'),
  ).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Remove' }))
  expect(screen.queryByText('repeated-second:2')).toBeNull()
  expect(dispatch).toHaveBeenCalledWith({
    type: 'REMOVE_MULTISET_ITEM',
    payload: {},
  })
})

it('preserves field order and renders no multiset controls on ordinary screens', () => {
  renderScreen(false)
  expect(
    screen.getAllByRole('status').map((element) => element.textContent),
  ).toEqual([
    'standalone-first:0',
    'repeated-first:0',
    'standalone-second:0',
    'repeated-second:0',
    'standalone-last:0',
  ])
  expect(screen.queryByRole('button')).toBeNull()
})

it.each([
  {
    validateEligibility: true,
    submissionServiceUrl: 'service',
    shouldNotify: true,
  },
  {
    validateEligibility: false,
    submissionServiceUrl: 'service',
    shouldNotify: false,
  },
  {
    validateEligibility: true,
    submissionServiceUrl: 'zendesk',
    shouldNotify: false,
  },
])(
  'notifies eligibility only on premises confirmation with eligibility=$validateEligibility and service=$submissionServiceUrl',
  async ({ validateEligibility, submissionServiceUrl, shouldNotify }) => {
    const section = { sectionType: SectionTypes.PREMISES, isCompleted: false }
    jest.mocked(useApplicationContext).mockReturnValue({
      state: {
        currentScreen: { data: { id: 'screen', fields: [] } },
        currentSection: { index: 0, data: section },
        sections: [section],
        application: { id: 'application', submissionServiceUrl },
      },
      dispatch,
      validateEligibility,
    } as unknown as ReturnType<typeof useApplicationContext>)

    render(<Screen />)
    expect(notifyExternal).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('checkbox'))
    expect(notifyExternal).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(mockConfirmation).toHaveBeenCalledWith(true))
    expect(notifyExternal).toHaveBeenCalledTimes(shouldNotify ? 1 : 0)
    if (shouldNotify) {
      expect(notifyExternal).toHaveBeenCalledWith({
        variables: {
          input: expect.objectContaining({
            applicationId: 'application',
            command: NotificationCommands.VALIDATE_ELIGIBILITY,
          }),
        },
      })
    }
  },
)

it.each([false, true])(
  'allows retry after a connection failure but blocks an eligibility rejection with operationSuccessful=%s',
  async (operationSuccessful) => {
    notifyExternal.mockResolvedValueOnce({
      data: {
        notifyFormSystemExternalSystem: {
          operationSuccessful,
          screenError: { hasError: true },
        },
      },
    })
    const section = { sectionType: SectionTypes.PREMISES, isCompleted: false }
    jest.mocked(useApplicationContext).mockReturnValue({
      state: {
        currentScreen: { data: { id: 'screen', fields: [] } },
        currentSection: { index: 0, data: section },
        sections: [section],
        application: { id: 'application', submissionServiceUrl: 'service' },
      },
      dispatch,
      validateEligibility: true,
    } as unknown as ReturnType<typeof useApplicationContext>)

    render(<Screen />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    const button = screen.getByRole('button', { name: 'Confirm' })
    fireEvent.click(button)
    await waitFor(() => expect(mockConfirmation).toHaveBeenCalledWith(false))
    expect(button.hasAttribute('disabled')).toBe(operationSuccessful)
    expect(checkbox.hasAttribute('disabled')).toBe(operationSuccessful)

    if (!operationSuccessful) {
      fireEvent.click(button)
      await waitFor(() => expect(mockConfirmation).toHaveBeenCalledWith(true))
      expect(notifyExternal).toHaveBeenCalledTimes(2)
    }
  },
)

it.each([false, true])(
  'replaces previous notification state with a generic error and permits retry when a request throws after operationSuccessful=%s',
  async (operationSuccessful) => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    try {
      notifyExternal
        .mockResolvedValueOnce({
          data: {
            notifyFormSystemExternalSystem: {
              operationSuccessful,
              screenError: {
                hasError: !operationSuccessful,
                title: { is: 'Previous error' },
                message: { is: 'Previous details' },
              },
            },
          },
        })
        .mockRejectedValueOnce(new Error('Connection failed'))
      const section = { sectionType: SectionTypes.PREMISES, isCompleted: false }
      jest.mocked(useApplicationContext).mockReturnValue({
        state: {
          currentScreen: { data: { id: 'screen', fields: [] } },
          currentSection: { index: 0, data: section },
          sections: [section],
          application: { id: 'application', submissionServiceUrl: 'service' },
        },
        dispatch,
        validateEligibility: true,
      } as unknown as ReturnType<typeof useApplicationContext>)

      render(<Screen />)
      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)
      const button = screen.getByRole('button', { name: 'Confirm' })
      fireEvent.click(button)
      await waitFor(() => expect(mockConfirmation).toHaveBeenCalledTimes(1))
      fireEvent.click(button)
      await waitFor(() => expect(mockConfirmation).toHaveBeenCalledTimes(2))

      expect(mockConfirmation).toHaveBeenLastCalledWith(false)
      expect(screen.getByRole('alert').getAttribute('data-type')).toBe('error')
      expect(screen.getByText('Generic error')).toBeTruthy()
      expect(screen.queryByText('Previous error')).toBeNull()
      expect(screen.queryByText('Previous details')).toBeNull()
      expect(button.hasAttribute('disabled')).toBe(false)
      expect(checkbox.hasAttribute('disabled')).toBe(false)
      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SAVE_FAILED' }),
      )

      fireEvent.click(button)
      await waitFor(() => expect(mockConfirmation).toHaveBeenCalledTimes(3))
      expect(mockConfirmation).toHaveBeenLastCalledWith(true)
      expect(screen.queryByRole('alert')).toBeNull()
    } finally {
      consoleError.mockRestore()
    }
  },
)
