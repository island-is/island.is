import { useLazyQuery, useMutation } from '@apollo/client'
import { FormSystemScreen } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'
import { SAVE_SCREEN, SUBMIT_APPLICATION } from '@island.is/form-system/graphql'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  ButtonHTMLAttributes,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { Footer } from './Footer'
import { getPaymentFlow } from '../../utils/payment'
import {
  applicationReducer,
  uploadNavigationReducer,
} from '../../reducers/applicationReducer'
import { Action, ApplicationState } from '@island.is/form-system/ui'

jest.mock('./Footer.css', () => ({ buttonContainer: 'buttonContainer' }))
jest.mock('../../context/ApplicationProvider', () => ({
  useApplicationContext: jest.fn(),
}))
jest.mock('@apollo/client', () => ({
  useMutation: jest.fn(),
  useLazyQuery: jest.fn(),
}))
jest.mock('@island.is/form-system/graphql', () => ({
  removeTypename: (value: unknown) => value,
  SAVE_SCREEN: 'SAVE_SCREEN',
  SUBMIT_APPLICATION: 'SUBMIT_APPLICATION',
}))
jest.mock('@island.is/form-system/ui', () => ({
  FieldTypesEnum: { NUMBERBOX: 'NUMBERBOX' },
  SectionTypes: jest.requireActual('@island.is/form-system/enums').SectionTypes,
  m: {
    continue: 'Continue',
    back: 'Back',
    externalDataConfirmation: 'Confirm',
    submitApplication2: 'Submit',
    openMyPages: 'My pages',
  },
}))
jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ formatMessage: (message: string) => message }),
}))
jest.mock('../../utils/payment', () => ({
  getPaymentFlow: jest.fn(),
}))
jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridColumn: ({ children }: { children: ReactNode }) => <div>{children}</div>,
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

const dispatch = jest.fn()
const mutate = jest.fn()
const submitApplication = jest.fn()
const otherMutation = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  dispatch.mockReset()
  mutate.mockReset()
  submitApplication.mockReset()
  otherMutation.mockReset().mockResolvedValue({})
  jest.mocked(getPaymentFlow).mockReturnValue({
    shouldShowPay: false,
    onSubmit: false,
  })
  mutate.mockResolvedValue({})
  submitApplication.mockResolvedValue({
    data: { submitFormSystemApplication: { submissionFailed: false } },
  })
  jest
    .mocked(useMutation)
    .mockImplementation(
      (operation) =>
        [
          operation === SUBMIT_APPLICATION
            ? submitApplication
            : operation === SAVE_SCREEN
            ? mutate
            : otherMutation,
          { loading: false },
        ] as never,
    )
  jest
    .mocked(useLazyQuery)
    .mockReturnValue([mutate, { loading: false }] as never)
})

it.each(['Continue', 'Back', 'Submit'])(
  'blocks an upload selected while %s is saving before navigating or submitting',
  async (button) => {
    if (button === 'Submit') {
      jest.mocked(getPaymentFlow).mockReturnValue({
        shouldShowPay: false,
        onSubmit: true,
      })
    }
    let finishSave!: (value: object) => void
    const saving = new Promise((resolve) => {
      finishSave = resolve
    })
    mutate.mockReturnValueOnce(saving)
    const { getState } = renderFooter('TEXTBOX', false, 0, '123')

    fireEvent.click(screen.getByRole('button', { name: button }))
    await waitFor(() => expect(mutate).toHaveBeenCalledTimes(1))
    expect(getState().isNavigating).toBe(true)
    expect(dispatch({ type: 'START_FILE_UPLOAD' })).toBe(false)
    expect(dispatch({ type: 'START_NAVIGATION' })).toBe(false)
    const direction = button === 'Back' ? 'DECREMENT' : 'INCREMENT'
    expect(dispatch).not.toHaveBeenCalledWith({ type: direction })
    expect(submitApplication).not.toHaveBeenCalled()

    await act(async () => finishSave({}))
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: 'FINISH_NAVIGATION' }),
    )
    if (button === 'Submit') {
      expect(submitApplication).toHaveBeenCalledTimes(1)
      expect(getState().submitted).toBe(true)
    } else {
      expect(dispatch).toHaveBeenCalledWith({ type: direction })
    }
  },
)

