import type { CalculatorConfig } from '@island.is/tax-calculators'
import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from '@island.is/web/graphql/schema'

import type { InputContractField, InputFieldContract } from '../contract'
import { canSubmit, collectApplicableFields } from './applicability'

const field = (
  key: string,
  overrides: Partial<InputContractField> = {},
): InputContractField => ({
  key,
  type: TaxCalculatorInputFieldType.Number,
  required: false,
  ...overrides,
})

const contract = (...fields: InputContractField[]): InputFieldContract =>
  new Map(fields.map((entry) => [entry.key, entry]))

const config = (
  sections: CalculatorConfig['inputSections'],
): CalculatorConfig => ({
  inputSections: sections,
  outputTotal: {
    uid: 'hero',
    kind: 'value',
    key: 'total',
    label: { is: 'Samtals' },
  },
  outputSections: [],
})

const keys = (
  ...args: Parameters<typeof collectApplicableFields>
): string[] => [...collectApplicableFields(...args).keys()]

describe('collectApplicableFields', () => {
  it('omits a key the calculator no longer carries', () => {
    const applicable = keys(
      config([
        {
          key: 's',
          fields: [
            { uid: 'u1', key: 'salary', span: 6, label: { is: 'Laun' } },
            { uid: 'u2', key: 'renamedAway', span: 6, label: { is: 'Horfið' } },
          ],
        },
      ]),
      contract(field('salary')),
      {},
      {},
      'is',
    )

    expect(applicable).toEqual(['salary'])
  })

  it('omits an unlabelled field rather than labelling it with its key', () => {
    const applicable = keys(
      config([{ key: 's', fields: [{ uid: 'u1', key: 'salary', span: 6 }] }]),
      contract(field('salary')),
      {},
      {},
      'is',
    )

    expect(applicable).toEqual([])
  })

  it('omits a field whose dependency is unmet', () => {
    const applicable = keys(
      config([
        {
          key: 's',
          fields: [
            { uid: 'u1', key: 'isMarried', span: 6, label: { is: 'Gift' } },
            { uid: 'u2', key: 'spouseName', span: 6, label: { is: 'Maki' } },
          ],
        },
      ]),
      contract(
        field('isMarried', { type: TaxCalculatorInputFieldType.Boolean }),
        field('spouseName', {
          type: TaxCalculatorInputFieldType.String,
          dependsOn: { fieldKey: 'isMarried', equals: true },
        }),
      ),
      {},
      { isMarried: false },
      'is',
    )

    expect(applicable).toEqual(['isMarried'])
  })

  /* The target is a `number` field rendered as a select, so form state holds
   * `'2024'` where `equals` holds `2024`. Compared raw the two never match. */
  it('matches a number dependency against the string its select holds', () => {
    const applicable = keys(
      config([
        {
          key: 's',
          fields: [
            { uid: 'u1', key: 'incomeYear', span: 6, label: { is: 'Ár' } },
            {
              uid: 'u2',
              key: 'retroactive',
              span: 6,
              label: { is: 'Afturvirkt' },
            },
          ],
        },
      ]),
      contract(
        field('incomeYear', {
          semantic: TaxCalculatorInputFieldSemantic.Year,
          required: true,
        }),
        field('retroactive', {
          type: TaxCalculatorInputFieldType.String,
          dependsOn: { fieldKey: 'incomeYear', equals: 2024 },
        }),
      ),
      {},
      { incomeYear: '2024' },
      'is',
    )

    expect(applicable).toContain('retroactive')
  })

  it('omits a section whose own toggle is off', () => {
    const toggled = config([
      {
        key: 's',
        toggle: { key: 'wantsExtra', label: { is: 'Bæta við' } },
        fields: [
          { uid: 'u1', key: 'childCount', span: 6, label: { is: 'Börn' } },
        ],
      },
    ])
    const fields = contract(field('childCount'))

    expect(keys(toggled, fields, { wantsExtra: false }, {}, 'is')).toEqual([])
    expect(keys(toggled, fields, { wantsExtra: true }, {}, 'is')).toEqual([
      'childCount',
    ])
  })

  /* A `disableOnly` section stays mounted and visible, so react-hook-form still
   * holds its values -- the entry has to render while staying out of play. */
  it('keeps a shut disableOnly section renderable but excluded from calculation', () => {
    const applicable = collectApplicableFields(
      config([
        {
          key: 'gated',
          gate: { toggle: 'wantsExtra', disableOnly: true },
          fields: [{ uid: 'u1', key: 'note', span: 6, label: { is: 'Nóta' } }],
        },
      ]),
      contract(field('note', { type: TaxCalculatorInputFieldType.String })),
      { wantsExtra: false },
      {},
      'is',
    )

    expect(applicable.get('note')?.disabled).toBe(true)
  })

  it('drops a shut gated section outright without disableOnly', () => {
    const applicable = keys(
      config([
        {
          key: 'gated',
          gate: { toggle: 'wantsExtra' },
          fields: [{ uid: 'u1', key: 'note', span: 6, label: { is: 'Nóta' } }],
        },
      ]),
      contract(field('note', { type: TaxCalculatorInputFieldType.String })),
      { wantsExtra: false },
      {},
      'is',
    )

    expect(applicable).toEqual([])
  })
})

describe('canSubmit', () => {
  const required = config([
    {
      key: 's',
      fields: [{ uid: 'u1', key: 'salary', span: 6, label: { is: 'Laun' } }],
    },
  ])
  const fields = contract(field('salary', { required: true }))

  it('is false while a required applicable field is empty', () => {
    const applicable = collectApplicableFields(required, fields, {}, {}, 'is')

    expect(canSubmit(applicable, {})).toBe(false)
    expect(canSubmit(applicable, { salary: '' })).toBe(false)
  })

  /* `Number('-')` is NaN, and NumberFormat hands back the raw numeric string
   * mid-typing. Treated as present, the field would pass the gate and then be
   * dropped by the serializer -- enabled on screen, absent from the request. */
  it('is false while a required number holds an unparseable string', () => {
    const applicable = collectApplicableFields(required, fields, {}, {}, 'is')

    expect(canSubmit(applicable, { salary: '-' })).toBe(false)
  })

  it('is true once every required applicable field has a value', () => {
    const applicable = collectApplicableFields(required, fields, {}, {}, 'is')

    expect(canSubmit(applicable, { salary: '0' })).toBe(true)
  })

  /* `withholdingTax` declares no required fields at all: RSK supplies its own
   * defaults, so the gate is a no-op and submit is live immediately. */
  it('is true for a calculator whose every field is optional', () => {
    const optional = collectApplicableFields(
      required,
      contract(field('salary')),
      {},
      {},
      'is',
    )

    expect(canSubmit(optional, {})).toBe(true)
  })

  /* A required field inside a shut `disableOnly` section is not submitted, so
   * it cannot be what blocks submission either. */
  it('ignores a required field that is rendered but excluded from calculation', () => {
    const applicable = collectApplicableFields(
      config([
        {
          key: 'gated',
          gate: { toggle: 'wantsExtra', disableOnly: true },
          fields: [
            { uid: 'u1', key: 'salary', span: 6, label: { is: 'Laun' } },
          ],
        },
      ]),
      fields,
      { wantsExtra: false },
      {},
      'is',
    )

    expect(canSubmit(applicable, {})).toBe(true)
  })
})
