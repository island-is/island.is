import { FormProvider, useForm } from 'react-hook-form'
import { render, screen } from '@testing-library/react'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '@island.is/web/graphql/schema'

import { CalculatorField } from './CalculatorField'
import type { InputContractField } from './contract'

/* What is under test is the two-stage resolution table -- which control a
 * `type`/`semantic` pair picks, and with which props -- not how island-ui
 * renders that control. Asserting on the real DOM cannot tell the two number
 * controls apart: `InputController type="number"` routes through `NumberFormat`,
 * which leaves the rendered input's `type` undefined, exactly like a text one. */
jest.mock('@island.is/shared/form-fields', () => ({
  InputController: (props: Record<string, unknown>) => (
    <div
      data-control="input"
      data-type={String(props.type)}
      data-currency={String(Boolean(props.currency))}
      data-suffix={String(props.suffix ?? '')}
      data-min={String(props.min ?? '')}
      data-max={String(props.max ?? '')}
    />
  ),
  SelectController: (props: { options?: { value: string }[] }) => (
    <div
      data-control="select"
      data-option-count={String(props.options?.length ?? 0)}
      data-first-option={props.options?.[0]?.value ?? ''}
    />
  ),
  DatePickerController: () => <div data-control="datepicker" />,
}))

const Form = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

const renderField = (contractField: InputContractField) =>
  render(
    <Form>
      <CalculatorField
        field={{ uid: 'uid-1', key: contractField.key, span: 6 }}
        contractField={contractField}
        label="Reitur"
        locale="is"
        disabled={false}
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

  it('renders a count the same way as a bare number', () => {
    const { container } = renderField(
      numberField(TaxCalculatorInputFieldSemantic.Count),
    )
    const element = control(container)

    expect(element?.getAttribute('data-control')).toBe('input')
    expect(element?.getAttribute('data-type')).toBe('number')
    expect(element?.getAttribute('data-suffix')).toBe('')
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
  })

  it('renders a year as a select of years, newest first, not a free number', () => {
    const { container } = renderField(
      numberField(TaxCalculatorInputFieldSemantic.Year),
    )
    const element = control(container)

    expect(element?.getAttribute('data-control')).toBe('select')
    /* Relative to the current year -- `yearOptions` counts back from it. */
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

  it('renders nothing at all while a dependency is unmet -- not an empty column', () => {
    const { container } = renderField({
      key: 'spouseName',
      type: TaxCalculatorInputFieldType.String,
      required: false,
      dependsOn: { fieldKey: 'isMarried', equals: true },
    })

    expect(container.firstChild).toBeNull()
  })
})