it.each(['save', 'submission'])(
  'releases the submission guard after a %s failure so the user can retry',
  async (phase) => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    jest.mocked(getPaymentFlow).mockReturnValue({
      shouldShowPay: false,
      onSubmit: true,
    })
    const failedOperation = phase === 'submission' ? submitApplication : mutate
    failedOperation.mockRejectedValueOnce(new Error('Request failed'))
    const { getState } = renderFooter('TEXTBOX', false, 0, '123')
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: 'FINISH_NAVIGATION' }),
    )
    expect(getState().isNavigating).toBe(false)
    if (phase === 'submission') {
      expect(submitApplication).toHaveBeenCalledTimes(1)
      expect(submitApplication).toHaveBeenCalledWith({
        variables: { input: { id: 'application' } },
      })
      await expect(submitApplication.mock.results[0].value).rejects.toThrow(
        'Request failed',
      )
    } else {
      expect(submitApplication).not.toHaveBeenCalled()
    }
    act(() => {
      expect(dispatch({ type: 'START_FILE_UPLOAD' })).toBe(true)
      dispatch({ type: 'FINISH_FILE_UPLOAD' })
    })
    const retry = screen.getByRole('button', { name: 'Submit' })
    expect(retry.hasAttribute('disabled')).toBe(false)
    fireEvent.click(retry)
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SUBMITTED',
        payload: expect.objectContaining({ submitted: true }),
      }),
    )
    error.mockRestore()
  },
)

it('does not validate, save or submit if an upload reserves the guard before a render', async () => {
  jest.mocked(getPaymentFlow).mockReturnValue({
    shouldShowPay: false,
    onSubmit: true,
  })
  const { validator } = renderFooter('TEXTBOX')
  dispatch.mockReturnValue(false)

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
  })

  expect(dispatch.mock.calls).toEqual([[{ type: 'START_NAVIGATION' }]])
  expect(mutate).not.toHaveBeenCalled()
  expect(submitApplication).not.toHaveBeenCalled()
  expect(validator).not.toHaveBeenCalled()
})

it('keeps a successfully submitted application locked when saving completion fails', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  jest.mocked(getPaymentFlow).mockReturnValue({
    shouldShowPay: false,
    onSubmit: true,
  })
  mutate
    .mockResolvedValueOnce({})
    .mockRejectedValueOnce(new Error('Could not save completion'))
  const { getState } = renderFooter('TEXTBOX', false, 0, '123')
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

  await waitFor(() => {
    expect(getState().submitted).toBe(true)
    expect(getState().isNavigating).toBe(false)
    expect(getState().screenError?.hasError).toBe(true)
  })
  expect(dispatch({ type: 'START_FILE_UPLOAD' })).toBe(false)
  expect(dispatch({ type: 'START_NAVIGATION' })).toBe(false)
  expect(submitApplication).toHaveBeenCalledTimes(1)
  error.mockRestore()
})

