import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import { logger } from '@island.is/logging'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import {
  TaxCalculatorCalculationErrorCode,
  TaxCalculatorInputFieldSemantic,
  TaxCalculatorInputFieldType,
  TaxCalculatorOutputFieldSemantic,
  TaxCalculatorOutputFieldType,
} from './models/enums'
import type { InputFieldValue } from './models/inputFieldValue.model'
import type {
  NumberInputField,
  SelectInputField,
} from './models/inputField.model'
import type {
  ArrayOutputField,
  NumberOutputField,
} from './models/outputField.model'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Instantiated directly rather than through Test.createTestingModule: building
 * a GraphQL schema here would fail on TaxCalculatorType, whose registerEnumType
 * call lives in libs/cms and never runs in this project's test context.
 * CalculatorsClientService needs no constructor arguments -- getCalculator is a
 * registry lookup, not a network call. */
const client = new CalculatorsClientService()
const service = new TaxCalculatorsService(client, logger)

const inputFieldsFor = (type: TaxCalculatorType) =>
  service.getCalculator(type).inputFields

const findField = (type: TaxCalculatorType, key: string) =>
  inputFieldsFor(type).find((field) => field.key === key)

const outputFieldsFor = (type: TaxCalculatorType) =>
  service.getCalculator(type).outputFields

const findOutputField = (type: TaxCalculatorType, key: string) =>
  outputFieldsFor(type).find((field) => field.key === key)

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

describe('TaxCalculatorsService output contract', () => {
  it.each(Object.values(TaxCalculatorType))(
    'publishes a non-empty output contract for %s',
    (type) => {
      const outputFields = outputFieldsFor(type)

      expect(outputFields.length).toBeGreaterThan(0)
      expect(outputFields.every((field) => field.key.length > 0)).toBe(true)
    },
  )

  describe('withholdingTaxOnWages tax brackets', () => {
    const taxBrackets = () =>
      findOutputField(
        TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
        'taxBrackets',
      ) as ArrayOutputField | undefined

    it('exposes taxBrackets as an array output', () => {
      expect(taxBrackets()?.type).toBe(TaxCalculatorOutputFieldType.ARRAY)
    })

    it('describes one bracket row through itemFields', () => {
      const keys = taxBrackets()?.itemFields.map((field) => field.key)

      expect(keys).toEqual(
        expect.arrayContaining([
          'lowerBound',
          'bracketNumber',
          'withholdingRate',
          'calculatedWithholding',
        ]),
      )
    })
  })

  describe('scalar output conditioning', () => {
    it('exposes vehicleTax as a currency number', () => {
      const field = findOutputField(
        TaxCalculatorType.VEHICLE_TAX,
        'vehicleTax',
      ) as NumberOutputField | undefined

      expect(field?.type).toBe(TaxCalculatorOutputFieldType.NUMBER)
      expect(field?.semantic).toBe(TaxCalculatorOutputFieldSemantic.CURRENCY)
    })

    it('exposes periodLabel as a string', () => {
      expect(
        findOutputField(TaxCalculatorType.VEHICLE_TAX, 'periodLabel')?.type,
      ).toBe(TaxCalculatorOutputFieldType.STRING)
    })

    /* A number without a semantic is the common case, and must stay absent
     * rather than defaulting to something formattable. */
    it('leaves vehicleWeight a number with no semantic', () => {
      const field = findOutputField(
        TaxCalculatorType.VEHICLE_TAX,
        'vehicleWeight',
      ) as NumberOutputField | undefined

      expect(field?.type).toBe(TaxCalculatorOutputFieldType.NUMBER)
      expect(field?.semantic).toBeUndefined()
    })

    it('exposes monthlyBenefit as a currency number', () => {
      const field = findOutputField(
        TaxCalculatorType.VEHICLE_BENEFIT,
        'monthlyBenefit',
      ) as NumberOutputField | undefined

      expect(field?.semantic).toBe(TaxCalculatorOutputFieldSemantic.CURRENCY)
    })

    it('exposes splitCustody as a boolean', () => {
      expect(
        findOutputField(TaxCalculatorType.CHILD_BENEFIT, 'splitCustody')?.type,
      ).toBe(TaxCalculatorOutputFieldType.BOOLEAN)
    })
  })

  /* The client exposes `kind` to discriminate scalar from array; the public
   * contract uses __typename and `type` instead, so `kind` must not leak. */
  it('leaks no client kind onto any output field', () => {
    Object.values(TaxCalculatorType).forEach((type) => {
      outputFieldsFor(type).forEach((field) => {
        expect(field).not.toHaveProperty('kind')
        expect(field).not.toHaveProperty('name')
      })
    })
  })
})

