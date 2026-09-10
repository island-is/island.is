import type {
  CalculatorContract,
  CalculatorField,
  CalculatorKey,
} from '@island.is/clients/rsk/calculators'

import { assertPublishableContract } from './inputContract'

const contractOf = (
  fields: CalculatorField[],
  key: CalculatorKey = 'childBenefit',
): CalculatorContract<CalculatorKey> => ({
  key,
  inputFields: fields,
  outputFields: [],
})

const assertFields = (fields: CalculatorField[]) => () =>
  assertPublishableContract('childBenefit', contractOf(fields))

describe('assertPublishableContract', () => {
  it('accepts a well-formed contract', () => {
    expect(
      assertFields([
        { name: 'splitCustody', type: 'boolean', required: true },
        {
          name: 'splitCustodyChildren',
          type: 'number',
          required: false,
          semantic: 'count',
          dependsOn: { field: 'splitCustody', equals: true },
        },
        {
          name: 'period',
          type: 'select',
          required: true,
          options: [{ value: 'firstHalf' }],
        },
      ]),
    ).not.toThrow()
  })

  it('rejects a contract for a different calculator than requested', () => {
    expect(() =>
      assertPublishableContract(
        'childBenefit',
        contractOf(
          [{ name: 'year', type: 'number', required: true }],
          'vehicleTax',
        ),
      ),
    ).toThrow(/returned the contract for vehicleTax/)
  })

  it('rejects a contract with no input fields', () => {
    expect(assertFields([])).toThrow(/publishes no input fields/)
  })

  it('rejects an empty field name', () => {
    expect(
      assertFields([{ name: '', type: 'boolean', required: true }]),
    ).toThrow(/empty name/)
  })

  it('rejects duplicate field names', () => {
    expect(
      assertFields([
        { name: 'salary', type: 'number', required: true },
        { name: 'salary', type: 'number', required: false },
      ]),
    ).toThrow(/duplicate input field names/)
  })

  it('rejects a select field with no options', () => {
    expect(
      assertFields([{ name: 'period', type: 'select', required: true }]),
    ).toThrow(/publishes no options/)
  })

  it('rejects a select field with an empty option set', () => {
    expect(
      assertFields([
        { name: 'period', type: 'select', required: true, options: [] },
      ]),
    ).toThrow(/publishes no options/)
  })

  it('rejects options on a non-select field', () => {
    expect(
      assertFields([
        {
          name: 'salary',
          type: 'number',
          required: true,
          options: [{ value: '1' }],
        },
      ]),
    ).toThrow(/must not expose options/)
  })

  it('rejects an empty option value', () => {
    expect(
      assertFields([
        {
          name: 'period',
          type: 'select',
          required: true,
          options: [{ value: '' }],
        },
      ]),
    ).toThrow(/empty option value/)
  })

  it('rejects duplicate option values', () => {
    expect(
      assertFields([
        {
          name: 'period',
          type: 'select',
          required: true,
          options: [{ value: 'firstHalf' }, { value: 'firstHalf' }],
        },
      ]),
    ).toThrow(/duplicate option values/)
  })

  it('rejects a semantic on a non-number field', () => {
    expect(
      assertFields([
        {
          name: 'licensePlate',
          type: 'string',
          required: true,
          semantic: 'currency',
        },
      ]),
    ).toThrow(/must not carry a semantic/)
  })

  it('rejects a self-referential dependency', () => {
    expect(
      assertFields([
        {
          name: 'splitCustody',
          type: 'boolean',
          required: true,
          dependsOn: { field: 'splitCustody', equals: true },
        },
      ]),
    ).toThrow(/depends on itself/)
  })

  it('rejects a dependency on an unknown field', () => {
    expect(
      assertFields([
        {
          name: 'children',
          type: 'number',
          required: false,
          dependsOn: { field: 'missing', equals: true },
        },
      ]),
    ).toThrow(/unknown field "missing"/)
  })

  it('rejects a dependency on a date field', () => {
    expect(
      assertFields([
        { name: 'splitDate', type: 'date', required: false },
        {
          name: 'children',
          type: 'number',
          required: false,
          dependsOn: { field: 'splitDate', equals: '2026-01-01' },
        },
      ]),
    ).toThrow(/which is unsupported/)
  })

  it('rejects an equality value incompatible with the referenced field', () => {
    expect(
      assertFields([
        { name: 'splitCustody', type: 'boolean', required: true },
        {
          name: 'children',
          type: 'number',
          required: false,
          dependsOn: { field: 'splitCustody', equals: 'yes' },
        },
      ]),
    ).toThrow(/incompatible string value/)
  })

  it('rejects a select equality value that is not one of its options', () => {
    expect(
      assertFields([
        {
          name: 'period',
          type: 'select',
          required: true,
          options: [{ value: 'firstHalf' }],
        },
        {
          name: 'children',
          type: 'number',
          required: false,
          dependsOn: { field: 'period', equals: 'secondHalf' },
        },
      ]),
    ).toThrow(/incompatible string value/)
  })

  it('accepts a select equality value drawn from its options', () => {
    expect(
      assertFields([
        {
          name: 'period',
          type: 'select',
          required: true,
          options: [{ value: 'firstHalf' }],
        },
        {
          name: 'children',
          type: 'number',
          required: false,
          dependsOn: { field: 'period', equals: 'firstHalf' },
        },
      ]),
    ).not.toThrow()
  })

  it('rejects a dependency cycle longer than one hop', () => {
    expect(
      assertFields([
        {
          name: 'a',
          type: 'boolean',
          required: true,
          dependsOn: { field: 'b', equals: true },
        },
        {
          name: 'b',
          type: 'boolean',
          required: true,
          dependsOn: { field: 'a', equals: true },
        },
      ]),
    ).toThrow(/dependency cycle/)
  })
})
