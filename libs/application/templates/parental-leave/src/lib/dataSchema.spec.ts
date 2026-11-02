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
