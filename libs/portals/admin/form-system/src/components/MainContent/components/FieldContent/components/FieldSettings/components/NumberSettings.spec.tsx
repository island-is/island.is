import { Input } from '@island.is/island-ui/core'
import { expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import { ComponentProps, ReactNode } from 'react'
import {
  ControlContext,
  IControlContext,
} from '../../../../../../../context/ControlContext'
import { NumberSettings } from './NumberSettings'

jest.mock('@island.is/island-ui/core', () => ({
  GridColumn: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  GridRow: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Stack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ToggleSwitchCheckbox: () => null,
  Input: ({
    name,
    label,
    value,
    onChange,
    errorMessage,
    min,
  }: ComponentProps<typeof Input>) => (
    <div>
      <label>
        {label}
        <input
          name={name}
          type="number"
          min={min}
          value={value}
          onChange={onChange}
          aria-invalid={errorMessage ? true : undefined}
        />
      </label>
      {errorMessage && <span>{errorMessage}</span>}
    </div>
  ),
}))

const renderSettings = (
  minLength?: number | null,
  maxLength?: number | null,
) => {
  const controlDispatch = jest.fn()
  render(
    <ControlContext.Provider
      value={
        {
          control: {
            activeItem: { data: { fieldSettings: { minLength, maxLength } } },
            isReadOnly: false,
          },
          controlDispatch,
          setFocus: jest.fn(),
          focus: '',
          updateActiveItem: jest.fn(),
        } as unknown as IControlContext
      }
    >
      <NumberSettings />
    </ControlContext.Provider>,
  )
  return controlDispatch
}

const rangeError =
  'Lágmarksfjöldi tölustafa má ekki vera meiri en hámarksfjöldi tölustafa'
const positiveLengthError =
  'Hámarksfjöldi tölustafa verður að vera stærri en núll'

it.each([
  { minLength: 5, maxLength: 3, error: rangeError },
  { minLength: 1, maxLength: 0, error: positiveLengthError },
  { minLength: 3, maxLength: 5 },
  { minLength: 3, maxLength: 3 },
  { minLength: 0, maxLength: 0, error: positiveLengthError },
  { minLength: undefined, maxLength: 0, error: positiveLengthError },
  { minLength: 0, maxLength: -1, error: positiveLengthError },
  { minLength: 0, maxLength: 1 },
  { minLength: undefined, maxLength: 3 },
  { minLength: 5, maxLength: undefined },
  { minLength: null, maxLength: 3 },
  { minLength: 5, maxLength: null },
])(
  'validates minLength=$minLength and maxLength=$maxLength',
  ({ minLength, maxLength, error }) => {
    renderSettings(minLength, maxLength)
    const input = screen.getByRole('spinbutton', {
      name: 'Hámarksfjöldi tölustafa',
    })
    expect(input.getAttribute('min')).toBe('1')
    expect(input.getAttribute('aria-invalid')).toBe(error ? 'true' : null)
    expect(screen.queryByText(rangeError) !== null).toBe(error === rangeError)
    expect(screen.queryByText(positiveLengthError) !== null).toBe(
      error === positiveLengthError,
    )
  },
)

it.each([
  { input: '-1', value: undefined },
  { input: '', value: undefined },
  { input: '0', value: undefined },
  { input: '1', value: 1 },
  { input: '3', value: 3 },
])('stores $input as $value for maxLength', ({ input, value }) => {
  const controlDispatch = renderSettings(0, 2)
  fireEvent.change(
    screen.getByRole('spinbutton', { name: 'Hámarksfjöldi tölustafa' }),
    { target: { value: input } },
  )
  expect(controlDispatch).toHaveBeenCalledWith({
    type: 'SET_ANY_FIELD_SETTING',
    payload: { property: 'maxLength', value },
  })
})
