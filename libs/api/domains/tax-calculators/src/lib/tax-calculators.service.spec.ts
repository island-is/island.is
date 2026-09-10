import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import {
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
} from './models/enums'
import type {
  NumberInputField,
  SelectInputField,
} from './models/inputField.model'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Instantiated directly rather than through Test.createTestingModule: building
 * a GraphQL schema here would fail on TaxCalculatorType, whose registerEnumType
 * call lives in libs/cms and never runs in this project's test context.
 * CalculatorsClientService needs no constructor arguments -- getCalculator is a
 * registry lookup, not a network call. */
const service = new TaxCalculatorsService(new CalculatorsClientService())

const inputFieldsFor = (type: TaxCalculatorType) =>
  service.getCalculator(type).inputFields

const findField = (type: TaxCalculatorType, key: string) =>
  inputFieldsFor(type).find((field) => field.key === key)

describe('TaxCalculatorsService', () => {
  describe('calculator identity mapping', () => {
    /* Guards the one hand-maintained cross-vocabulary lookup in the module:
     * a wrong entry compiles fine and returns another calculator's fields. */
    it.each(Object.values(TaxCalculatorType))(
      'publishes a non-empty input contract for %s',
      (type) => {
        const inputFields = inputFieldsFor(type)

        expect(inputFields.length).toBeGreaterThan(0)
        expect(inputFields.every((field) => field.key.length > 0)).toBe(true)
      },
    )

    it('echoes the requested type back', () => {
      expect(service.getCalculator(TaxCalculatorType.VEHICLE_TAX).type).toBe(
        TaxCalculatorType.VEHICLE_TAX,
      )
    })

    it('maps withholdingTaxOnWages to the withholding tax calculator', () => {
      const keys = inputFieldsFor(
        TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
      ).map((field) => field.key)

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
          fieldKey: 'splitCustody',
          equals: { value: true },
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
      expect(
        findField(TaxCalculatorType.CHILD_BENEFIT, key)?.dependsOn,
      ).toBeUndefined()
    })
  })

  describe('input field types', () => {
    it('publishes period as a select with structured options', () => {
      const field = findField(TaxCalculatorType.VEHICLE_TAX, 'period') as
        | SelectInputField
        | undefined

      expect(field?.type).toBe(TaxCalculatorInputFieldType.SELECT)
      expect(field?.required).toBe(true)
      expect(field?.options).toEqual([
        { value: 'firstHalf' },
        { value: 'secondHalf' },
      ])
    })

    it('publishes periodSplitDate as an optional date carrying no options', () => {
      const field = findField(TaxCalculatorType.VEHICLE_TAX, 'periodSplitDate')

      expect(field?.type).toBe(TaxCalculatorInputFieldType.DATE)
      expect(field?.required).toBe(false)
      expect(field).not.toHaveProperty('options')
    })

    it('publishes licensePlate as a string', () => {
      expect(
        findField(TaxCalculatorType.VEHICLE_TAX, 'licensePlate')?.type,
      ).toBe(TaxCalculatorInputFieldType.STRING)
    })

    it('publishes isElectric as a boolean', () => {
      expect(
        findField(TaxCalculatorType.VEHICLE_BENEFIT, 'isElectric')?.type,
      ).toBe(TaxCalculatorInputFieldType.BOOLEAN)
    })
  })

  /* The semantics have no counterpart in RSK's OpenAPI spec -- it types every
   * one of these as a plain number -- so nothing upstream would catch a field
   * being mis-annotated. This table is what does. It pins the semantics the
   * client publishes today; it deliberately does not assert that every number
   * field must carry one, since `semantic` is optional in the contract. */
  describe('number field semantics', () => {
    const { CURRENCY, PERCENTAGE, YEAR, MONTH, COUNT } =
      TaxCalculatorInputFieldSemantic

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
    ])('types %s.%s as %s', (type, key, expected) => {
      const field = findField(type, key) as NumberInputField | undefined

      expect(field?.type).toBe(TaxCalculatorInputFieldType.NUMBER)
      expect(field?.semantic).toBe(expected)
    })
  })

  /* The pension rates are picked from sets RSK's spec does not declare, so
   * nothing but this test fails if the transcribed sets drift. */
  describe('pension rate option sets', () => {
    it.each([
      ['pensionFundRatio', ['0%', '4%']],
      ['privatePensionRatio', ['0%', '1%', '2%', '3%', '4%']],
      [
        'employerPensionMatchRatio',
        ['0%', '8%', '8.5%', '10%', '10.5%', '11.5%', '12%', '13.5%'],
      ],
    ])('offers %s as a fixed set', (key, values) => {
      const field = findField(
        TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
        key,
      ) as SelectInputField | undefined

      expect(field?.type).toBe(TaxCalculatorInputFieldType.SELECT)
      expect(field?.options).toEqual(values.map((value) => ({ value })))
    })
  })
})
