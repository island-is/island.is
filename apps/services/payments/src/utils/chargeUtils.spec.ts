import { processCharges, ChargeItem } from './chargeUtils'

const createCharge = (
  chargeItemCode: string,
  quantity: number,
  price?: number,
): ChargeItem => ({
  chargeItemCode,
  quantity,
  price,
  chargeType: 'test',
})

describe('processCharges', () => {
  it('should return an empty array if input is empty or null', () => {
    expect(processCharges([])).toEqual([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(processCharges(null as any)).toEqual([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(processCharges(undefined as any)).toEqual([])
  })

  it('should handle a simple list of unique charges', () => {
    const charges: ChargeItem[] = [
      createCharge('AY1', 1),
      createCharge('AY2', 2),
    ]
    const expected: ChargeItem[] = [
      createCharge('AY1', 1),
      createCharge('AY2', 2),
    ]
    expect(processCharges(charges)).toEqual(expect.arrayContaining(expected))
    expect(processCharges(charges).length).toBe(expected.length)
  })

  it('should combine charges with the same code and default price', () => {
    const charges: ChargeItem[] = [
      createCharge('AY1', 1),
      createCharge('AY1', 2),
      createCharge('AY2', 3),
    ]
    const expected: ChargeItem[] = [
      createCharge('AY1', 3),
      createCharge('AY2', 3),
    ]
    expect(processCharges(charges)).toEqual(expect.arrayContaining(expected))
    expect(processCharges(charges).length).toBe(expected.length)
  })

  it('should not combine charges with the same code but different prices', () => {
    const charges: ChargeItem[] = [
      createCharge('AY1', 1), // Default price (undefined)
      createCharge('AY1', 2, 100),
      createCharge('AY2', 3),
    ]
    const expected: ChargeItem[] = [
      createCharge('AY1', 1),
      createCharge('AY1', 2, 100),
      createCharge('AY2', 3),
    ]
    expect(processCharges(charges)).toEqual(expect.arrayContaining(expected))
    expect(processCharges(charges).length).toBe(expected.length)
  })

  it('should handle a complex case with multiple combinations and distinct items', () => {
    const charges: ChargeItem[] = [
      createCharge('AY1', 1), // No price changes
      createCharge('AY2', 2, 50), // Custom price (50)
      createCharge('AY1', 3), // No price changes
      createCharge('AY3', 4), // Unique charge
      createCharge('AY2', 5, 50), // Custom price (50)
      createCharge('AY1', 2, 200), // Custom price (200)
      createCharge('AY1', 1), // No price changes
      createCharge('AY2', 1, 75), // Custom price (75)
    ]
    const expected: ChargeItem[] = [
      createCharge('AY1', 5), // No price changes
      createCharge('AY2', 7, 50), // Custom price (50)
      createCharge('AY3', 4), // Unique charge
      createCharge('AY1', 2, 200), // Custom price (200)
      createCharge('AY2', 1, 75), // Custom price (75)
    ]

    const result = processCharges(charges)
    // Using arrayContaining because the order of items from Map.values() is not guaranteed
    expect(result).toEqual(expect.arrayContaining(expected))
    expect(result.length).toBe(expected.length)
  })

  it('should handle charges with different charge types (derived from code)', () => {
    const charges: ChargeItem[] = [
      createCharge('AY1', 1),
      createCharge('AY1', 2),
      createCharge('AY1', 3),
      createCharge('BX1', 4), // Different charge type (BX)
      createCharge('BX1', 5), // Different charge type (BX)
    ]
    const expected: ChargeItem[] = [
      createCharge('AY1', 6),
      createCharge('BX1', 9),
    ]
    const result = processCharges(charges)
    expect(result).toEqual(expect.arrayContaining(expected))
    expect(result.length).toBe(expected.length)
  })

  it('should handle charges with same code, different prices, and different charge types', () => {
    const charges: ChargeItem[] = [
      createCharge('AY1', 1, 10),
      createCharge('AY1', 2, 20),
      createCharge('BX1', 3, 10),
      createCharge('AY1', 4, 10),
    ]
    const expected: ChargeItem[] = [
      createCharge('AY1', 5, 10),
      createCharge('AY1', 2, 20),
      createCharge('BX1', 3, 10),
    ]
    const result = processCharges(charges)
    expect(result).toEqual(expect.arrayContaining(expected))
    expect(result.length).toBe(expected.length)
  })
})
