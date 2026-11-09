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
  }: ComponentProps<typeof Input>) => (
    <div>
      <label>
        {label}
        <input
          name={name}
          type="number"
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

it.each([
  { minLength: 5, maxLength: 3, hasError: true },
  { minLength: 1, maxLength: 0, hasError: true },
  { minLength: 3, maxLength: 5, hasError: false },
  { minLength: 3, maxLength: 3, hasError: false },
  { minLength: 0, maxLength: 0, hasError: false },
  { minLength: undefined, maxLength: 3, hasError: false },
  { minLength: 5, maxLength: undefined, hasError: false },
  { minLength: null, maxLength: 3, hasError: false },
  { minLength: 5, maxLength: null, hasError: false },
])(
  'shows a range error=$hasError for minLength=$minLength and maxLength=$maxLength',
  ({ minLength, maxLength, hasError }) => {
    renderSettings(minLength, maxLength)
    const input = screen.getByRole('spinbutton', {
      name: 'Hámarksfjöldi tölustafa',
    })
    expect(input.getAttribute('aria-invalid')).toBe(hasError ? 'true' : null)
    expect(
      screen.queryByText(
        'Lágmarksfjöldi tölustafa má ekki vera meiri en hámarksfjöldi tölustafa',
      ) !== null,
    ).toBe(hasError)
  },
)

it.each([
  { input: '-1', value: undefined },
  { input: '', value: undefined },
  { input: '0', value: 0 },
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
