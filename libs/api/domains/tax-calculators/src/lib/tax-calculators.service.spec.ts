import type {
  CalculatorContract,
  CalculatorKey,
} from '@island.is/clients/rsk/calculators'
import { CalculatorsClientService } from '@island.is/clients/rsk/calculators'
import { logger } from '@island.is/logging'
import { TaxCalculatorType } from '@island.is/tax-calculators'

import { TaxCalculatorCalculationErrorCode } from './models/enums'
import type { InputFieldValue } from './models/inputFieldValue.model'
import { TaxCalculatorsService } from './tax-calculators.service'

const client = new CalculatorsClientService()
const service = new TaxCalculatorsService(client, logger)

describe('TaxCalculatorsService calculate', () => {
  const {
    CALCULATION_FAILED,
    EMPTY_RESULT,
    INVALID_VALUE,
    MISSING_REQUIRED_VALUE,
  } = TaxCalculatorCalculationErrorCode

  const contract: CalculatorContract<CalculatorKey> = {
    key: 'vehicleTax',
    inputFields: [
      { name: 'amount', type: 'number', required: true },
      {
        name: 'period',
        type: 'select',
        required: true,
        options: [{ value: 'first' }, { value: 'second' }],
      },
      { name: 'splitDate', type: 'date', required: false },
    ],
    outputFields: [
      { name: 'total', kind: 'scalar', type: 'number' },
      { name: 'label', kind: 'scalar', type: 'string' },
    ],
  }

  const values: InputFieldValue[] = [
    { key: 'amount', value: { numberValue: 100 } },
    { key: 'period', value: { stringValue: 'first' } },
  ]

  beforeEach(() => {
    jest.spyOn(client, 'getCalculator').mockReturnValue(contract)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns validation errors without calling the client', async () => {
    const call = jest.spyOn(client, 'calculate')

    const response = await service.calculate({
      type: TaxCalculatorType.VEHICLE_TAX,
      values: [],
    })

    expect(call).not.toHaveBeenCalled()
    expect(response.calculation).toBeUndefined()
    expect(response.errors.map((error) => error.code)).toEqual([
      MISSING_REQUIRED_VALUE,
      MISSING_REQUIRED_VALUE,
    ])
  })

  it('returns fields the client rejects as invalid values', async () => {
    jest.spyOn(client, 'calculate').mockResolvedValue({ rejected: ['amount'] })

    const response = await service.calculate({
      type: TaxCalculatorType.VEHICLE_TAX,
      values,
    })

    expect(response.calculation).toBeUndefined()
    expect(response.errors.map((error) => [error.code, error.key])).toEqual([
      [INVALID_VALUE, 'amount'],
    ])
  })

  describe('when RSK fails', () => {
    it('reports a calculation-level failure and logs the cause', async () => {
      jest
        .spyOn(client, 'calculate')
        .mockRejectedValue(new Error('upstream exploded'))
      const logged = jest
        .spyOn(logger, 'error')
        .mockImplementation(() => logger)

      const response = await service.calculate({
        type: TaxCalculatorType.VEHICLE_TAX,
        values,
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
        .spyOn(client, 'calculate')
        .mockRejectedValue(new Error('upstream exploded'))
      jest.spyOn(logger, 'error').mockImplementation(() => logger)

      const response = await service.calculate({
        type: TaxCalculatorType.VEHICLE_TAX,
        values,
      })

      expect(response.errors[0].message).not.toContain('upstream exploded')
    })
  })

  /* An empty upstream body maps to undefined, not a throw. */
  it('reports an empty result from RSK', async () => {
    jest.spyOn(client, 'calculate').mockResolvedValue({ output: undefined })

    const response = await service.calculate({
      type: TaxCalculatorType.VEHICLE_TAX,
      values,
    })

    expect(response.calculation).toBeUndefined()
    expect(response.errors.map((error) => error.code)).toEqual([EMPTY_RESULT])
  })
})
