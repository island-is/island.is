import { z } from 'zod'

import {
  RentalHousingCategoryClass,
  RentalHousingCategoryTypes,
} from '../utils/constants'
import { dataSchema } from './dataSchema'

describe('rentalAgreementSdf dataSchema propertyInfo', () => {
  const validDraft = (): Record<string, unknown> => ({
    approveExternalData: true,
    'propertyInfo.categoryType': RentalHousingCategoryTypes.ENTIRE_HOME,
    'propertyInfo.categoryClass': RentalHousingCategoryClass.GENERAL_MARKET,
  })

  it('is a plain ZodObject for the application template contract', () => {
    expect(dataSchema).toBeInstanceOf(z.ZodObject)
  })

  it('reports missing category fields on SDF field ids', () => {
    const result = dataSchema.safeParse({
      approveExternalData: true,
    })

    expect(result.success).toBe(false)
    if (result.success) return
    expect(
      result.error.issues.some(
        (i) => i.path.join('.') === 'propertyInfo.categoryType',
      ),
    ).toBe(true)
    expect(
      result.error.issues.some(
        (i) => i.path.join('.') === 'propertyInfo.categoryClass',
      ),
    ).toBe(true)
  })

  it('keeps categoryClassGroup optional in the schema for conditional validation', () => {
    const result = dataSchema.safeParse({
      approveExternalData: true,
      'propertyInfo.categoryType': RentalHousingCategoryTypes.ENTIRE_HOME,
      'propertyInfo.categoryClass': RentalHousingCategoryClass.SPECIAL_GROUPS,
    })

    expect(result.success).toBe(true)
  })

  it('passes with valid SDF field id answers', () => {
    const result = dataSchema.safeParse(validDraft())
    expect(result.success).toBe(true)
  })
})
