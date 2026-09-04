import type { Logger } from '@island.is/logging'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { TaxCalculatorFieldInputType } from './models/enums'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Instantiated directly rather than through Test.createTestingModule: building
 * a GraphQL schema here would fail on TaxCalculatorType, whose registerEnumType
 * call lives in libs/cms and never runs in this project's test context. */
const logger = ({
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
} as unknown) as Logger

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

      expect(field?.inputType).toBe(TaxCalculatorFieldInputType.ENUM)
      expect(field?.options).toEqual(['firstHalf', 'secondHalf'])
      expect(field?.required).toBe(true)
    })

    it('exposes periodSplitDate as an optional date with no options', () => {
      const field = findField(TaxCalculatorType.VEHICLE_TAX, 'periodSplitDate')

      expect(field?.inputType).toBe(TaxCalculatorFieldInputType.DATE)
      expect(field?.required).toBe(false)
      expect(field?.options).toBeUndefined()
    })
  })
  /* The semantic types are the one part of the contract with no counterpart in
   * RSK's OpenAPI spec -- it types all of these as plain numbers -- so nothing
   * upstream would catch a field losing or changing its annotation.
   *
   * The sampled table below and the wholesale guard beneath it catch different
   * faults, and neither subsumes the other: the guard catches a field losing
   * its annotation entirely (regressing to NUMBER) across every field, while
   * only the table catches a *mis*-annotation -- a `currency()` swapped for a
   * `count()` -- which the guard cannot see, because the result is still an
   * annotated non-NUMBER type. */
  describe('numeric field semantics', () => {
    const {
      CURRENCY,
      PERCENTAGE,
      YEAR,
      MONTH,
      COUNT,
    } = TaxCalculatorFieldInputType

    it.each([
      [TaxCalculatorType.CHILD_BENEFIT, 'incomeYear', YEAR],
      [TaxCalculatorType.CHILD_BENEFIT, 'incomeBase', CURRENCY],
      [TaxCalculatorType.CHILD_BENEFIT, 'numberOfChildren', COUNT],
      [TaxCalculatorType.CHILD_BENEFIT, 'splitCustodyChildrenUnder7', COUNT],
      [TaxCalculatorType.VEHICLE_TAX, 'year', YEAR],
      [TaxCalculatorType.VEHICLE_BENEFIT, 'purchasePrice', CURRENCY],
      [TaxCalculatorType.VEHICLE_BENEFIT, 'purchaseYear', YEAR],
      [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES, 'salary', CURRENCY],
      [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES, 'payMonth', MONTH],
      [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES, 'vacationPay', CURRENCY],
      [
        TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
        'taxCardUtilization',
        PERCENTAGE,
      ],
    ])('types %s.%s as %s', (calculatorType, key, expected) => {
      expect(findField(calculatorType, key)?.inputType).toBe(expected)
    })

    /* NUMBER is the fallback for an unannotated numeric field. Every field
     * across the four reachable calculators is annotated today, so its
     * appearance means a schema gained a bare `z.number()`. */
    it.each(Object.values(TaxCalculatorType))(
      'leaves no unannotated numeric field in %s',
      (calculatorType) => {
        const unannotated = fieldsFor(calculatorType)
          .filter(
            (field) => field.inputType === TaxCalculatorFieldInputType.NUMBER,
          )
          .map((field) => field.key)

        expect(unannotated).toEqual([])
      },
    )
  })

  /* The three pension rates are picked from a set RSK's spec does not declare,
   * so nothing but this test fails if the transcribed set drifts. */
  describe('pension rate option sets', () => {
    it.each([
      ['pensionFundRatio', ['0%', '4%']],
      ['privatePensionRatio', ['0%', '1%', '2%', '3%', '4%']],
      [
        'employerPensionMatchRatio',
        ['0%', '8%', '8.5%', '10%', '10.5%', '11.5%', '12%', '13.5%'],
      ],
    ])('offers %s as a fixed set', (key, options) => {
      const field = findField(TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES, key)

      expect(field?.inputType).toBe(TaxCalculatorFieldInputType.ENUM)
      expect(field?.options).toEqual(options)
    })
  })
})
