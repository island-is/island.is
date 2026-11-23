import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import type { SdfComponentData } from '../../../lib/graphql'
import { SdfRadioField } from './SdfRadioField'

type Children = { children?: React.ReactNode }

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: Children) => <div>{children}</div>,
  GridColumn: ({ children }: Children) => <div>{children}</div>,
  GridRow: ({ children }: Children) => <div>{children}</div>,
  Text: ({ children }: Children) => <h4>{children}</h4>,
  InputError: ({ errorMessage }: { errorMessage: string }) => (
    <p role="alert">{errorMessage}</p>
  ),
  RadioButton: ({
    id,
    name,
    label,
    value,
    checked,
    disabled,
    hasError,
    onChange,
  }: {
    id: string
    name: string
    label: string
    value: string
    checked: boolean
    disabled?: boolean
    hasError: boolean
    onChange: () => void
  }) => (
    <label>
      {label}
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        data-has-error={String(hasError)}
        onChange={onChange}
      />
    </label>
  ),
}))

const options = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

const renderField = (
  overrides: Partial<SdfComponentData> = {},
  props: { currentValue?: unknown; error?: string } = {},
) => {
  const handleChange = jest.fn()

  render(
    <SdfRadioField
      component={
        {
          __typename: 'SdfRadioField',
          id: 'radio1',
          label: 'Question',
          options,
          ...overrides,
        } as SdfComponentData
      }
      currentValue={props.currentValue}
      error={props.error}
      answers={{}}
      onAnswerChange={jest.fn()}
      handleChange={handleChange}
      pendingRefetchTargets={[]}
      isRefetchPending={false}
    />,
  )

  return { handleChange }
}

describe.each([['FULL'], ['HALF']])('SdfRadioField (%s width)', (width) => {
  it('renders one radio per option with an id built from the field and option', () => {
    renderField({ width })

    const radios = screen.getAllByRole('radio')
    expect(radios.map((radio) => radio.id)).toEqual(['radio1-yes', 'radio1-no'])
    expect(
      radios.every((radio) => radio.getAttribute('name') === 'radio1'),
    ).toBe(true)
  })

  it('checks the option that matches the current value', () => {
    renderField({ width }, { currentValue: 'no' })

    expect((screen.getByLabelText('Yes') as HTMLInputElement).checked).toBe(
      false,
    )
    expect((screen.getByLabelText('No') as HTMLInputElement).checked).toBe(true)
  })

  it('publishes the option value when one is chosen', () => {
    const { handleChange } = renderField({ width })

    fireEvent.click(screen.getByLabelText('No'))

    expect(handleChange).toHaveBeenCalledWith('no')
  })

  it('disables every radio when the component is disabled', () => {
    renderField({ width, disabled: true })

    expect(
      screen
        .getAllByRole('radio')
        .every((radio) => radio.hasAttribute('disabled')),
    ).toBe(true)
  })

  it('shows the error message and marks the radios as having an error', () => {
    renderField({ width }, { error: 'Pick one' })

    expect(screen.getByRole('alert').textContent).toBe('Pick one')
    expect(
      screen
        .getAllByRole('radio')
        .every((radio) => radio.getAttribute('data-has-error') === 'true'),
    ).toBe(true)
  })

  it('shows no error element when there is no error', () => {
    renderField({ width })

    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('shows the label as a heading only when it is not blank', () => {
    renderField({ width })
    expect(screen.getByRole('heading', { name: 'Question' })).toBeTruthy()
  })
})

describe('SdfRadioField label', () => {
  it('renders no heading for a blank label', () => {
    renderField({ label: '   ' })

    expect(screen.queryByRole('heading')).toBeNull()
  })
})
