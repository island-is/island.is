import type { MockedResponse } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import type { CalculatorConfig } from '@island.is/tax-calculators'
import {
  Calculator as CalculatorSlice,
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldType,
  TaxCalculatorType,
} from '@island.is/web/graphql/schema'
import I18n from '@island.is/web/i18n/I18n'
import { GET_TAX_CALCULATOR } from '@island.is/web/screens/queries/TaxCalculators'

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
        semantic: null,
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
  outputSections: [],
}

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
})
