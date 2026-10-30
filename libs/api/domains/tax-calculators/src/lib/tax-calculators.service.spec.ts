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
import type { NumberInputField, SelectInputField } from './models/inputField'
import type { ArrayOutputField, NumberOutputField } from './models/outputField'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Instantiated directly because getCalculator reads a registry. */
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
    /* A wrong identity-map entry compiles but returns another calculator's fields. */
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

      expect(keys).toContain('laun')
      expect(keys).toContain('launGreidast')
    })
  })

  describe('child benefit fields', () => {
    it.each([
      'hjuskaparstada',
      'tekjuar',
      'tekjustofn',
      'fjoldiBarna',
      'fjoldiBarnaUndir7ara',
      'skiptBornYfir7ara',
      'skiptBornUndir7ara',
    ])('publishes %s unconditionally', (key) => {
      const field = findField(TaxCalculatorType.CHILD_BENEFIT, key)

      expect(field).toBeDefined()
      expect(field?.dependsOn).toBeUndefined()
    })

    it('publishes hjuskaparstada as a select over the RSK enum values', () => {
      const field = findField(
        TaxCalculatorType.CHILD_BENEFIT,
        'hjuskaparstada',
      ) as SelectInputField | undefined

      expect(field?.type).toBe(TaxCalculatorInputFieldType.SELECT)
      expect(field?.options).toEqual([
        { value: 'Gift/Í sambúð' },
        { value: 'Einstætt foreldri' },
      ])
    })
  })

  describe('input field types', () => {
    it('publishes gjaldtimabil as a select over the RSK enum values', () => {
      const field = findField(TaxCalculatorType.VEHICLE_TAX, 'gjaldtimabil') as
        | SelectInputField
        | undefined

      expect(field?.type).toBe(TaxCalculatorInputFieldType.SELECT)
      expect(field?.required).toBe(true)
      expect(field?.options).toEqual([
        { value: '1. jan - 30. júlí' },
        { value: '1. júlí - 31. des' },
      ])
    })

    it('publishes gjaldskipting as an optional date carrying no options', () => {
      const field = findField(TaxCalculatorType.VEHICLE_TAX, 'gjaldskipting')

      expect(field?.type).toBe(TaxCalculatorInputFieldType.DATE)
      expect(field?.required).toBe(false)
      expect(field).not.toHaveProperty('options')
    })

    it('publishes bilnumer as a string', () => {
      expect(findField(TaxCalculatorType.VEHICLE_TAX, 'bilnumer')?.type).toBe(
        TaxCalculatorInputFieldType.STRING,
      )
    })

    it('publishes isElectric as a boolean', () => {
      expect(
        findField(TaxCalculatorType.VEHICLE_BENEFIT, 'isElectric')?.type,
      ).toBe(TaxCalculatorInputFieldType.BOOLEAN)
    })
  })

  /* The source schema types these as plain numbers; this pins assigned semantics. */
  describe('number field semantics', () => {
    const { CURRENCY, PERCENTAGE, YEAR, MONTH, COUNT } =
      TaxCalculatorInputFieldSemantic

    it.each([
      [TaxCalculatorType.CHILD_BENEFIT, 'tekjuar', YEAR],
      [TaxCalculatorType.CHILD_BENEFIT, 'tekjustofn', CURRENCY],
      [TaxCalculatorType.CHILD_BENEFIT, 'fjoldiBarna', COUNT],
      [TaxCalculatorType.CHILD_BENEFIT, 'skiptBornUndir7ara', COUNT],
      [TaxCalculatorType.VEHICLE_TAX, 'ar', YEAR],
      [TaxCalculatorType.VEHICLE_BENEFIT, 'purchasePrice', CURRENCY],
      [TaxCalculatorType.VEHICLE_BENEFIT, 'purchaseYear', YEAR],
      [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES, 'laun', CURRENCY],
      [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES, 'launamanudur', MONTH],
      [TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES, 'orlof', CURRENCY],
      [
        TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
        'nytingSkattkorts',
        PERCENTAGE,
      ],
      [
        TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
        'lifeyrissjodurHlutfall',
        PERCENTAGE,
      ],
    ])('types %s.%s as %s', (type, key, expected) => {
      const field = findField(type, key) as NumberInputField | undefined

      expect(field?.type).toBe(TaxCalculatorInputFieldType.NUMBER)
      expect(field?.semantic).toBe(expected)
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

    /* A missing semantic must remain absent. */
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

  /* `kind` is an internal discriminator and must not enter the domain contract. */
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
    { key: 'ar', value: { numberValue: 2026 } },
    { key: 'bilnumer', value: { stringValue: 'AB123' } },
    { key: 'gjaldtimabil', value: { stringValue: '1. jan - 30. júlí' } },
  ]

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('dispatch', () => {
    /* A wrong entry compiles and runs another calculator. */
    it('routes child benefit to getChildBenefit', async () => {
      const call = jest
        .spyOn(client, 'getChildBenefit')
        .mockResolvedValue({ totalChildBenefit: 1 })

      await service.calculate({
        type: TaxCalculatorType.CHILD_BENEFIT,
        values: [
          { key: 'hjuskaparstada', value: { stringValue: 'Gift/Í sambúð' } },
          { key: 'tekjuar', value: { numberValue: 2025 } },
          { key: 'tekjustofn', value: { numberValue: 9000000 } },
          { key: 'fjoldiBarna', value: { numberValue: 2 } },
        ],
      })

      expect(call).toHaveBeenCalledWith(
        expect.objectContaining({ tekjuar: 2025, fjoldiBarna: 2 }),
      )
    })

    it('routes vehicle tax to getVehicleTax, passing the split date as a Date', async () => {
      const call = jest
        .spyOn(client, 'getVehicleTax')
        .mockResolvedValue({ totalVehicleTax: 1 })
      const gjaldskipting = new Date('2026-03-01T00:00:00.000Z')

      await service.calculate({
        type: TaxCalculatorType.VEHICLE_TAX,
        values: [
          ...vehicleTaxValues,
          { key: 'gjaldskipting', value: { dateValue: gjaldskipting } },
        ],
      })

      expect(call).toHaveBeenCalledWith(
        expect.objectContaining({
          bilnumer: 'AB123',
          gjaldtimabil: '1. jan - 30. júlí',
          gjaldskipting,
        }),
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

    /* The sole calculator type/key naming exception. */
    it('routes withholdingTaxOnWages to getWithholdingTax', async () => {
      const call = jest
        .spyOn(client, 'getWithholdingTax')
        .mockResolvedValue({ taxBrackets: [] })

      await service.calculate({
        type: TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
        values: [
          { key: 'launGreidast', value: { stringValue: 'Mánaðarlega' } },
          { key: 'hjuskaparstada', value: { stringValue: 'Einhleypingur' } },
          { key: 'tekjuar', value: { numberValue: 2026 } },
          { key: 'launamanudur', value: { numberValue: 9 } },
          { key: 'laun', value: { numberValue: 800000 } },
          { key: 'lifeyrissjodurHlutfall', value: { numberValue: 4 } },
          { key: 'sereignHlutfall', value: { numberValue: 2 } },
          { key: 'nytingSkattkorts', value: { numberValue: 100 } },
          { key: 'nytingSkattkortsMaka', value: { numberValue: 0 } },
          { key: 'uppsafnadurPersonuafslattur', value: { numberValue: 0 } },
          { key: 'orlof', value: { numberValue: 0 } },
          { key: 'stettarfelag', value: { numberValue: 0 } },
          { key: 'annad', value: { numberValue: 0 } },
          { key: 'motframlagLifeyrissjodur', value: { numberValue: 11.5 } },
          { key: 'okutaekjastyrkurUtan', value: { numberValue: 0 } },
          { key: 'idgjaldSlysatryggingSjomanna', value: { numberValue: 0 } },
        ],
      })

      expect(call).toHaveBeenCalledWith(
        expect.objectContaining({ laun: 800000, lifeyrissjodurHlutfall: 4 }),
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

    /* Upstream error detail must not enter the response. */
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

  /* An empty upstream body maps to undefined, not a throw. */
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
