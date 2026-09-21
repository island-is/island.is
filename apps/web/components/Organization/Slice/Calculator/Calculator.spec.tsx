import type { MockedResponse } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import type { CalculatorConfig } from '@island.is/tax-calculators'
import {
  Calculator as CalculatorSlice,
  TaxCalculatorCalculationErrorCode,
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
  TaxCalculatorType,
} from '@island.is/web/graphql/schema'
import I18n from '@island.is/web/i18n/I18n'
import {
  GET_TAX_CALCULATOR,
  GET_TAX_CALCULATOR_CALCULATION,
} from '@island.is/web/screens/queries/TaxCalculators'

import Calculator from './Calculator'

/* Every inline fragment in the query conditions on a concrete object type, so
 * Apollo matches on `__typename` alone and `MockedProvider` needs no
 * `possibleTypes` -- unlike the real client, which feeds in `fragmentTypes`. */
const request = {
  query: GET_TAX_CALCULATOR,
  variables: { type: TaxCalculatorType.ChildBenefit },
}

const metadata = {
  taxCalculator: {
    type: TaxCalculatorType.ChildBenefit,
    inputFields: [
      {
        __typename: 'TaxCalculatorNumberInputField',
        key: 'salary',
        type: TaxCalculatorInputFieldType.Number,
        required: true,
        semantic: TaxCalculatorInputFieldSemantic.Currency,
        dependsOn: null,
      },
      {
        __typename: 'TaxCalculatorBooleanInputField',
        key: 'isMarried',
        type: TaxCalculatorInputFieldType.Boolean,
        required: false,
        dependsOn: null,
      },
      {
        __typename: 'TaxCalculatorStringInputField',
        key: 'spouseName',
        type: TaxCalculatorInputFieldType.String,
        required: false,
        dependsOn: {
          fieldKey: 'isMarried',
          equals: {
            __typename: 'TaxCalculatorBooleanInputDependencyValue',
            booleanValue: true,
          },
        },
      },
      {
        __typename: 'TaxCalculatorNumberInputField',
        key: 'childCount',
        type: TaxCalculatorInputFieldType.Number,
        required: false,
        semantic: TaxCalculatorInputFieldSemantic.Count,
        dependsOn: null,
      },
      {
        __typename: 'TaxCalculatorStringInputField',
        key: 'note',
        type: TaxCalculatorInputFieldType.String,
        required: false,
        dependsOn: null,
      },
    ],
    outputFields: [
      {
        __typename: 'TaxCalculatorNumberOutputField',
        key: 'total',
        type: TaxCalculatorOutputFieldType.Number,
        semantic: TaxCalculatorOutputFieldSemantic.Currency,
      },
      {
        __typename: 'TaxCalculatorNumberOutputField',
        key: 'netTotal',
        type: TaxCalculatorOutputFieldType.Number,
        semantic: TaxCalculatorOutputFieldSemantic.Currency,
      },
    ],
  },
}

const config: CalculatorConfig = {
  inputSections: [
    {
      key: 'income',
      title: { is: 'Tekjur' },
      fields: [
        { uid: 'u1', key: 'salary', span: 6, label: { is: 'Laun' } },
        /* Keyed but never labelled: omitted from the page entirely. */
        { uid: 'u2', key: 'isMarried', span: 6 },
        /* Keyed to a field the calculator no longer carries. */
        { uid: 'u3', key: 'renamedAway', span: 6, label: { is: 'Horfið' } },
      ],
    },
    {
      key: 'extra',
      title: { is: 'Annað' },
      toggle: { key: 'wantsExtra', label: { is: 'Bæta við' } },
      fields: [
        { uid: 'u4', key: 'childCount', span: 12, label: { is: 'Börn' } },
      ],
    },
  ],
  outputTotal: {
    uid: 'hero',
    kind: 'value',
    key: 'netTotal',
    label: { is: 'Heildarlaun eftir frádrátt' },
  },
  outputSections: [
    {
      key: 'result',
      title: { is: 'Niðurstaða reiknings' },
      fields: [
        { uid: 'o1', kind: 'value', key: 'total', label: { is: 'Samtals' } },
      ],
    },
  ],
}

/* The payload the form sends once `salary` is filled: only applicable fields,
 * coerced by metadata type. `isMarried` never reaches it -- the editor left it
 * unlabelled, so it is not rendered and not submitted. */
