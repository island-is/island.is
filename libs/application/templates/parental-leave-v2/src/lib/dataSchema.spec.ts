import { dataSchema } from './dataSchema'

describe('dataSchema fosterCareOrAdoption', () => {
  const fosterCareOrAdoptionSchema = dataSchema.shape.fosterCareOrAdoption

  it('should validate age against the placement date', () => {
    expect(
      fosterCareOrAdoptionSchema.safeParse({
        birthDate: '2018-04-12',
        adoptionDate: '2025-10-31',
      }).success,
    ).toBe(true)
  })

  it('should reject children who were already 8 on the placement date', () => {
    expect(
      fosterCareOrAdoptionSchema.safeParse({
        birthDate: '2017-10-30',
        adoptionDate: '2025-10-31',
      }).success,
    ).toBe(false)
  })

  it('should reject an empty birth date', () => {
    expect(
      fosterCareOrAdoptionSchema.safeParse({
        birthDate: '',
        adoptionDate: '2025-10-31',
      }).success,
    ).toBe(false)
  })

  it('should reject an empty placement date', () => {
    expect(
      fosterCareOrAdoptionSchema.safeParse({
        birthDate: '2018-04-12',
        adoptionDate: '',
      }).success,
    ).toBe(false)
  })
})

describe('dataSchema multipleBirths', () => {
  const multipleBirthsSchema = dataSchema.shape.multipleBirths

  it('should accept an empty object', () => {
    // The question is conditional — not asked of a secondary parent, nor for a
    // child that already has an application. The object still arrives from the
    // form, just empty, so requiring hasMultipleBirths rejected those cases.
    expect(multipleBirthsSchema.safeParse({}).success).toBe(true)
  })

  it('should treat an empty conditional answer as absent', () => {
    expect(
      multipleBirthsSchema.safeParse({ hasMultipleBirths: '' }).success,
    ).toBe(true)
  })

  it('should accept being absent entirely', () => {
    expect(multipleBirthsSchema.safeParse(undefined).success).toBe(true)
  })

  it('should still require a count when the answer is yes', () => {
    expect(
      multipleBirthsSchema.safeParse({ hasMultipleBirths: 'yes' }).success,
    ).toBe(false)
    expect(
      multipleBirthsSchema.safeParse({
        hasMultipleBirths: 'yes',
        multipleBirths: '2',
      }).success,
    ).toBe(true)
  })

  it('should still reject a count below two', () => {
    expect(
      multipleBirthsSchema.safeParse({
        hasMultipleBirths: 'yes',
        multipleBirths: '1',
      }).success,
    ).toBe(false)
  })

  it('should not require a count when the answer is no', () => {
    expect(
      multipleBirthsSchema.safeParse({ hasMultipleBirths: 'no' }).success,
    ).toBe(true)
  })
})

describe('dataSchema rights days', () => {
  const giveRightsSchema = dataSchema.shape.giveRights
  const requestRightsSchema = dataSchema.shape.requestRights
  const multipleBirthsRequestDaysSchema =
    dataSchema.shape.multipleBirthsRequestDays

  // A negative gift flips sign in `getTransferredDays` and becomes a request.
  it('should reject negative days to give', () => {
    expect(
      giveRightsSchema.safeParse({ isGivingRights: 'yes', giveDays: '-30' })
        .success,
    ).toBe(false)
  })

  it('should reject negative days to request', () => {
    expect(
      requestRightsSchema.safeParse({
        isRequestingRights: 'yes',
        requestDays: '-30',
      }).success,
    ).toBe(false)
  })

  it('should reject more days than may be given or requested', () => {
    expect(
      giveRightsSchema.safeParse({ isGivingRights: 'yes', giveDays: '46' })
        .success,
    ).toBe(false)
    expect(
      requestRightsSchema.safeParse({
        isRequestingRights: 'yes',
        requestDays: '46',
      }).success,
    ).toBe(false)
  })

  it('should reject fractional and empty days', () => {
    expect(
      giveRightsSchema.safeParse({ isGivingRights: 'yes', giveDays: '1.5' })
        .success,
    ).toBe(false)
    expect(
      requestRightsSchema.safeParse({
        isRequestingRights: 'yes',
        requestDays: '',
      }).success,
    ).toBe(false)
  })

  it('should accept days within the range', () => {
    expect(
      giveRightsSchema.safeParse({ isGivingRights: 'yes', giveDays: '45' })
        .success,
    ).toBe(true)
    expect(
      requestRightsSchema.safeParse({
        isRequestingRights: 'yes',
        requestDays: '0',
      }).success,
    ).toBe(true)
  })

  it('should bound multiple-birth days, accepting the number VMST seeds', () => {
    expect(multipleBirthsRequestDaysSchema.safeParse('-30').success).toBe(false)
    expect(multipleBirthsRequestDaysSchema.safeParse('100000').success).toBe(
      false,
    )
    expect(multipleBirthsRequestDaysSchema.safeParse('180').success).toBe(true)
    expect(multipleBirthsRequestDaysSchema.safeParse(360).success).toBe(true)
    expect(multipleBirthsRequestDaysSchema.safeParse(undefined).success).toBe(
      true,
    )
  })
})

describe('dataSchema employers ratio', () => {
  const employersSchema = dataSchema.shape.employers
  const withRatio = (ratio: string) => [{ email: 'employer@island.is', ratio }]

  it.each(['0', '', '-10', '101', 'abc'])(
    'should reject a ratio of %p',
    (ratio) => {
      expect(employersSchema.safeParse(withRatio(ratio)).success).toBe(false)
    },
  )

  it.each(['1', '50', '100'])('should accept a ratio of %p', (ratio) => {
    expect(employersSchema.safeParse(withRatio(ratio)).success).toBe(true)
  })
})
