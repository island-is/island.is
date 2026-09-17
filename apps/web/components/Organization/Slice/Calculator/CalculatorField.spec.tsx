import { FormProvider, useForm } from 'react-hook-form'
import { render, screen } from '@testing-library/react'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '@island.is/web/graphql/schema'

import { CalculatorField } from './CalculatorField'
import type { InputContractField, InputFieldContract } from './contract'

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
      data-decimal-scale={String(props.decimalScale ?? '')}
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

const renderField = (
  contractField: InputContractField,
  contract: InputFieldContract = new Map([[contractField.key, contractField]]),
) =>
  render(
    <Form>
      <CalculatorField
        field={{ uid: 'uid-1', key: contractField.key, span: 6 }}
        contractField={contractField}
        contract={contract}
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

  /* The domain rejects a fractional or negative count with INVALID_VALUE, so
   * the control is constrained rather than left to fail server-side. */
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
    const target: InputContractField = {
      key: 'isMarried',
      type: TaxCalculatorInputFieldType.Boolean,
      required: false,
    }
    const dependent: InputContractField = {
      key: 'spouseName',
      type: TaxCalculatorInputFieldType.String,
      required: false,
      dependsOn: { fieldKey: 'isMarried', equals: true },
    }

    const { container } = renderField(
      dependent,
      new Map([
        [target.key, target],
        [dependent.key, dependent],
      ]),
    )

    expect(container.firstChild).toBeNull()
  })

  /* The target is a `number` field rendered as a select, so form state holds
   * `'2024'` where `equals` holds `2024`. Compared raw, the two never match and
   * the dependent stays hidden whatever the user picks. */
  it('matches a number dependency against the string its select holds', () => {
    const target: InputContractField = {
      key: 'incomeYear',
      type: TaxCalculatorInputFieldType.Number,
      semantic: TaxCalculatorInputFieldSemantic.Year,
      required: true,
    }
    const dependent: InputContractField = {
      key: 'retroactive',
      type: TaxCalculatorInputFieldType.String,
      required: false,
      dependsOn: { fieldKey: 'incomeYear', equals: 2024 },
    }
    const contract = new Map([
      [target.key, target],
      [dependent.key, dependent],
    ])

    const Harness = () => {
      const methods = useForm({ defaultValues: { incomeYear: '2024' } })
      return (
        <FormProvider {...methods}>
          <CalculatorField
            field={{ uid: 'uid-1', key: dependent.key, span: 6 }}
            contractField={dependent}
            contract={contract}
            label="Reitur"
            locale="is"
            disabled={false}
          />
        </FormProvider>
      )
    }

    const { container } = render(<Harness />)

    expect(control(container)).toBeTruthy()
  })
})
