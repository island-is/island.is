import { z } from 'zod'
import {
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
} from '../../utils/enums'
import { RentalHousingCategoryClass } from '../../shared/enums'
import * as m from '../messages'

export const propertyInfoSchema = z
  .object({
    categoryType: z.nativeEnum(RentalHousingCategoryTypes),
    categoryClass: z.nativeEnum(RentalHousingCategoryClass).optional(),
    categoryClassGroup: z
      .nativeEnum(RentalHousingCategoryClassGroup)
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const { categoryClass, categoryClassGroup } = data

    if (
      categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS &&
      !categoryClassGroup
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.propertySearch.category.classGroupRequiredError,
        path: ['categoryClassGroup'],
      })
    }
  })
