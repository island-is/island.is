import { FormSystemField, FormSystemFieldSettings } from '@island.is/api/schema'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { NumberInput } from './NumberInput'
import { hasFieldValueError } from '../../../lib/hasFieldValueError'

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({
    lang: 'is',
    formatMessage: ({ id }: { id: string }) => id,
  }),
}))

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Input: ({
    errorMessage,
    ...props
  }: {
    errorMessage?: string
    name: string
    value: number | string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
  }) => (
    <>
      <input
        aria-label="Number"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        type="number"
      />
      {errorMessage && <span role="alert">{errorMessage}</span>}
    </>
  ),
}))

const item = {
  id: 'number-input',
  name: { is: 'Number' },
  values: [],
} as unknown as FormSystemField

it.each([
  { fieldType: 'TEXTBOX', json: { text: '' }, invalid: true },
  { fieldType: 'TEXTBOX', json: { text: 'value' }, invalid: false },
  { fieldType: 'EMAIL', json: { email: 'invalid' }, invalid: true },
  { fieldType: 'EMAIL', json: { email: 'name@example.is' }, invalid: false },
  { fieldType: 'NUMBERBOX', json: { number: 123 }, invalid: false },
  { fieldType: 'CHECKBOX', json: { checkboxValue: false }, invalid: true },
  { fieldType: 'CHECKBOX', json: { checkboxValue: true }, invalid: false },
])(
  'shares application summary validation for $fieldType with $json',
  ({ fieldType, json, invalid }) => {
    const field = { ...item, fieldType, values: [{ json }] } as FormSystemField
    expect(hasFieldValueError(field)).toBe(invalid)
    expect(hasFieldValueError(field, 1)).toBe(true)
  },
)

const Wrapper = ({ children }: { children: ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

it.each<{
  value: string
  settings: FormSystemFieldSettings
  error?: string
}>([
  { value: '12', settings: { minLength: 3 }, error: 'min-number-length' },
  {
    value: '12',
    settings: { minLength: 3, maxLength: 3 },
    error: 'exact-number-length',
  },
  { value: '123', settings: { minLength: 3, maxLength: 3 } },
  { value: '1234', settings: { maxLength: 3 } },
  { value: '-123', settings: { minLength: 3, maxLength: 3 } },
  { value: '12.3', settings: { isDecimal: true, minLength: 3, maxLength: 3 } },
  {
    value: '12.34',
    settings: { isDecimal: true, maxLength: 3 },
  },
  { value: '', settings: { minLength: 3, maxLength: 3 } },
  { value: '0', settings: { minLength: 1, maxLength: 1 } },
  { value: '1234', settings: {} },
  { value: '9', settings: { minValue: 10 }, error: 'min-value' },
  { value: '101', settings: { maxValue: 100 }, error: 'max-value' },
])('validates $value with $settings', async ({ value, settings, error }) => {
  render(<NumberInput item={{ ...item, fieldSettings: settings }} />, {
    wrapper: Wrapper,
  })
  const input = screen.getByRole('spinbutton')
  fireEvent.change(input, { target: { value } })
  fireEvent.blur(input)

  await waitFor(() => {
    if (error) {
      expect(screen.getByRole('alert').textContent).toContain(error)
    } else {
      expect(screen.queryByRole('alert')).toBeNull()
    }
  })
})

it.each([
  { accepted: '123', rejected: '1234', isDecimal: false },
  { accepted: '-123', rejected: '-1234', isDecimal: false },
  { accepted: '12.3', rejected: '12.34', isDecimal: true },
  { accepted: '', rejected: '123456', isDecimal: false },
])(
  'rejects $rejected without updating the value',
  async ({ accepted, rejected, isDecimal }) => {
    const dispatch = jest.fn()
    render(
      <NumberInput
        item={{ ...item, fieldSettings: { maxLength: 3, isDecimal } }}
        dispatch={dispatch}
      />,
      { wrapper: Wrapper },
    )
    const input = screen.getByRole('spinbutton') as HTMLInputElement
    await act(async () => {
      fireEvent.change(input, { target: { value: accepted } })
    })
    dispatch.mockClear()

    fireEvent.change(input, { target: { value: rejected } })

    expect(input.value).toBe(accepted)
    expect(dispatch).not.toHaveBeenCalled()

    await act(async () => {
      fireEvent.change(input, { target: { value: '12' } })
    })
    expect(input.value).toBe('12')
    await act(async () => {
      fireEvent.change(input, { target: { value: '' } })
    })
    expect(input.value).toBe('')
  },
)

it('revalidates the entered number when preview length settings change', async () => {
  const { rerender } = render(<NumberInput item={item} />, {
    wrapper: Wrapper,
  })
  fireEvent.change(screen.getByRole('spinbutton'), {
    target: { value: '123' },
  })
  fireEvent.blur(screen.getByRole('spinbutton'))

  rerender(<NumberInput item={{ ...item, fieldSettings: { minLength: 4 } }} />)
  await waitFor(() =>
    expect(screen.getByRole('alert').textContent).toContain(
      'min-number-length',
    ),
  )

  rerender(<NumberInput item={{ ...item, fieldSettings: { maxLength: 2 } }} />)
  await waitFor(() =>
    expect(screen.getByRole('alert').textContent).toContain(
      'max-number-length',
    ),
  )

  rerender(
    <NumberInput
      item={{ ...item, fieldSettings: { minLength: 2, maxLength: 2 } }}
    />,
  )
  await waitFor(() =>
    expect(screen.getByRole('alert').textContent).toContain(
      'exact-number-length',
    ),
  )

  rerender(<NumberInput item={item} />)
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
  expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('123')
})

it('blocks preview continuation until the number satisfies the length limits', async () => {
  const onContinue = jest.fn()
  const ModalWrapper = ({ children }: { children: ReactNode }) => {
    const methods = useForm()
    return (
      <FormProvider {...methods}>
        {children}
        <button
          onClick={async () => {
            if (await methods.trigger([item.id])) onContinue()
          }}
        >
          Continue
        </button>
      </FormProvider>
    )
  }

  render(<NumberInput item={{ ...item, fieldSettings: { minLength: 3 } }} />, {
    wrapper: ModalWrapper,
  })
  fireEvent.change(screen.getByRole('spinbutton'), {
    target: { value: '12' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy())
  expect(onContinue).not.toHaveBeenCalled()

  fireEvent.change(screen.getByRole('spinbutton'), {
    target: { value: '123' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
  await waitFor(() => expect(onContinue).toHaveBeenCalledTimes(1))
})