const calculationRequest = {
  query: GET_TAX_CALCULATOR_CALCULATION,
  variables: {
    input: {
      type: TaxCalculatorType.ChildBenefit,
      values: [{ key: 'salary', value: { numberValue: 500000 } }],
    },
  },
}

const calculationResult = {
  taxCalculatorCalculate: {
    calculation: {
      type: TaxCalculatorType.ChildBenefit,
      values: [
        {
          key: 'total',
          type: TaxCalculatorOutputFieldType.Number,
          numberValue: 120000,
          stringValue: null,
          booleanValue: null,
          arrayValue: null,
        },
        {
          key: 'netTotal',
          type: TaxCalculatorOutputFieldType.Number,
          numberValue: 692762,
          stringValue: null,
          booleanValue: null,
          arrayValue: null,
        },
      ],
    },
    errors: [],
  },
}

/* `InputController type="number"` routes through NumberFormat, which renders no
 * `id` on the input and no `htmlFor` on the label -- so the control cannot be
 * reached by its label text and is found through the label's container. */
const salaryInput = (): HTMLInputElement => {
  const input = screen.getByText('Laun').parentElement?.querySelector('input')
  if (!input) throw new Error('No input rendered for the salary field')
  return input
}

const fillSalary = (value = '500000') =>
  fireEvent.change(salaryInput(), { target: { value } })

/* A second input section gated on the first section's toggle. The toggle starts
 * off, so the gate is shut on first render. */
const gatedConfig = (
  gate: { disableOnly?: boolean } = {},
): CalculatorConfig => ({
  ...config,
  inputSections: [
    ...config.inputSections,
    {
      key: 'gated',
      title: { is: 'Hlið' },
      gate: { toggle: 'wantsExtra', ...gate },
      fields: [
        { uid: 'u5', key: 'note', span: 12, label: { is: 'Athugasemd' } },
      ],
    },
  ],
})

const slice = (
  configJson: CalculatorSlice['configJson'] = config,
): CalculatorSlice => ({
  id: 'slice-1',
  calculatorType: TaxCalculatorType.ChildBenefit,
  configJson,
})

const renderSlice = (
  mocks: readonly MockedResponse[],
  sliceProps: CalculatorSlice = slice(),
) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <I18n locale="is" translations={{}}>
        <Calculator slice={sliceProps} />
      </I18n>
    </MockedProvider>,
  )

