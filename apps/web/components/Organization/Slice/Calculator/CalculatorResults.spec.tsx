import { render, screen } from '@testing-library/react'

import type { CalculatorConfig } from '@island.is/tax-calculators'
import {
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

import { CalculatorResults } from './CalculatorResults'
import type { OutputFieldContract } from './contract'
import type { OutputValue } from './outputValues'

const contract: OutputFieldContract = new Map([
  [
    'total',
    {
      key: 'total',
      type: TaxCalculatorOutputFieldType.Number,
      semantic: TaxCalculatorOutputFieldSemantic.Currency,
    },
  ],
  [
    'rate',
    {
      key: 'rate',
      type: TaxCalculatorOutputFieldType.Number,
      semantic: TaxCalculatorOutputFieldSemantic.Percentage,
    },
  ],
  [
    'months',
    {
      key: 'months',
      type: TaxCalculatorOutputFieldType.Array,
      itemFields: [
        {
          key: 'month',
          type: TaxCalculatorOutputFieldType.Number,
          semantic: TaxCalculatorOutputFieldSemantic.Month,
        },
        {
          key: 'amount',
          type: TaxCalculatorOutputFieldType.Number,
          semantic: TaxCalculatorOutputFieldSemantic.Currency,
        },
      ],
    },
  ],
])

const values = (...entries: OutputValue[]) =>
  new Map(entries.map((entry) => [entry.key, entry]))

const renderResults = (
  outputSections: CalculatorConfig['outputSections'],
  lookup: Map<string, OutputValue>,
) =>
  render(
    <CalculatorResults
      config={{ inputSections: [], outputSections }}
      contract={contract}
      values={lookup}
      locale="is"
    />,
  )

describe('CalculatorResults', () => {
  it('renders scalar values in the authored order, formatted by semantic', () => {
    renderResults(
      [
        {
          key: 'result',
          title: { is: 'Niðurstaða' },
          fields: [
            { uid: 'o1', key: 'total', label: { is: 'Samtals' } },
            { uid: 'o2', key: 'rate', label: { is: 'Hlutfall' } },
          ],
        },
      ],
      values(
        {
          key: 'total',
          type: TaxCalculatorOutputFieldType.Number,
          numberValue: 120000,
        },
        {
          key: 'rate',
          type: TaxCalculatorOutputFieldType.Number,
          numberValue: 31.45,
        },
      ),
    )

    const text = document.body.textContent ?? ''

    expect(screen.getByText('120.000 kr.')).toBeTruthy()
    expect(screen.getByText('31,45%')).toBeTruthy()
    expect(text.indexOf('Samtals')).toBeLessThan(text.indexOf('Hlutfall'))
  })

  it('renders array rows using the configured item field order', () => {
    renderResults(
      [
        {
          key: 'result',
          fields: [
            {
              uid: 'o1',
              key: 'months',
              label: { is: 'Mánuðir' },
              itemFields: [
                { uid: 'i1', key: 'amount', label: { is: 'Upphæð' } },
                { uid: 'i2', key: 'month', label: { is: 'Mánuður' } },
              ],
            },
          ],
        },
      ],
      values({
        key: 'months',
        type: TaxCalculatorOutputFieldType.Array,
        arrayValue: [
          {
            values: [
              {
                key: 'month',
                type: TaxCalculatorOutputFieldType.Number,
                numberValue: 1,
              },
              {
                key: 'amount',
                type: TaxCalculatorOutputFieldType.Number,
                numberValue: 5000,
              },
            ],
          },
        ],
      }),
    )

    const text = document.body.textContent ?? ''

    expect(text.indexOf('Upphæð')).toBeLessThan(text.indexOf('Mánuður'))
    expect(screen.getByText('5.000 kr.')).toBeTruthy()
  })

  /* An empty list is a result, not a missing value: RSK ran the calculation and
   * it produced no rows. */
  it('renders an array field with no rows as its label alone', () => {
    renderResults(
      [
        {
          key: 'result',
          fields: [
            {
              uid: 'o1',
              key: 'months',
              label: { is: 'Mánuðir' },
              itemFields: [
                { uid: 'i1', key: 'amount', label: { is: 'Upphæð' } },
              ],
            },
          ],
        },
      ],
      values({
        key: 'months',
        type: TaxCalculatorOutputFieldType.Array,
        arrayValue: [],
      }),
    )

    expect(screen.getByText('Mánuðir')).toBeTruthy()
    expect(screen.queryByText('Upphæð')).toBeNull()
  })

  it('omits unlabelled and stale rows, and the section they leave empty', () => {
    const { container } = renderResults(
      [
        {
          key: 'result',
          title: { is: 'Niðurstaða' },
          fields: [
            /* Labelled, but keyed to a field the calculator no longer carries. */
            { uid: 'o1', key: 'renamedAway', label: { is: 'Horfið' } },
            /* In the contract and returned, but never labelled. */
            { uid: 'o2', key: 'total' },
          ],
        },
      ],
      values({
        key: 'total',
        type: TaxCalculatorOutputFieldType.Number,
        numberValue: 1,
      }),
    )

    expect(container.firstChild).toBeNull()
    expect(screen.queryByText('Horfið')).toBeNull()
  })

  /* A key RSK returned nothing for is absent from the response entirely. */
  it('omits a row the calculation returned no value for', () => {
    renderResults(
      [
        {
          key: 'result',
          title: { is: 'Niðurstaða' },
          fields: [
            { uid: 'o1', key: 'total', label: { is: 'Samtals' } },
            { uid: 'o2', key: 'rate', label: { is: 'Hlutfall' } },
          ],
        },
      ],
      values({
        key: 'total',
        type: TaxCalculatorOutputFieldType.Number,
        numberValue: 1,
      }),
    )

    expect(screen.getByText('Samtals')).toBeTruthy()
    expect(screen.queryByText('Hlutfall')).toBeNull()
  })

  it('renders a section authored as prose alone', () => {
    renderResults(
      [
        {
          key: 'note',
          content: { is: 'Athugið að þetta er áætlun.' },
          fields: [],
        },
      ],
      values(),
    )

    expect(screen.getByText('Athugið að þetta er áætlun.')).toBeTruthy()
  })
})
