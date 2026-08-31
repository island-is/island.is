import { canDefendantAppealVerdict, ServiceRequirement } from './verdict'

describe('canDefendantAppealVerdict', () => {
  it('should not allow an appeal when there is no verdict', () => {
    expect(canDefendantAppealVerdict()).toBe(false)
    expect(canDefendantAppealVerdict(null)).toBe(false)
  })

  it('should not allow an appeal of a default judgement', () => {
    expect(
      canDefendantAppealVerdict({
        isDefaultJudgement: true,
        serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
      }),
    ).toBe(false)
  })

  it('should allow an appeal when the defendant was present in court', () => {
    expect(
      canDefendantAppealVerdict({
        serviceRequirement: ServiceRequirement.NOT_APPLICABLE,
      }),
    ).toBe(true)
  })

  it('should allow an appeal when a required service has taken place', () => {
    expect(
      canDefendantAppealVerdict({
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: '2026-06-01T00:00:00.000Z',
      }),
    ).toBe(true)
  })

  it('should not allow an appeal while a required service is pending', () => {
    expect(
      canDefendantAppealVerdict({
        serviceRequirement: ServiceRequirement.REQUIRED,
      }),
    ).toBe(false)
  })

  it('should not allow an appeal when service is not required', () => {
    expect(
      canDefendantAppealVerdict({
        serviceRequirement: ServiceRequirement.NOT_REQUIRED,
        serviceDate: '2026-06-01T00:00:00.000Z',
      }),
    ).toBe(false)
  })
})
