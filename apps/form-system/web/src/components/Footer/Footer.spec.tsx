import { useLazyQuery, useMutation } from '@apollo/client'
import { SectionTypes } from '@island.is/form-system/enums'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useApplicationContext } from '../../context/ApplicationProvider'
import { Footer } from './Footer'

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
}))
jest.mock('@island.is/form-system/ui', () => ({
  FieldTypesEnum: { NUMBERBOX: 'NUMBERBOX' },
  SectionTypes: jest.requireActual('@island.is/form-system/enums').SectionTypes,
  m: {
    continue: 'Continue',
    back: 'Back',
    externalDataConfirmation: 'Confirm',
  },
}))
jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ formatMessage: (message: string) => message }),
}))
jest.mock('../../utils/payment', () => ({
  getPaymentFlow: () => ({ shouldShowPay: false, onSubmit: false }),
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

beforeEach(() => {
  jest.clearAllMocks()
  mutate.mockResolvedValue({})
  jest
    .mocked(useMutation)
    .mockReturnValue([mutate, { loading: false }] as never)
  jest
    .mocked(useLazyQuery)
    .mockReturnValue([mutate, { loading: false }] as never)
})

const renderFooter = (fieldType = 'NUMBERBOX', isHidden = false) => {
  const section = { id: 'section', sectionType: SectionTypes.INPUT }
  jest.mocked(useApplicationContext).mockReturnValue({
    state: {
      currentScreen: {
        data: { id: 'screen', fields: [{ id: 'number', fieldType, isHidden }] },
      },
      currentSection: { index: 1, data: section },
      sections: [section],
      application: { id: 'application', allowProceedOnValidationFail: true },
    },
    dispatch,
  } as unknown as ReturnType<typeof useApplicationContext>)

  const Wrapper = () => {
    const methods = useForm({ defaultValues: { number: ['12'] } })
    return (
      <FormProvider {...methods}>
        <Controller
          name="number.0"
          control={methods.control}
          rules={{
            validate: (value) => value.length === 3 || 'Invalid length',
          }}
          render={({ field }) => <input aria-label="Number" {...field} />}
        />
        <Footer externalDataAgreement isValidateEligibilityError={false} />
      </FormProvider>
    )
  }
  render(<Wrapper />)
}

it('blocks invalid number fields despite validation bypass and continues after correction', async () => {
  renderFooter()
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
  { fieldType: 'NUMBERBOX', isHidden: true },
])(
  'preserves validation bypass for $fieldType with hidden=$isHidden',
  async ({ fieldType, isHidden }) => {
    renderFooter(fieldType, isHidden)
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({ type: 'INCREMENT' }),
    )
  },
)

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
