import { FormProvider, useForm } from 'react-hook-form'
import { render, screen } from '@testing-library/react'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '@island.is/web/graphql/schema'

import type { InputContractField } from '../contract'
import { CalculatorField } from './CalculatorField'

jest.mock('@island.is/shared/form-fields', () => ({
  InputController: (props: Record<string, unknown>) => (
    <div
      data-control="input"
      data-type={String(props.type)}
      data-currency={String(Boolean(props.currency))}
      data-suffix={String(props.suffix ?? '')}
      data-min={String(props.min ?? '')}
      data-max={String(props.max ?? '')}
      data-decimal-scale={String(props.decimalScale ?? '')}
      data-allow-negative={String(props.allowNegative ?? '')}
      data-error={String(props.error ?? '')}
    />
  ),
  SelectController: (props: {
    options?: { value: string }[]
    error?: string
  }) => (
    <div
      data-control="select"
      data-option-count={String(props.options?.length ?? 0)}
      data-first-option={props.options?.[0]?.value ?? ''}
      data-error={String(props.error ?? '')}
    />
  ),
  DatePickerController: () => <div data-control="datepicker" />,
}))

const Form = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

const renderField = (contractField: InputContractField, error?: string) =>
  render(
    <Form>
      <CalculatorField
        field={{ uid: 'uid-1', key: contractField.key, span: 6 }}
        contractField={contractField}
        label="Reitur"
        locale="is"
        disabled={false}
        error={error}
      />
    </Form>,
  )

const control = (container: HTMLElement) =>
  container.querySelector('[data-control]')

const numberField = (
  semantic?: TaxCalculatorInputFieldSemantic,
): InputContractField => ({
  key: 'amount',
  type: TaxCalculatorInputFieldType.Number,
  required: false,
  semantic,
})

describe('CalculatorField control resolution', () => {
  it('falls back to a plain number input when a number carries no semantic', () => {
    const { container } = renderField(numberField())
    const element = control(container)

    expect(element?.getAttribute('data-control')).toBe('input')
    expect(element?.getAttribute('data-type')).toBe('number')
    expect(element?.getAttribute('data-currency')).toBe('false')
  })

  it('renders a count as a whole non-negative number', () => {
    const { container } = renderField(
      numberField(TaxCalculatorInputFieldSemantic.Count),
    )
    const element = control(container)

    expect(element?.getAttribute('data-control')).toBe('input')
    expect(element?.getAttribute('data-type')).toBe('number')
    expect(element?.getAttribute('data-suffix')).toBe('')
    expect(element?.getAttribute('data-min')).toBe('0')
    expect(element?.getAttribute('data-decimal-scale')).toBe('0')
    expect(element?.getAttribute('data-allow-negative')).toBe('false')
  })

  it('renders currency with the currency flag rather than a suffix', () => {
    const { container } = renderField(
      numberField(TaxCalculatorInputFieldSemantic.Currency),
    )

    expect(control(container)?.getAttribute('data-currency')).toBe('true')
  })

  it('collects a percentage as a 0-100 figure, which the boundary must scale', () => {
    const { container } = renderField(
      numberField(TaxCalculatorInputFieldSemantic.Percentage),
    )
    const element = control(container)

    expect(element?.getAttribute('data-suffix')).toBe('%')
    expect(element?.getAttribute('data-min')).toBe('0')
    expect(element?.getAttribute('data-max')).toBe('100')
    expect(element?.getAttribute('data-allow-negative')).toBe('false')
  })

  it('renders a year as a select of years, newest first, not a free number', () => {
    const { container } = renderField(
      numberField(TaxCalculatorInputFieldSemantic.Year),
    )
    const element = control(container)

    expect(element?.getAttribute('data-control')).toBe('select')
    expect(element?.getAttribute('data-first-option')).toBe(
      String(new Date().getFullYear()),
    )
  })

  it('renders a month as a select of twelve, 1-based', () => {
    const { container } = renderField(
      numberField(TaxCalculatorInputFieldSemantic.Month),
    )
    const element = control(container)

    expect(element?.getAttribute('data-control')).toBe('select')
    expect(element?.getAttribute('data-option-count')).toBe('12')
    expect(element?.getAttribute('data-first-option')).toBe('1')
  })

  it('renders a select field from the options the calculator supplies', () => {
    const { container } = renderField({
      key: 'bracket',
      type: TaxCalculatorInputFieldType.Select,
      required: false,
      options: ['a', 'b', 'c'],
    })
    const element = control(container)

    expect(element?.getAttribute('data-control')).toBe('select')
    expect(element?.getAttribute('data-option-count')).toBe('3')
  })

  it('renders a text input for a string field', () => {
    const { container } = renderField({
      key: 'name',
      type: TaxCalculatorInputFieldType.String,
      required: false,
    })
    const element = control(container)

    expect(element?.getAttribute('data-control')).toBe('input')
    expect(element?.getAttribute('data-type')).toBe('text')
  })

  it('renders a date picker for a date field', () => {
    const { container } = renderField({
      key: 'startDate',
      type: TaxCalculatorInputFieldType.Date,
      required: false,
    })

    expect(control(container)?.getAttribute('data-control')).toBe('datepicker')
  })

  it('renders a checkbox for a boolean field, not a checkbox group', () => {
    renderField({
      key: 'isMarried',
      type: TaxCalculatorInputFieldType.Boolean,
      required: false,
    })

    expect(screen.getByRole('checkbox')).toBeTruthy()
  })

  it('forwards a domain error to an input control', () => {
    const { container } = renderField(numberField(), 'Ógilt gildi')

    expect(control(container)?.getAttribute('data-error')).toBe('Ógilt gildi')
  })

  it('forwards a domain error to a select control', () => {
    const { container } = renderField(
      numberField(TaxCalculatorInputFieldSemantic.Year),
      'Ógilt gildi',
    )

    expect(control(container)?.getAttribute('data-error')).toBe('Ógilt gildi')
  })

  it('surfaces a domain error on a checkbox', () => {
    renderField(
      {
        key: 'isMarried',
        type: TaxCalculatorInputFieldType.Boolean,
        required: false,
      },
      'Ógilt gildi',
    )

    expect(screen.getByText('Ógilt gildi')).toBeTruthy()
  })
})