const renderFooter = (
  fieldType = 'NUMBERBOX',
  isHidden = false,
  pendingUploads = 0,
  initialValue = '12',
  {
    allowProceedOnValidationFail = true,
    sectionType = SectionTypes.INPUT,
    loadingFieldIds,
  }: {
    allowProceedOnValidationFail?: boolean
    sectionType?: string
    loadingFieldIds?: string[]
  } = {},
) => {
  const inputScreen: FormSystemScreen = {
    id: 'screen',
    sectionId: 'section',
    isHidden: false,
    fields: [
      {
        id: 'number',
        screenId: 'screen',
        fieldType,
        isHidden,
        isPartOfMultiset: false,
        isRequired: false,
        name: { is: 'Number' },
      },
    ],
  }
  const section = {
    id: 'section',
    sectionType,
    isHidden: false,
    screens: [inputScreen],
  }
  const initialState: ApplicationState = {
    pendingUploads,
    loadingFieldIds,
    currentScreen: { index: 0, data: inputScreen },
    currentSection: { index: 1, data: section },
    sections: [
      { id: 'premises', sectionType: SectionTypes.PREMISES, isHidden: false },
      section,
      { id: 'completed', sectionType: SectionTypes.COMPLETED, isHidden: false },
    ],
    screens: [inputScreen],
    application: { id: 'application', allowProceedOnValidationFail },
  }
  let latestState = initialState
  let guard = initialState
  let setState!: Dispatch<SetStateAction<ApplicationState>>
  dispatch.mockImplementation((action: Action) => {
    const next = uploadNavigationReducer(guard, action)
    if (action.type.startsWith('START_') && next === guard) return false
    guard = next
    setState((state) => applicationReducer(state, action))
    return true
  })
  const validator = jest.fn(
    (value: string) => value.length === 3 || 'Invalid length',
  )

  const Wrapper = () => {
    const [state, updateState] = useState(initialState)
    latestState = state
    setState = updateState
    jest.mocked(useApplicationContext).mockReturnValue({
      state,
      dispatch,
      validateEligibility: false,
      enableApplicationPdfDownload: false,
    })
    const methods = useForm({ defaultValues: { number: [initialValue] } })
    return (
      <FormProvider {...methods}>
        <Controller
          name="number.0"
          control={methods.control}
          rules={{
            validate: validator,
          }}
          render={({ field }) => <input aria-label="Number" {...field} />}
        />
        <Footer externalDataAgreement isValidateEligibilityError={false} />
      </FormProvider>
    )
  }
  render(<Wrapper />)
  return {
    validator,
    getState: () => latestState,
    setPendingUploads: (pendingUploads: number) => {
      guard = { ...guard, pendingUploads }
      act(() => setState((state) => ({ ...state, pendingUploads })))
    },
  }
}

it.each([1, 2])(
  'blocks both navigation directions while %s files are uploading',
  (pendingUploads) => {
    renderFooter('TEXTBOX', false, pendingUploads)
    const next = screen.getByRole('button', { name: 'Continue' })
    const back = screen.getByRole('button', { name: 'Back' })
    expect(next.hasAttribute('disabled')).toBe(true)
    expect(back.hasAttribute('disabled')).toBe(true)
    fireEvent.click(next)
    fireEvent.click(back)
    expect(mutate).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()
  },
)

it.each(['Continue', 'Submit'])(
  'blocks %s until every child lookup finishes, even when validation bypass is enabled',
  async (button) => {
    if (button === 'Submit') {
      jest.mocked(getPaymentFlow).mockReturnValue({
        shouldShowPay: false,
        onSubmit: true,
      })
    }
    renderFooter('FAMILY', false, 0, '123', {
      loadingFieldIds: ['children-1', 'children-2'],
    })
    const next = screen.getByRole('button', { name: button })
    expect(next.hasAttribute('disabled')).toBe(true)
    expect(
      screen.getByRole('button', { name: 'Back' }).hasAttribute('disabled'),
    ).toBe(false)
    fireEvent.click(next)
    expect(mutate).not.toHaveBeenCalled()
    expect(submitApplication).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()

    act(() => {
      dispatch({
        type: 'SET_FIELD_LOADING',
        payload: { id: 'children-1', loading: false },
      })
    })
    expect(next.hasAttribute('disabled')).toBe(true)

    act(() => {
      dispatch({
        type: 'SET_FIELD_LOADING',
        payload: { id: 'children-2', loading: false },
      })
    })
    expect(next.hasAttribute('disabled')).toBe(false)
    fireEvent.click(next)
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: 'INCREMENT' }),
    )
  },
)

it('re-enables both navigation directions only after the last upload finishes', async () => {
  const { setPendingUploads } = renderFooter('TEXTBOX', false, 2)
  setPendingUploads(1)
  expect(
    screen.getByRole('button', { name: 'Continue' }).hasAttribute('disabled'),
  ).toBe(true)
  expect(
    screen.getByRole('button', { name: 'Back' }).hasAttribute('disabled'),
  ).toBe(true)

  setPendingUploads(0)
  expect(
    screen.getByRole('button', { name: 'Continue' }).hasAttribute('disabled'),
  ).toBe(false)
  const back = screen.getByRole('button', { name: 'Back' })
  expect(back.hasAttribute('disabled')).toBe(false)
  fireEvent.click(back)
  await waitFor(() =>
    expect(dispatch).toHaveBeenCalledWith({ type: 'DECREMENT' }),
  )
})

