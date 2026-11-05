import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import { logger } from '@island.is/logging'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import {
  TaxCalculatorCalculationErrorCode,
  TaxCalculatorOutputFieldType,
} from './models/enums'
import type { InputFieldValue } from './models/inputFieldValue.model'
import { TaxCalculatorsService } from './tax-calculators.service'

/* Instantiated directly because getCalculator reads a registry. */
const client = new CalculatorsClientService()
const service = new TaxCalculatorsService(client, logger)

const inputFieldsFor = (type: TaxCalculatorType) =>
  service.getCalculator(type).inputFields

const outputFieldsFor = (type: TaxCalculatorType) =>
  service.getCalculator(type).outputFields

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
  const {
    CALCULATION_FAILED,
    EMPTY_RESULT,
    INVALID_VALUE,
    MISSING_REQUIRED_VALUE,
  } = TaxCalculatorCalculationErrorCode

  const vehicleTaxValues: InputFieldValue[] = [
    { key: 'ar', value: { numberValue: 2026 } },
    { key: 'bilnumer', value: { stringValue: 'AB123' } },
    { key: 'gjaldtimabil', value: { stringValue: '1. jan - 30. júlí' } },
  ]

  beforeEach(() => {
    jest.spyOn(client, 'validateInput').mockReturnValue([])
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('dispatch', () => {
    /* A wrong entry compiles and runs another calculator. */
    it('routes child benefit to getChildBenefit', async () => {
      const call = jest.spyOn(client, 'getChildBenefit').mockResolvedValue({})

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
      const call = jest.spyOn(client, 'getVehicleTax').mockResolvedValue({})
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
      const call = jest.spyOn(client, 'getVehicleBenefit').mockResolvedValue({})

      await service.calculate({
        type: TaxCalculatorType.VEHICLE_BENEFIT,
        values: [
          { key: 'kaupar', value: { numberValue: 2024 } },
          { key: 'kaupverd', value: { numberValue: 6000000 } },
          { key: 'rafbill', value: { booleanValue: true } },
          { key: 'starfsmadurGreidirHledslu', value: { booleanValue: false } },
          {
            key: 'starfsmadurGreidirRekstrarkostnad',
            value: { booleanValue: false },
          },
        ],
      })

      expect(call).toHaveBeenCalledWith(
        expect.objectContaining({ kaupar: 2024, rafbill: true }),
      )
    })

    /* The sole calculator type/key naming exception. */
    it('routes withholdingTaxOnWages to getWithholdingTax', async () => {
      const call = jest.spyOn(client, 'getWithholdingTax').mockResolvedValue({})

      await service.calculate({
        type: TaxCalculatorType.WITHHOLDING_TAX_ON_WAGES,
        values: [
          { key: 'launGreidast', value: { stringValue: 'Mánaðarlega' } },
          { key: 'hjuskaparstada', value: { stringValue: 'Einhleypingur' } },
          { key: 'tekjuar', value: { numberValue: 2026 } },
          { key: 'launamanudur', value: { stringValue: 'sep' } },
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
    const contract = client.getCalculator('vehicleTax')
    jest.spyOn(client, 'getCalculator').mockReturnValue({
      ...contract,
      outputFields: [
        { name: 'bifreidagjoldAlls', kind: 'scalar', type: 'number' },
        { name: 'timabil', kind: 'scalar', type: 'string' },
      ],
    })
    jest
      .spyOn(client, 'getVehicleTax')
      .mockResolvedValue({ bifreidagjoldAlls: 12345, timabil: 'First half' })

    const response = await service.calculate({
      type: TaxCalculatorType.VEHICLE_TAX,
      values: vehicleTaxValues,
    })

    expect(response.errors).toEqual([])
    expect(response.calculation?.type).toBe(TaxCalculatorType.VEHICLE_TAX)
    expect(response.calculation?.values).toEqual(
      expect.arrayContaining([
        {
          key: 'bifreidagjoldAlls',
          type: TaxCalculatorOutputFieldType.NUMBER,
          numberValue: 12345,
        },
        {
          key: 'timabil',
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

  it('returns fields the client rejects as invalid values without calling it', async () => {
    jest.spyOn(client, 'validateInput').mockReturnValue(['ar'])
    const call = jest.spyOn(client, 'getVehicleTax')

    const response = await service.calculate({
      type: TaxCalculatorType.VEHICLE_TAX,
      values: vehicleTaxValues,
    })

    expect(call).not.toHaveBeenCalled()
    expect(response.calculation).toBeUndefined()
    expect(response.errors.map((error) => [error.code, error.key])).toEqual([
      [INVALID_VALUE, 'ar'],
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
