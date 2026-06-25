import { postReiknivelUtreikningur } from '../../gen/fetch'
import {
  CustomsCalculatorClientService,
  parseRskAmount,
} from './customsCalculatorClient.service'

jest.mock('../../gen/fetch', () => ({
  getReiknivelVoruflokkar: jest.fn(),
  getReiknivelEiningar: jest.fn(),
  postReiknivelUtreikningur: jest.fn(),
}))

const postCalculation = postReiknivelUtreikningur as jest.Mock

const logger = {
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
}

const buildService = () =>
  new CustomsCalculatorClientService({} as never, logger as never)

const baseInput = {
  tariffNumber: '12345678',
  referenceDate: '2026-06-25T00:00:00Z',
  currencyCode: 'EUR',
  priceWithShipping: '1000',
  plasticPackagingKg: '',
  cardboardPackagingKg: '',
  unitCount: '',
  netWeightKg: '',
  liters: '',
  percentage: '',
  netNetWeightKg: '',
  sugar: '',
  sweetener: '',
  nedcEmission: '',
  nedcWeightedEmission: '',
  wltpEmission: '',
  wltpWeightedEmission: '',
  curbWeight: '',
  customsCode: '',
}

const mockResponse = (linur: unknown[]) => {
  postCalculation.mockResolvedValue({
    data: { Response: { LinaGjald: { LinaGjaldLinur: linur } } },
  })
}

const charge = (overrides: Record<string, unknown> = {}) => ({
  kodi: 'A',
  heiti: 'A-gjald',
  TegTexti: '%',
  TaxtiPros: '10',
  TaxtiUpph: '0',
  bruttoupphaed: '100',
  nettoupphaed: '100',
  ...overrides,
})

describe('parseRskAmount', () => {
  it.each([
    ['1234', 1234],
    ['1234.56', 1234.56],
    ['1234,56', 1234.56], // is-IS decimal comma
    ['1.234,56', 1234.56], // is-IS grouping + decimal
    ['1.234.567', 1234567], // grouping with dots only
    ['1 234,56', 1234.56], // space grouping
    ['  42 ', 42],
    ['', 0],
  ])('parses %p as %p', (input, expected) => {
    expect(parseRskAmount(input).toNumber()).toBe(expected)
  })

  it.each([null, undefined])('treats %p as zero', (input) => {
    expect(parseRskAmount(input).toNumber()).toBe(0)
  })

  it('accepts numeric input as-is', () => {
    expect(parseRskAmount(42.5).toNumber()).toBe(42.5)
  })

  it('throws on a non-numeric string', () => {
    expect(() => parseRskAmount('not-a-number')).toThrow()
  })
})

describe('CustomsCalculatorClientService.calculate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rounds once so the breakdown reconciles with the totals', async () => {
    mockResponse([
      {
        Tollverd_ISK: '1000.4',
        LinaAlagningar: [
          charge({ bruttoupphaed: '10.5' }),
          charge({ kodi: 'B', bruttoupphaed: '20.5' }),
        ],
      },
    ])

    const result = await buildService().calculate(baseInput)

    const chargeSum = result.charges.reduce((sum, c) => sum + c.amount, 0)
    expect(result.charges.map((c) => c.amount)).toEqual([11, 21])
    expect(result.additionalAmount).toBe(chargeSum)
    expect(result.startAmount).toBe(1000)
    expect(result.totalAmount).toBe(
      result.startAmount + result.additionalAmount,
    )
    expect(result.hasUnparseableCharge).toBe(false)
  })

  it('parses locale-formatted numbers from RSK', async () => {
    mockResponse([
      {
        Tollverd_ISK: '1.234,50',
        LinaAlagningar: [charge({ bruttoupphaed: '2.000,00' })],
      },
    ])

    const result = await buildService().calculate(baseInput)

    expect(result.startAmount).toBe(1235)
    expect(result.charges[0].amount).toBe(2000)
    expect(result.totalAmount).toBe(3235)
  })

  it('skips and flags an unparseable charge instead of dropping it silently', async () => {
    mockResponse([
      {
        Tollverd_ISK: '1000',
        LinaAlagningar: [
          charge({ kodi: 'OK', bruttoupphaed: '100' }),
          charge({ kodi: 'BAD', bruttoupphaed: 'abc' }),
        ],
      },
    ])

    const result = await buildService().calculate(baseInput)

    expect(result.charges).toHaveLength(1)
    expect(result.charges[0].code).toBe('OK')
    expect(result.additionalAmount).toBe(100)
    expect(result.totalAmount).toBe(1100)
    expect(result.hasUnparseableCharge).toBe(true)
    expect(logger.warn).toHaveBeenCalledTimes(1)
  })

  it('sums charges across multiple lines', async () => {
    mockResponse([
      {
        Tollverd_ISK: '500',
        LinaAlagningar: [charge({ bruttoupphaed: '50' })],
      },
      {
        Tollverd_ISK: '999',
        LinaAlagningar: [charge({ kodi: 'B', bruttoupphaed: '70' })],
      },
    ])

    const result = await buildService().calculate(baseInput)

    // startAmount is taken from the first line only.
    expect(result.startAmount).toBe(500)
    expect(result.additionalAmount).toBe(120)
    expect(result.totalAmount).toBe(620)
  })

  it('returns a non-finite percentage as undefined rather than NaN', async () => {
    mockResponse([
      {
        Tollverd_ISK: '1000',
        LinaAlagningar: [charge({ TaxtiPros: 'n/a' })],
      },
    ])

    const result = await buildService().calculate(baseInput)

    expect(result.charges[0].percentage).toBeUndefined()
  })

  it('returns zeros for an empty response', async () => {
    mockResponse([])

    const result = await buildService().calculate(baseInput)

    expect(result).toMatchObject({
      startAmount: 0,
      additionalAmount: 0,
      totalAmount: 0,
      hasUnparseableCharge: false,
      charges: [],
    })
  })

  it('ignores charges with no gross amount', async () => {
    mockResponse([
      {
        Tollverd_ISK: '1000',
        LinaAlagningar: [
          charge({ bruttoupphaed: '' }),
          charge({ kodi: 'B', bruttoupphaed: '0' }),
        ],
      },
    ])

    const result = await buildService().calculate(baseInput)

    // Empty string is skipped; "0" is a real (zero) charge that is kept.
    expect(result.charges.map((c) => c.code)).toEqual(['B'])
    expect(result.charges[0].amount).toBe(0)
  })
})