describe('TaxCalculatorsService calculate', () => {
  const { CALCULATION_FAILED, EMPTY_RESULT, MISSING_REQUIRED_VALUE } =
    TaxCalculatorCalculationErrorCode

  const vehicleTaxValues: InputFieldValue[] = [
    { key: 'year', value: { numberValue: 2026 } },
    { key: 'licensePlate', value: { stringValue: 'AB123' } },
    { key: 'period', value: { stringValue: 'firstHalf' } },
  ]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('dispatch', () => {
    /* A wrong entry in the identity map compiles fine and would quietly run
     * another calculator, so each reachable type is pinned to its method. */
    it('routes child benefit to getChildBenefit', async () => {
      const call = jest
        .spyOn(client, 'getChildBenefit')
        .mockResolvedValue({ totalChildBenefit: 1 })

      await service.calculate({
        type: TaxCalculatorType.CHILD_BENEFIT,
        values: [
          { key: 'marriedOrCohabiting', value: { booleanValue: true } },
          { key: 'incomeYear', value: { numberValue: 2026 } },
          { key: 'incomeBase', value: { numberValue: 9000000 } },
          { key: 'numberOfChildren', value: { numberValue: 2 } },
          { key: 'numberOfChildrenUnder7', value: { numberValue: 1 } },
          { key: 'splitCustody', value: { booleanValue: false } },
        ],
      })

      expect(call).toHaveBeenCalledWith(
        expect.objectContaining({ incomeYear: 2026, numberOfChildren: 2 }),
      )
    })

    it('routes vehicle tax to getVehicleTax', async () => {
      const call = jest
        .spyOn(client, 'getVehicleTax')
        .mockResolvedValue({ totalVehicleTax: 1 })

      await service.calculate({
        type: TaxCalculatorType.VEHICLE_TAX,
        values: vehicleTaxValues,
      })

      expect(call).toHaveBeenCalledWith(
        expect.objectContaining({ licensePlate: 'AB123', period: 'firstHalf' }),
      )
    })

    it('routes vehicle benefit to getVehicleBenefit', async () => {
      const call = jest
        .spyOn(client, 'getVehicleBenefit')
        .mockResolvedValue({ monthlyBenefit: 1 })

      await service.calculate({
        type: TaxCalculatorType.VEHICLE_BENEFIT,
        values: [
          { key: 'purchaseYear', value: { numberValue: 2024 } },
          { key: 'purchasePrice', value: { numberValue: 6000000 } },
        ],
      })

      expect(call).toHaveBeenCalledWith(
        expect.objectContaining({ purchaseYear: 2024 }),
      )
    })

    /* The one name that differs between the two vocabularies. */
    it('routes withholdingTaxOnWages to getWithholdingTax', async () => {
      const call = jest
        .spyOn(client, 'getWithholdingTax')
        .mockResolvedValue({ taxBrackets: [] })

      await service.calculate({
        type: TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
        values: [{ key: 'salary', value: { numberValue: 800000 } }],
      })

      expect(call).toHaveBeenCalledWith(
        expect.objectContaining({ salary: 800000 }),
      )
    })
  })

  it('maps a successful result into keyed output values', async () => {
    jest
      .spyOn(client, 'getVehicleTax')
      .mockResolvedValue({ totalVehicleTax: 12345, periodLabel: 'First half' })

    const response = await service.calculate({
      type: TaxCalculatorType.VEHICLE_TAX,
      values: vehicleTaxValues,
    })

    expect(response.errors).toEqual([])
    expect(response.calculation?.type).toBe(TaxCalculatorType.VEHICLE_TAX)
    expect(response.calculation?.values).toEqual(
      expect.arrayContaining([
        {
          key: 'totalVehicleTax',
          type: TaxCalculatorOutputFieldType.NUMBER,
          numberValue: 12345,
        },
        {
          key: 'periodLabel',
          type: TaxCalculatorOutputFieldType.STRING,
          stringValue: 'First half',
        },
      ]),
    )
  })

  it('returns validation errors without calling the client', async () => {
    const call = jest.spyOn(client, 'getVehicleTax')

    const response = await service.calculate({
      type: TaxCalculatorType.VEHICLE_TAX,
      values: [],
    })

    expect(call).not.toHaveBeenCalled()
    expect(response.calculation).toBeUndefined()
    expect(response.errors.map((error) => error.code)).toEqual([
      MISSING_REQUIRED_VALUE,
      MISSING_REQUIRED_VALUE,
      MISSING_REQUIRED_VALUE,
    ])
  })

  describe('when RSK fails', () => {
    it('reports a calculation-level failure and logs the cause', async () => {
      jest
        .spyOn(client, 'getVehicleTax')
        .mockRejectedValue(new Error('upstream exploded'))
      const logged = jest
        .spyOn(logger, 'error')
        .mockImplementation(() => logger)

      const response = await service.calculate({
        type: TaxCalculatorType.VEHICLE_TAX,
        values: vehicleTaxValues,
      })

      expect(response.calculation).toBeUndefined()
      expect(response.errors).toHaveLength(1)
      expect(response.errors[0].code).toBe(CALCULATION_FAILED)
      expect(response.errors[0].key).toBeUndefined()
      expect(logged).toHaveBeenCalled()
    })

    /* An unauthenticated consumer must not learn what went wrong upstream. */
    it('leaks no upstream detail into the message', async () => {
      jest
        .spyOn(client, 'getVehicleTax')
        .mockRejectedValue(new Error('upstream exploded'))
      jest.spyOn(logger, 'error').mockImplementation(() => logger)

      const response = await service.calculate({
        type: TaxCalculatorType.VEHICLE_TAX,
        values: vehicleTaxValues,
      })

      expect(response.errors[0].message).not.toContain('upstream exploded')
    })
  })

  /* Every client method returns `data && toXOutput(data)`, so an empty body
   * reaches the domain as undefined rather than as a throw. */
  it('reports an empty result from RSK', async () => {
    jest.spyOn(client, 'getVehicleTax').mockResolvedValue(undefined)

    const response = await service.calculate({
      type: TaxCalculatorType.VEHICLE_TAX,
      values: vehicleTaxValues,
    })

    expect(response.calculation).toBeUndefined()
    expect(response.errors.map((error) => error.code)).toEqual([EMPTY_RESULT])
  })
})
