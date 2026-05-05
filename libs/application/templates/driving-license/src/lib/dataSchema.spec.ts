import { dataSchema } from './dataSchema'

// A baseline that satisfies the rest of the schema. Tests override only the
// fields they care about so the cross-field superRefine for the 65+ redesign
// flow actually runs (Zod skips superRefine if the object's shape parse
// fails).
const baseValidInput = {
  type: ['car'],
  approveExternalData: true,
  delivery: { deliveryMethod: 'post', jurisdiction: null },
  healthDeclaration: {
    usesContactGlasses: 'no',
    hasReducedPeripheralVision: 'no',
    hasEpilepsy: 'no',
    hasHeartDisease: 'no',
    hasMentalIllness: 'no',
    usesMedicalDrugs: 'no',
    isAlcoholic: 'no',
    hasDiabetes: 'no',
    isDisabled: 'no',
    hasOtherDiseases: 'no',
  },
  contactGlassesMismatch: false,
  willBringQualityPhoto: 'yes',
  requirementsMet: true,
  certificate: ['no'],
  advancedLicense: ['C1'],
  email: 'foo@bar.com',
  phone: '8901234',
  drivingInstructor: 'X',
  otherCountry: { drivingLicenseInOtherCountry: 'no' },
  hasHealthRemarks: 'no',
}

const certIssue = (res: ReturnType<typeof dataSchema.safeParse>): boolean => {
  if (res.success) return false
  return res.error.issues.some((i) => i.path[0] === 'healthCertificate')
}

describe('dataSchema — 65+ redesign cert requirement', () => {
  it('fails when applicationFor is B-full-renewal-65 + redesign flag ON + cert missing', () => {
    const result = dataSchema.safeParse({
      ...baseValidInput,
      applicationFor: 'B-full-renewal-65',
      is65RenewalRedesignEnabled: true,
    })
    expect(result.success).toBe(false)
    expect(certIssue(result)).toBe(true)
  })

  it('fails when applicationFor is B-full-renewal-65 + redesign flag ON + cert is empty array', () => {
    const result = dataSchema.safeParse({
      ...baseValidInput,
      applicationFor: 'B-full-renewal-65',
      is65RenewalRedesignEnabled: true,
      healthCertificate: [],
    })
    expect(result.success).toBe(false)
    expect(certIssue(result)).toBe(true)
  })

  it('passes when applicationFor is B-full-renewal-65 + redesign flag OFF + cert missing (legacy 65+)', () => {
    const result = dataSchema.safeParse({
      ...baseValidInput,
      applicationFor: 'B-full-renewal-65',
      is65RenewalRedesignEnabled: false,
    })
    expect(certIssue(result)).toBe(false)
  })

  it('passes when applicationFor is B-full-renewal-65 + redesign flag missing (treated as OFF)', () => {
    const result = dataSchema.safeParse({
      ...baseValidInput,
      applicationFor: 'B-full-renewal-65',
    })
    expect(certIssue(result)).toBe(false)
  })

  it('passes for non-65+ application even with redesign flag ON', () => {
    const result = dataSchema.safeParse({
      ...baseValidInput,
      applicationFor: 'B-full',
      is65RenewalRedesignEnabled: true,
    })
    expect(certIssue(result)).toBe(false)
  })

  it('passes when applicationFor is B-full-renewal-65 + flag ON + non-empty cert provided', () => {
    const result = dataSchema.safeParse({
      ...baseValidInput,
      applicationFor: 'B-full-renewal-65',
      is65RenewalRedesignEnabled: true,
      healthCertificate: [{ name: 'cert.pdf', key: 's3-key' }],
    })
    expect(certIssue(result)).toBe(false)
  })
})
