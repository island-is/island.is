import { Contract } from '@island.is/clients/hms-rental-agreement'
import {
  filterContractsForHousingBenefits,
  isContractValidForHousingBenefits,
} from './contracts'

const TENANT_ID = '0101302989'

const definiteContract = (
  dateFrom: string | null | undefined,
  dateTo: string | null | undefined,
): Contract => ({
  contractTypeUseCode: 'DEFINITEAGREEMENT',
  dateFrom,
  dateTo,
})

describe('isContractValidForHousingBenefits', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-05T14:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('accepts indefinite agreements without dates', () => {
    expect(
      isContractValidForHousingBenefits({
        contractTypeUseCode: 'INDEFINETEAGREEMENT',
      }),
    ).toBe(true)
  })

  it('accepts a long agreement with less than three months left', () => {
    expect(
      isContractValidForHousingBenefits(
        definiteContract('2026-01-01', '2026-12-05'),
      ),
    ).toBe(true)
  })

  it.each([
    ['exactly three months inclusive', '2026-11-01', '2027-01-31'],
    ['exactly three months inclusive, mid-month', '2026-10-15', '2027-01-14'],
    ['clamped to the end of a shorter month', '2026-11-30', '2027-02-27'],
    ['an agreement ending today', '2026-08-01', '2026-11-05'],
  ])('accepts %s (%s – %s)', (_label, dateFrom, dateTo) => {
    expect(
      isContractValidForHousingBenefits(definiteContract(dateFrom, dateTo)),
    ).toBe(true)
  })

  it.each([
    ['one day short of three months', '2026-11-01', '2027-01-30'],
    ['one day short, mid-month', '2026-10-15', '2027-01-13'],
    ['a short agreement starting in the future', '2026-12-01', '2027-01-31'],
  ])('rejects %s (%s – %s)', (_label, dateFrom, dateTo) => {
    expect(
      isContractValidForHousingBenefits(definiteContract(dateFrom, dateTo)),
    ).toBe(false)
  })

  it('rejects a long agreement that has already ended', () => {
    expect(
      isContractValidForHousingBenefits(
        definiteContract('2025-01-01', '2026-11-04'),
      ),
    ).toBe(false)
  })

  it.each([
    ['missing dateFrom', null, '2027-12-31'],
    ['missing dateTo', '2026-01-01', null],
    ['unparseable dateFrom', 'not-a-date', '2027-12-31'],
  ])('rejects a definite agreement with %s', (_label, dateFrom, dateTo) => {
    expect(
      isContractValidForHousingBenefits(definiteContract(dateFrom, dateTo)),
    ).toBe(false)
  })

  it('handles timestamps on the contract dates', () => {
    expect(
      isContractValidForHousingBenefits(
        definiteContract('2026-11-01T00:00:00', '2027-01-31T00:00:00'),
      ),
    ).toBe(true)
  })
})

describe('filterContractsForHousingBenefits', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-05T14:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const tenantParty = {
    partyTypeUseCode: 'TENANT',
    kennitala: TENANT_ID,
  } as NonNullable<Contract['contractParty']>[number]

  it('keeps long agreements with little time left and drops short ones', () => {
    const longWithOneMonthLeft: Contract = {
      ...definiteContract('2026-01-01', '2026-12-05'),
      contractId: 1,
      contractParty: [tenantParty],
    }
    const tooShort: Contract = {
      ...definiteContract('2026-11-01', '2027-01-15'),
      contractId: 2,
      contractParty: [tenantParty],
    }

    expect(
      filterContractsForHousingBenefits(
        [longWithOneMonthLeft, tooShort],
        TENANT_ID,
      ).map((c) => c.contractId),
    ).toEqual([1])
  })
})