describe('Calculator', () => {
  let warn: jest.SpyInstance

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => warn.mockRestore())

  it('shows a skeleton until the metadata arrives', () => {
    const { container } = renderSlice([{ request, result: { data: metadata } }])

    /* Four 64px bars -- asserted rather than just "no form yet", which would
     * also pass if the slice rendered nothing at all. */
    expect(container.querySelectorAll('[style*="64px"]').length).toBe(4)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('shows the load error when the metadata query fails', async () => {
    renderSlice([{ request, error: new Error('nope') }])

    expect(
      await screen.findByText('Ekki tókst að sækja reiknivélina'),
    ).toBeTruthy()
  })

  it('renders the input sections in the authored order', async () => {
    renderSlice([{ request, result: { data: metadata } }])

    await screen.findByText('Tekjur')

    /* `Text variant="h4"` renders a styled paragraph, not a heading element, so
     * the order is read off the document text rather than off heading roles. */
    const text = document.body.textContent ?? ''

    expect(text.indexOf('Tekjur')).toBeGreaterThanOrEqual(0)
    expect(text.indexOf('Tekjur')).toBeLessThan(text.indexOf('Bæta við'))
  })

  it('omits unlabelled and stale fields without leaving an empty column behind', async () => {
    const { container } = renderSlice([{ request, result: { data: metadata } }])

    await screen.findByText('Laun')

    /* Three fields are configured in the first section; only `salary` may
     * render, and the other two must take their columns with them. */
    /* Coupled to island-ui's generated class name, but loudly: the assertion
     * below fails rather than silently passing if the selector stops matching. */
    const row = container.querySelector('[class*="gridRow"]')

    expect(row).not.toBeNull()
    expect(row?.children.length).toBe(1)
    expect(container.querySelectorAll('input').length).toBe(2) // field + toggle
    expect(screen.getByText('Laun')).toBeTruthy()
    /* The stale key's authored label must not reach the page either. */
    expect(screen.queryByText('Horfið')).toBeNull()
  })

  it('hides a toggled section body until the toggle is on', async () => {
    renderSlice([{ request, result: { data: metadata } }])

    await screen.findByText('Laun')

    expect(screen.getByText('Bæta við')).toBeTruthy()
    expect(screen.queryByText('Annað')).toBeNull()
  })

  it('reveals a toggled section body once the toggle is switched on', async () => {
    renderSlice([{ request, result: { data: metadata } }])

    await screen.findByText('Laun')
    expect(screen.queryByText('Annað')).toBeNull()

    fireEvent.click(screen.getByRole('checkbox'))

    expect(await screen.findByText('Annað')).toBeTruthy()
    expect(screen.getByText('Börn')).toBeTruthy()
  })

  it('removes a gated section outright while its gate is shut', async () => {
    renderSlice([{ request, result: { data: metadata } }], slice(gatedConfig()))

    await screen.findByText('Laun')

    expect(screen.queryByText('Hlið')).toBeNull()
  })

  it('keeps a disableOnly gated section visible, with its controls dead', async () => {
    const { container } = renderSlice(
      [{ request, result: { data: metadata } }],
      slice(gatedConfig({ disableOnly: true })),
    )

    await screen.findByText('Laun')

    expect(screen.getByText('Hlið')).toBeTruthy()

    /* The section renders, but its own control is dead -- while the ungated
     * section's control stays live. */
    expect(screen.getByLabelText('Athugasemd').hasAttribute('disabled')).toBe(
      true,
    )
    expect(
      container.querySelectorAll('input:not([disabled])').length,
    ).toBeGreaterThan(0)
  })

  it('warns about the omissions in development, naming every key', async () => {
    renderSlice([{ request, result: { data: metadata } }])

    await screen.findByText('Laun')
    await waitFor(() => expect(warn).toHaveBeenCalled())

    const messages = warn.mock.calls.map(([message]) => String(message))

    expect(messages.some((m) => m.includes('renamedAway'))).toBe(true)
    expect(messages.some((m) => m.includes('isMarried'))).toBe(true)
  })

  it('renders nothing and logs the zod issues when the config does not parse', async () => {
    const { container } = renderSlice(
      [{ request, result: { data: metadata } }],
      slice({ inputSections: 'not an array' }),
    )

    expect(container.firstChild).toBeNull()
    await waitFor(() => expect(warn).toHaveBeenCalled())
    expect(
      warn.mock.calls.some(([message]) =>
        String(message).includes('inputSections'),
      ),
    ).toBe(true)
  })

  it('keeps submit disabled until every required applicable value is present', async () => {
    renderSlice([{ request, result: { data: metadata } }])

    await screen.findByText('Laun')

    const submit = screen.getByRole('button')
    expect(submit.hasAttribute('disabled')).toBe(true)

    fillSalary()

    await waitFor(() => expect(submit.hasAttribute('disabled')).toBe(false))
  })

  it('renders the calculation through the configured output sections', async () => {
    renderSlice([
      { request, result: { data: metadata } },
      { request: calculationRequest, result: { data: calculationResult } },
    ])

    await screen.findByText('Laun')
    fillSalary()
    fireEvent.click(await screen.findByRole('button'))

    expect(await screen.findByText('Niðurstaða reiknings')).toBeTruthy()
    expect(screen.getByText('120.000 kr.')).toBeTruthy()
  })

  it('renders the total as the result heading, above the sections', async () => {
    const { container } = renderSlice([
      { request, result: { data: metadata } },
      { request: calculationRequest, result: { data: calculationResult } },
    ])

    await screen.findByText('Laun')
    fillSalary()
    fireEvent.click(await screen.findByRole('button'))

    expect(await screen.findByText('Heildarlaun eftir frádrátt')).toBeTruthy()
    expect(screen.getByText('692.762 kr.')).toBeTruthy()

    const text = container.textContent ?? ''
    expect(text.indexOf('Heildarlaun eftir frádrátt')).toBeLessThan(
      text.indexOf('Niðurstaða reiknings'),
    )
  })

  it('keeps the result area when only the total survives', async () => {
    const onlyTotal = {
      ...calculationResult,
      taxCalculatorCalculate: {
        ...calculationResult.taxCalculatorCalculate,
        calculation: {
          ...calculationResult.taxCalculatorCalculate.calculation,
          values: calculationResult.taxCalculatorCalculate.calculation.values.filter(
            (value) => value.key === 'netTotal',
          ),
        },
      },
    }

    renderSlice([
      { request, result: { data: metadata } },
      { request: calculationRequest, result: { data: onlyTotal } },
    ])

    await screen.findByText('Laun')
    fillSalary()
    fireEvent.click(await screen.findByRole('button'))

    expect(await screen.findByText('692.762 kr.')).toBeTruthy()
    expect(screen.queryByText('Niðurstaða reiknings')).toBeNull()
  })

  /* The visible result must not drift away from the visible inputs. */
  it('drops the result as soon as an input changes', async () => {
    renderSlice([
      { request, result: { data: metadata } },
      { request: calculationRequest, result: { data: calculationResult } },
    ])

    await screen.findByText('Laun')
    fillSalary()
    fireEvent.click(await screen.findByRole('button'))
    await screen.findByText('120.000 kr.')

    fillSalary('600000')

    await waitFor(() => expect(screen.queryByText('120.000 kr.')).toBeNull())
  })

  it('attaches a field-keyed domain error to its own control', async () => {
    renderSlice([
      { request, result: { data: metadata } },
      {
        request: calculationRequest,
        result: {
          data: {
            taxCalculatorCalculate: {
              calculation: null,
              errors: [
                {
                  code: TaxCalculatorCalculationErrorCode.InvalidValue,
                  key: 'salary',
                  message: 'salary must be positive',
                },
              ],
            },
          },
        },
      },
    ])

    await screen.findByText('Laun')
    fillSalary()
    fireEvent.click(await screen.findByRole('button'))

    expect(await screen.findByText('Ógilt gildi')).toBeTruthy()
    /* On the control, not in the result area. */
    expect(screen.queryByTestId('alertMessage')).toBeNull()
    /* The form values stay visible through a failure. */
    expect(salaryInput().value).toBe('500.000 kr.')
  })

  it('shows a result-area alert when the calculation itself fails', async () => {
    renderSlice([
      { request, result: { data: metadata } },
      { request: calculationRequest, error: new Error('RSK is down') },
    ])

    await screen.findByText('Laun')
    fillSalary()
    fireEvent.click(await screen.findByRole('button'))

    expect(await screen.findByText('Ekki tókst að reikna')).toBeTruthy()
    expect(salaryInput().value).toBe('500.000 kr.')
  })

  /* The button is what prevents a double submit, and island-ui's `Button`
   * derives `disabled` from `loading`, so the in-flight state is asserted on
   * the rendered attribute rather than on a prop. */
  it('disables submit while the calculation is in flight', async () => {
    renderSlice([
      { request, result: { data: metadata } },
      {
        request: calculationRequest,
        result: { data: calculationResult },
        delay: 50,
      },
    ])

    await screen.findByText('Laun')
    fillSalary()

    const submit = await screen.findByRole('button')
    await waitFor(() => expect(submit.hasAttribute('disabled')).toBe(false))

    fireEvent.click(submit)

    await waitFor(() => expect(submit.hasAttribute('disabled')).toBe(true))
    expect(await screen.findByText('120.000 kr.')).toBeTruthy()
  })

  /* An error keyed to a field that renders but is not submitted has nowhere a
   * visitor could act on, so it belongs in the result area. */
  it('falls back to the alert for an error keyed to a field out of play', async () => {
    renderSlice(
      [
        { request, result: { data: metadata } },
        {
          request: calculationRequest,
          result: {
            data: {
              taxCalculatorCalculate: {
                calculation: null,
                errors: [
                  {
                    code: TaxCalculatorCalculationErrorCode.MissingRequiredValue,
                    key: 'note',
                    message: 'note is required',
                  },
                ],
              },
            },
          },
        },
      ],
      slice(gatedConfig({ disableOnly: true })),
    )

    await screen.findByText('Laun')
    fillSalary()
    fireEvent.click(await screen.findByRole('button'))

    /* `note` renders, disabled, inside the shut gate -- and the message is in
     * the result area rather than on that dead control. Asserted on the alert
     * itself: attached to the control, the same text would still be in the
     * document and the test would pass either way. */
    const alert = await screen.findByTestId('alertMessage')

    expect(alert.textContent).toContain('Ógilt gildi')
    expect(screen.getByLabelText('Athugasemd').hasAttribute('disabled')).toBe(
      true,
    )
  })
})
