import type { Logger } from '@island.is/logging'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { TaxCalculatorFieldDataType } from './models/enums'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Instantiated directly rather than through Test.createTestingModule: building
 * a GraphQL schema here would fail on TaxCalculatorType, whose registerEnumType
 * call lives in libs/cms and never runs in this project's test context. */
const logger = {
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
} as unknown as Logger

const service = new TaxCalculatorsService(logger)

const fieldsFor = (calculatorType: TaxCalculatorType) =>
  service.getFields(calculatorType)

const findField = (calculatorType: TaxCalculatorType, key: string) =>
  fieldsFor(calculatorType).find((field) => field.key === key)

describe('TaxCalculatorsService', () => {
  describe('calculator type mapping', () => {
    /* Guards the one hand-maintained cross-vocabulary lookup in the module:
     * a wrong entry compiles fine and returns another calculator's fields. */
    it.each(Object.values(TaxCalculatorType))(
      'returns a non-empty field list for %s',
      (calculatorType) => {
        const fields = fieldsFor(calculatorType)

        expect(fields.length).toBeGreaterThan(0)
        expect(fields.every((field) => field.key.length > 0)).toBe(true)
      },
    )

    it('maps withholdingTaxOnWages to the withholding tax calculator', () => {
      const keys = fieldsFor(TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES).map(
        (field) => field.key,
      )

      expect(keys).toContain('salary')
      expect(keys).toContain('paymentFrequency')
    })
  })

  describe('child benefit conditional fields', () => {
    it.each(['splitCustodyChildrenOver7', 'splitCustodyChildrenUnder7'])(
      'gates %s on splitCustody being true',
      (key) => {
        const field = findField(TaxCalculatorType.CHILD_BENEFIT, key)

        expect(field).toBeDefined()
        expect(field?.required).toBe(false)
        expect(field?.dependsOn).toEqual({
          field: 'splitCustody',
          equals: true,
        })
      },
    )

    it.each([
      'splitCustody',
      'marriedOrCohabiting',
      'incomeYear',
      'incomeBase',
      'numberOfChildren',
      'numberOfChildrenUnder7',
    ])('leaves %s unconditional', (key) => {
      const field = findField(TaxCalculatorType.CHILD_BENEFIT, key)

      expect(field).toBeDefined()
      expect(field?.dependsOn).toBeUndefined()
    })
  })

  describe('vehicle tax field kinds', () => {
    it('exposes period as an enum with its permitted values', () => {
      const field = findField(TaxCalculatorType.VEHICLE_TAX, 'period')

      expect(field?.dataType).toBe(TaxCalculatorFieldDataType.ENUM)
      expect(field?.options).toEqual(['firstHalf', 'secondHalf'])
      expect(field?.required).toBe(true)
    })

    it('exposes periodSplitDate as an optional date with no options', () => {
      const field = findField(TaxCalculatorType.VEHICLE_TAX, 'periodSplitDate')

      expect(field?.dataType).toBe(TaxCalculatorFieldDataType.DATE)
      expect(field?.required).toBe(false)
      expect(field?.options).toBeUndefined()
    })
  })
})
