import {
  ExternalData,
  Field,
  FieldTypes,
  InteractiveTableField,
  MultiField,
} from '@island.is/application/types'
import { debtsSection } from './debtsSection'

const multiField = debtsSection.children[0] as MultiField
const children = multiField.children as Field[]

const findByType = (type: FieldTypes) => children.find((c) => c.type === type)

const conditionOf = (field?: Field) => {
  const condition = field?.condition
  if (typeof condition !== 'function') {
    throw new Error(`Expected a dynamic condition on ${field?.id}`)
  }
  return condition
}

const externalDataWithDebts = {
  customerDebts: {
    data: { debts: [] },
    date: new Date(),
    status: 'success',
  },
} as unknown as ExternalData

describe('debtsSection', () => {
  it('declares every answer the screen writes', () => {
    const table = findByType(FieldTypes.INTERACTIVE_TABLE) as
      | InteractiveTableField
      | undefined

    expect(table?.id).toBe('selectedDebts')
    expect(table?.inputColumn?.id).toBe('debtsToPay')
    expect(children.map((child) => child.id)).toContain('shouldUseMockPayment')
  })

  it('hides the table and its footer until the debts have been fetched', () => {
    const table = findByType(FieldTypes.INTERACTIVE_TABLE)
    const footer = findByType(FieldTypes.STICKY_FOOTER)

    for (const field of [table, footer]) {
      const condition = conditionOf(field)

      expect(condition({}, {} as ExternalData, null)).toBe(false)
      expect(condition({}, externalDataWithDebts, null)).toBe(true)
    }
  })

  it('treats a failed fetch as nothing to show', () => {
    const failed = {
      customerDebts: { date: new Date(), status: 'failure' },
    } as unknown as ExternalData

    expect(
      conditionOf(findByType(FieldTypes.INTERACTIVE_TABLE))({}, failed, null),
    ).toBe(false)
  })

  it('keeps the loader ahead of the table so it renders in its place', () => {
    expect(children[0].id).toBe('debtsLoader')
  })
})
