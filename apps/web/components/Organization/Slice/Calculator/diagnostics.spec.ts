import type { CalculatorConfig } from '@island.is/tax-calculators'
import { calculatorConfigSchema } from '@island.is/tax-calculators'
import {
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldType,
  TaxCalculatorType,
} from '@island.is/web/graphql/schema'

import type { InputFieldContract, OutputFieldContract } from './contract'
import { toInputFieldContract, toOutputFieldContract } from './contract'
import {
  collectStaleInputKeys,
  collectUnlabelledKeys,
  collectUnplacedRequiredKeys,
  reportConfigParseIssues,
  reportContractDiagnostics,
} from './diagnostics'
import { collectOutputConfigIssues } from './outputDiagnostics'

const label = (is: string) => ({ is })

const config = (patch: Partial<CalculatorConfig> = {}): CalculatorConfig => ({
  inputSections: [],
  outputTotal: { uid: 'hero', kind: 'value', key: 'total', label: label('Samtals') },
  outputSections: [],
  ...patch,
})

const inputContract = (
  fields: { key: string; required?: boolean }[],
): InputFieldContract =>
  toInputFieldContract(
    fields.map(({ key, required = false }) => ({
      __typename: 'TaxCalculatorStringInputField' as const,
      key,
      type: TaxCalculatorInputFieldType.String,
      required,
    })),
  )

const outputContract = (): OutputFieldContract =>
  toOutputFieldContract([
    {
      __typename: 'TaxCalculatorNumberOutputField',
      key: 'total',
      type: TaxCalculatorOutputFieldType.Number,
      semantic: null,
    },
    {
      __typename: 'TaxCalculatorArrayOutputField',
      key: 'breakdown',
      type: TaxCalculatorOutputFieldType.Array,
      itemFields: [
        {
          __typename: 'TaxCalculatorStringOutputField',
          key: 'note',
          type: TaxCalculatorOutputFieldType.String,
        },
      ],
    },
  ])

describe('collectUnplacedRequiredKeys', () => {
  it('names a required field the editor placed in no section', () => {
    expect(
      collectUnplacedRequiredKeys(
        config({
          inputSections: [
            {
              key: 'main',
              fields: [
                { uid: 'u1', key: 'salary', span: 6, label: label('Laun') },
              ],
            },
          ],
        }),
        inputContract([
          { key: 'salary', required: true },
          { key: 'year', required: true },
          { key: 'optional' },
        ]),
      ),
    ).toEqual(['year'])
  })
})

describe('collectStaleInputKeys', () => {
  it('names a configured key the calculator no longer carries, once', () => {
    expect(
      collectStaleInputKeys(
        config({
          inputSections: [
            { key: 'a', fields: [{ uid: 'u1', key: 'renamedAway', span: 6 }] },
            { key: 'b', fields: [{ uid: 'u2', key: 'salary', span: 6 }] },
          ],
        }),
        inputContract([{ key: 'salary' }]),
      ),
    ).toEqual(['renamedAway'])
  })
})

describe('collectUnlabelledKeys', () => {
  const unlabelled = config({
    inputSections: [
      {
        key: 'main',
        fields: [
          { uid: 'u1', key: 'salary', span: 6, label: label('Laun') },
          { uid: 'u2', key: 'bonus', span: 6 },
        ],
      },
    ],
    outputSections: [
      {
        key: 'result',
        fields: [
          { uid: 'o1', kind: 'value', key: 'total' },
          {
            uid: 'o2',
            kind: 'value',
            key: 'breakdown',
            label: label('Sundurliðun'),
            itemFields: [{ uid: 'i1', key: 'note' }],
          },
        ],
      },
    ],
  })

  it('reports input fields, output fields and output item fields in one pass', () => {
    expect(collectUnlabelledKeys(unlabelled, 'is')).toEqual([
      'bonus',
      'total',
      'breakdown.note',
    ])
  })

  it('uses the English label when there is one, and falls back to the Icelandic', () => {
    const bilingual = config({
      inputSections: [
        {
          key: 'main',
          fields: [
            /* en-only-labelled in neither locale's sense: `localized` returns
             * `value.en || value.is` for en, and `value.is` for is. */
            {
              uid: 'u1',
              key: 'both',
              span: 6,
              label: { is: 'Laun', en: 'Wages' },
            },
            { uid: 'u2', key: 'isOnly', span: 6, label: { is: 'Laun' } },
            { uid: 'u3', key: 'none', span: 6 },
          ],
        },
      ],
    })

    expect(collectUnlabelledKeys(bilingual, 'is')).toEqual(['none'])
    expect(collectUnlabelledKeys(bilingual, 'en')).toEqual(['none'])
  })
})