it('blocks invalid number fields when validation bypass is disabled and continues after correction', async () => {
  renderFooter('NUMBERBOX', false, 0, '12', {
    allowProceedOnValidationFail: false,
  })
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  await waitFor(() =>
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_VALIDITY',
      payload: { isValid: false },
    }),
  )
  expect(mutate).not.toHaveBeenCalled()
  expect(dispatch).not.toHaveBeenCalledWith({ type: 'INCREMENT' })

  fireEvent.change(screen.getByRole('textbox', { name: 'Number' }), {
    target: { value: '123' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  await waitFor(() =>
    expect(dispatch).toHaveBeenCalledWith({ type: 'INCREMENT' }),
  )
})

it.each([
  { fieldType: 'TEXTBOX', isHidden: false },
  { fieldType: 'NUMBERBOX', isHidden: false },
  { fieldType: 'NUMBERBOX', isHidden: true },
])(
  'preserves validation bypass for $fieldType with hidden=$isHidden',
  async ({ fieldType, isHidden }) => {
    const { getState, validator } = renderFooter(fieldType, isHidden)
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: 'INCREMENT' }),
    )
    expect(validator).toHaveBeenCalled()
    expect(getState().isValid).toBe(false)
    expect(getState().currentSection.index).toBe(2)
  },
)

it('still blocks invalid number fields in the parties section when validation bypass is enabled', async () => {
  renderFooter('NUMBERBOX', false, 0, '12', {
    sectionType: SectionTypes.PARTIES,
  })

  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  await waitFor(() =>
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_VALIDITY',
      payload: { isValid: false },
    }),
  )

  expect(mutate).not.toHaveBeenCalled()
  expect(dispatch).not.toHaveBeenCalledWith({ type: 'INCREMENT' })
})

it.each([true, false])(
  'checks premises eligibility only after confirmation and proceeds when successful=%s',
  async (successful) => {
    const section = { id: 'premises', sectionType: SectionTypes.PREMISES }
    const onConfirmPremises = jest.fn().mockResolvedValue(successful)
    jest.mocked(useApplicationContext).mockReturnValue({
      state: {
        currentScreen: { data: { id: 'screen', fields: [] } },
        currentSection: { index: 0, data: section },
        sections: [section],
        application: { id: 'application' },
      },
      dispatch,
    } as unknown as ReturnType<typeof useApplicationContext>)

    const Wrapper = () => {
      const methods = useForm()
      return (
        <FormProvider {...methods}>
          <Footer
            externalDataAgreement
            isValidateEligibilityError={false}
            onConfirmPremises={onConfirmPremises}
          />
        </FormProvider>
      )
    }
    render(<Wrapper />)
    expect(onConfirmPremises).not.toHaveBeenCalled()
    expect(mutate).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    await waitFor(() => expect(onConfirmPremises).toHaveBeenCalledTimes(1))
    if (successful) {
      await waitFor(() =>
        expect(dispatch).toHaveBeenCalledWith({ type: 'INCREMENT' }),
      )
    } else {
      expect(mutate).not.toHaveBeenCalled()
      expect(dispatch).not.toHaveBeenCalledWith({ type: 'INCREMENT' })
    }
  },
)

it('still opens My pages after submission has completed', () => {
  const open = jest.spyOn(window, 'open').mockImplementation(() => null)
  const section = { id: 'completed', sectionType: SectionTypes.COMPLETED }
  jest.mocked(useApplicationContext).mockReturnValue({
    state: {
      submitted: true,
      application: { id: 'application' },
      currentSection: { index: 2, data: section },
      sections: [section],
    },
    dispatch,
  } as unknown as ReturnType<typeof useApplicationContext>)
  const Wrapper = () => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        <Footer externalDataAgreement isValidateEligibilityError={false} />
      </FormProvider>
    )
  }
  render(<Wrapper />)
  fireEvent.click(screen.getByRole('button', { name: 'My pages' }))
  expect(open).toHaveBeenCalledWith(
    '/minarsidur',
    '_blank',
    'noopener,noreferrer',
  )
  expect(dispatch).not.toHaveBeenCalled()
  open.mockRestore()
})
