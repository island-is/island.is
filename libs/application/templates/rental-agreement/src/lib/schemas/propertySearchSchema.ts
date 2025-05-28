import { z } from 'zod'
import { maxChangedUnitSize, minChangedUnitSize } from '../../utils/utils'
import {
  RentalHousingCategoryClass,
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
} from '../../utils/enums'
import * as m from '../messages'

const searchResults = z
  .object({
    label: z.string().optional(),
    units: z
      .array(
        z.object({
          size: z.number().optional(),
          address: z.string().optional(),
          checked: z.boolean().optional(),
          sizeUnit: z.string().optional(),
          unitCode: z.string().optional(),
          addressCode: z.number().optional(),
          propertyCode: z.number().optional(),
          propertyValue: z.number().optional(),
          appraisalUnitCode: z.number().optional(),
          fireInsuranceValuation: z.number().optional(),
          propertyUsageDescription: z.string().optional(),
          numOfRooms: z.number().optional(),
          changedSize: z.number().optional(),
        }),
      )
      .optional(),
    value: z.string().optional(),
    address: z.string().optional(),
    landCode: z.number().optional(),
    postalCode: z.number().optional(),
    streetName: z.string().optional(),
    addressCode: z.number().optional(),
    checkedUnits: z.object({}).optional(),
    streetNumber: z.number().optional(),
    municipalityCode: z.number().optional(),
    municipalityName: z.string().optional(),
  })
  .optional()

export const registerProperty = z
  .object({
    searchresults: searchResults,
    categoryType: z.nativeEnum(RentalHousingCategoryTypes).optional(),
    categoryClass: z.nativeEnum(RentalHousingCategoryClass).optional(),
    categoryClassGroup: z
      .nativeEnum(RentalHousingCategoryClassGroup)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data?.searchresults?.units ||
      (data?.searchresults?.units && data.searchresults.units.length < 1)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.registerProperty.search.searchResultsNoUnitChosenError,
        path: ['searchresults'],
      })
    }
    if (data?.searchresults?.units && data.searchresults.units.length > 0) {
      const totalRooms = data.searchresults.units.reduce(
        (sum, unit) => sum + (unit.numOfRooms || 0),
        0,
      )
      if (totalRooms < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.registerProperty.search.numOfRoomsMinimumError,
          path: ['searchresults.units'],
        })
      }
      if (totalRooms > 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.registerProperty.search.numOfRoomsMaximumError,
          path: ['searchresults.units'],
        })
      }

      const totalChangedSize = data.searchresults.units.reduce(
        (sum, unit) => sum + (unit.changedSize || 0),
        0,
      )
      if (totalChangedSize > maxChangedUnitSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.registerProperty.search.changedSizeTooLargeError,
          path: ['searchresults.units'],
        })
      }
      if (totalChangedSize < minChangedUnitSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.registerProperty.search.changedSizeTooSmallError,
          path: ['searchresults.units'],
        })
      }
    }
    if (
      data.categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS &&
      !data.categoryClassGroup
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.registerProperty.category.classGroupRequiredError,
        path: ['categoryClassGroup'],
      })
    }
  })
