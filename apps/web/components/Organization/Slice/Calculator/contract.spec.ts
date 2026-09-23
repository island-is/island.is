import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from '@island.is/web/graphql/schema'

import type { RawInputField, RawOutputField } from './contract'
import {
  toInputContractField,
  toInputFieldContract,
  toOutputContractField,
  toOutputFieldContract,
} from './contract'

describe('toInputContractField', () => {
  it('collapses a null semantic to undefined rather than carrying it through', () => {
    const field: RawInputField = {
      __typename: 'TaxCalculatorNumberInputField',
      key: 'salary',
      type: TaxCalculatorInputFieldType.Number,
      required: true,
      semantic: null,
    }

    const normalized = toInputContractField(field)

    expect(normalized.semantic).toBeUndefined()
    expect('semantic' in normalized).toBe(true)
  })

  it('keeps a semantic the calculator does annotate', () => {
    const field: RawInputField = {
      __typename: 'TaxCalculatorNumberInputField',
      key: 'salary',
      type: TaxCalculatorInputFieldType.Number,
      required: true,
      semantic: TaxCalculatorInputFieldSemantic.Currency,
    }

    expect(toInputContractField(field).semantic).toBe(
      TaxCalculatorInputFieldSemantic.Currency,
    )
  })

  it('collapses select options to plain strings', () => {
    const field: RawInputField = {
      __typename: 'TaxCalculatorSelectInputField',
      key: 'taxBracket',
      type: TaxCalculatorInputFieldType.Select,
      required: false,
      options: [{ value: 'a' }, { value: 'b' }],
    }

    expect(toInputContractField(field).options).toEqual(['a', 'b'])
  })

  const dependency = (
    equals: Extract<
      RawInputField,
      { __typename: 'TaxCalculatorStringInputField' }
    >['dependsOn'],
  ): RawInputField => ({
    __typename: 'TaxCalculatorStringInputField',
    key: 'spouseName',
    type: TaxCalculatorInputFieldType.String,
    required: false,
    dependsOn: equals,
  })

  it('collapses an aliased boolean dependency to one value', () => {
    expect(
      toInputContractField(
        dependency({
          fieldKey: 'isMarried',
          equals: {
            __typename: 'TaxCalculatorBooleanInputDependencyValue',
            booleanValue: true,
          },
        }),
      ).dependsOn,
    ).toEqual({ fieldKey: 'isMarried', equals: true })
  })

  it('collapses an aliased string dependency to one value', () => {
    expect(
      toInputContractField(
        dependency({
          fieldKey: 'year',
          equals: {
            __typename: 'TaxCalculatorStringInputDependencyValue',
            stringValue: '2024',
          },
        }),
      ).dependsOn,
    ).toEqual({ fieldKey: 'year', equals: '2024' })
  })

  it('collapses an aliased number dependency to one value', () => {
    expect(
      toInputContractField(
        dependency({
          fieldKey: 'year',
          equals: {
            __typename: 'TaxCalculatorNumberInputDependencyValue',
            numberValue: 2024,
          },
        }),
      ).dependsOn,
    ).toEqual({ fieldKey: 'year', equals: 2024 })
  })

  it('carries no dependency when the field is unconditional', () => {
    const field: RawInputField = {
      __typename: 'TaxCalculatorDateInputField',
      key: 'startDate',
      type: TaxCalculatorInputFieldType.Date,
      required: false,
      dependsOn: null,
    }

    expect(toInputContractField(field).dependsOn).toBeUndefined()
  })
})

describe('toOutputContractField', () => {
  it('normalizes an array field and every item field under it', () => {
    const field: RawOutputField = {
      __typename: 'TaxCalculatorArrayOutputField',
      key: 'breakdown',
      type: TaxCalculatorOutputFieldType.Array,
      itemFields: [
        {
          __typename: 'TaxCalculatorNumberOutputField',
          key: 'amount',
          type: TaxCalculatorOutputFieldType.Number,
          semantic: TaxCalculatorOutputFieldSemantic.Currency,
        },
        {
          __typename: 'TaxCalculatorStringOutputField',
          key: 'note',
          type: TaxCalculatorOutputFieldType.String,
        },
      ],
    }

    expect(toOutputContractField(field)).toEqual({
      key: 'breakdown',
      type: TaxCalculatorOutputFieldType.Array,
      itemFields: [
        {
          key: 'amount',
          type: TaxCalculatorOutputFieldType.Number,
          semantic: TaxCalculatorOutputFieldSemantic.Currency,
        },
        { key: 'note', type: TaxCalculatorOutputFieldType.String },
      ],
    })
  })

  it('leaves a scalar field without an itemFields block', () => {
    const field: RawOutputField = {
      __typename: 'TaxCalculatorBooleanOutputField',
      key: 'isEligible',
      type: TaxCalculatorOutputFieldType.Boolean,
    }

    expect(toOutputContractField(field)).toEqual({
      key: 'isEligible',
      type: TaxCalculatorOutputFieldType.Boolean,
    })
  })
})

describe('field contracts', () => {
  it('keys the map by field key, not by position', () => {
    const contract = toInputFieldContract([
      {
        __typename: 'TaxCalculatorBooleanInputField',
        key: 'isMarried',
        type: TaxCalculatorInputFieldType.Boolean,
        required: false,
      },
    ])

    expect(contract.get('isMarried')?.key).toBe('isMarried')
    expect(contract.has('renamedAway')).toBe(false)
  })

  it('keys the output map the same way', () => {
    const contract = toOutputFieldContract([
      {
        __typename: 'TaxCalculatorNumberOutputField',
        key: 'total',
        type: TaxCalculatorOutputFieldType.Number,
        semantic: null,
      },
    ])

    expect(contract.get('total')?.semantic).toBeUndefined()
  })
})
