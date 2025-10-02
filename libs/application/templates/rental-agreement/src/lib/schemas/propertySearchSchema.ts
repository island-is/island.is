import { z } from 'zod'
import { maxChangedUnitSize, minChangedUnitSize } from '../../utils/utils'
import * as m from '../messages'

export const registerPropertySchema = z
  .object({
    searchresults: z
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
      .optional(),
  })
  .superRefine((data, ctx) => {
    const { searchresults } = data

    if (!searchresults?.units || searchresults.units.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.propertySearch.search.searchResultsNoUnitChosenError,
        path: ['searchresults'],
      })
    }
    if (searchresults?.units && searchresults.units.length > 0) {
      const totalRooms = searchresults.units.reduce(
        (sum, unit) => sum + (unit.numOfRooms || 0),
        0,
      )
      if (totalRooms < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.propertySearch.search.numOfRoomsMinimumError,
          path: ['searchresults.units'],
        })
      }
      if (totalRooms > 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.propertySearch.search.numOfRoomsMaximumError,
          path: ['searchresults.units'],
        })
      }

      const totalChangedSize = searchresults.units.reduce(
        (sum, unit) => sum + (unit.changedSize || 0),
        0,
      )
      if (totalChangedSize > maxChangedUnitSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.propertySearch.search.changedSizeTooLargeError,
          path: ['searchresults.units'],
        })
      }
      if (totalChangedSize < minChangedUnitSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Custom error message',
          params: m.propertySearch.search.changedSizeTooSmallError,
          path: ['searchresults.units'],
        })
      }
    }
  })