describe('collectOutputConfigIssues', () => {
  it('reports stale output keys, stale item keys and itemFields on a scalar', () => {
    const issues = collectOutputConfigIssues(
      config({
        outputSections: [
          {
            key: 'result',
            fields: [
              { uid: 'o1', kind: 'value', key: 'removedOutput' },
              {
                uid: 'o2',
                kind: 'value',
                key: 'total',
                itemFields: [{ uid: 'i1', key: 'note' }],
              },
              {
                uid: 'o3',
                kind: 'value',
                key: 'breakdown',
                itemFields: [
                  { uid: 'i2', key: 'note' },
                  { uid: 'i3', key: 'removedItem' },
                ],
              },
            ],
          },
        ],
      }),
      outputContract(),
    )

    expect(issues).toEqual({
      staleFieldKeys: ['removedOutput'],
      itemFieldsOnScalarKeys: ['total'],
      staleItemFieldKeys: [
        { fieldKey: 'breakdown', itemKeys: ['removedItem'] },
      ],
    })
  })

  it('finds nothing wrong with a config that matches the contract', () => {
    expect(
      collectOutputConfigIssues(
        config({
          outputSections: [
            { key: 'result', fields: [{ uid: 'o1', kind: 'value', key: 'total' }] },
          ],
        }),
        outputContract(),
      ),
    ).toEqual({
      staleFieldKeys: [],
      itemFieldsOnScalarKeys: [],
      staleItemFieldKeys: [],
    })
  })
})

describe('warnings', () => {
  let warn: jest.SpyInstance

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    warn.mockRestore()
    jest.restoreAllMocks()
  })

  it('says nothing at all in production', () => {
    /* Assigned through `replaceProperty` rather than directly: `NODE_ENV` is
     * declared read-only, so a plain assignment is a type error even though
     * babel-jest strips it and runs. */
    jest.replaceProperty(process.env, 'NODE_ENV', 'production')

    reportContractDiagnostics({
      calculatorType: TaxCalculatorType.ChildBenefit,
      config: config({
        inputSections: [
          { key: 'main', fields: [{ uid: 'u1', key: 'renamedAway', span: 6 }] },
        ],
      }),
      inputContract: inputContract([{ key: 'salary', required: true }]),
      outputContract: outputContract(),
      locale: 'is',
    })

    expect(warn).not.toHaveBeenCalled()
  })

  it('names the calculator and the keys in development', () => {
    reportContractDiagnostics({
      calculatorType: TaxCalculatorType.ChildBenefit,
      config: config({
        inputSections: [
          { key: 'main', fields: [{ uid: 'u1', key: 'renamedAway', span: 6 }] },
        ],
      }),
      inputContract: inputContract([{ key: 'salary', required: true }]),
      outputContract: outputContract(),
      locale: 'is',
    })

    const messages = warn.mock.calls.map(([message]) => String(message))

    expect(messages.every((message) => message.includes('CHILD_BENEFIT'))).toBe(
      true,
    )
    expect(messages.some((message) => message.includes('salary'))).toBe(true)
    expect(messages.some((message) => message.includes('renamedAway'))).toBe(
      true,
    )
  })

  it('logs each zod issue with the path that failed', () => {
    const parsed = calculatorConfigSchema.safeParse({ inputSections: [] })

    if (parsed.success) throw new Error('fixture should not parse')
    reportConfigParseIssues('slice-1', parsed.error.issues)

    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0][0])).toContain('outputSections')
  })
})
