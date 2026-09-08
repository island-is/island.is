import type { CalculatorField } from '../../contracts/field'
import { toChildBenefitQuery } from './childBenefit'
import type { ChildBenefitInput } from './schema'
import { childBenefitCalculator } from './schema'

const fieldsByName: Record<string, CalculatorField> = Object.fromEntries(
  childBenefitCalculator.fields.map((field) => [field.name, field]),
)

describe('childBenefit contract', () => {
  it('declares the RSK field set', () => {
    expect(Object.keys(fieldsByName).sort()).toEqual([
      'incomeBase',
      'incomeYear',
      'marriedOrCohabiting',
      'numberOfChildren',
      'numberOfChildrenUnder7',
      'splitCustody',
      'splitCustodyChildrenOver7',
      'splitCustodyChildrenUnder7',
    ])
  })

  it('declares each field as authored', () => {
    expect(fieldsByName).toMatchObject({
      marriedOrCohabiting: { type: 'boolean', required: true },
      incomeYear: { type: 'number', required: true, semantic: 'year' },
      incomeBase: { type: 'number', required: true, semantic: 'currency' },
      numberOfChildren: { type: 'number', required: true, semantic: 'count' },
      numberOfChildrenUnder7: {
        type: 'number',
        required: true,
        semantic: 'count',
      },
      splitCustody: { type: 'boolean', required: true },
      splitCustodyChildrenOver7: {
        type: 'number',
        required: false,
        semantic: 'count',
      },
      splitCustodyChildrenUnder7: {
        type: 'number',
        required: false,
        semantic: 'count',
      },
    })
  })

  it('keeps splitCustody a boolean field the dependants match on', () => {
    expect(fieldsByName['splitCustody'].type).toBe('boolean')
    expect(fieldsByName['splitCustody'].options).toBeUndefined()

    for (const name of [
      'splitCustodyChildrenOver7',
      'splitCustodyChildrenUnder7',
    ]) {
      expect(fieldsByName[name].dependsOn).toEqual({
        field: 'splitCustody',
        equals: true,
      })
      expect(typeof fieldsByName[name].dependsOn?.equals).toBe('boolean')
    }
  })
})

describe('toChildBenefitQuery', () => {
  const input: ChildBenefitInput = {
    marriedOrCohabiting: true,
    incomeYear: 2025,
    incomeBase: 9000000,
    numberOfChildren: 3,
    numberOfChildrenUnder7: 1,
    splitCustody: true,
    splitCustodyChildrenOver7: 2,
    splitCustodyChildrenUnder7: 1,
  }

  it('emits every RSK parameter and nothing else', () => {
    expect(toChildBenefitQuery(input)).toEqual({
      hjuskaparstada: true,
      tekjuar: 2025,
      tekjustofn: 9000000,
      fjoldiBarna: 3,
      fjoldiBarnaUndir7ara: 1,
      skiptBuseta: true,
      skiptBornYfir7ara: 2,
      skiptBornUndir7ara: 1,
    })
  })

  it('withholds the split-custody counts unless splitCustody is set', () => {
    const query = toChildBenefitQuery({ ...input, splitCustody: false })

    expect(query.skiptBuseta).toBe(false)
    expect(query.skiptBornYfir7ara).toBeUndefined()
    expect(query.skiptBornUndir7ara).toBeUndefined()
  })
})
