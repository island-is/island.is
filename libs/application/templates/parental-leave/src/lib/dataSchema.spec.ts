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

