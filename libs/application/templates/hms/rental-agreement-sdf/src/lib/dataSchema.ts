import { z } from 'zod'

import {
  EmergencyExitOptions,
  RentalHousingCategoryClass,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
} from '../utils/constants'
import { propertyInfo as propertyInfoMsgs } from './messages'

const searchSchema = z.object({
  query: z.string().optional(),
  value: z.string().optional(),
  label: z.string().optional(),
})

const propertyUnitSchema = z.object({
  propertyCode: z.number().optional(),
  propertyUsageDescription: z.string().optional(),
  size: z.number().refine((value) => value > 0),
  sizeUnit: z.string().optional(),
  unitCode: z.string().optional(),
  checked: z.boolean().optional(),
  changedSize: z.number().optional(),
  numOfRooms: z.number().optional(),
})

const isEnumMember = <T extends Record<string, string>>(
  enumObj: T,
  value: unknown,
): value is T[keyof T] =>
  typeof value === 'string' &&
  (Object.values(enumObj) as string[]).includes(value)

const enumField = <T extends Record<string, string>>(
  enumObj: T,
  message: string,
) =>
  z
    .unknown()
    .superRefine((value, ctx) => {
      if (!isEnumMember(enumObj, value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
        })
      }
    })
    .transform((value) => value as T[keyof T])

const coerceCategoryType = enumField(
  RentalHousingCategoryTypes,
  propertyInfoMsgs.categoryTypeRequiredError,
)

const coerceCategoryClass = enumField(
  RentalHousingCategoryClass,
  propertyInfoMsgs.categoryClassRequiredError,
)

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((value) => value),
  propertySearch: searchSchema.optional(),
  propertyInfoTable: z
    .object({
      units: z.array(propertyUnitSchema).optional(),
    })
    .optional(),
  'propertyInfo.categoryType': coerceCategoryType,
  'propertyInfo.categoryClass': coerceCategoryClass,
  'propertyInfo.categoryClassGroup': z.string().optional(),
  'specialProvisions.descriptionInput': z.string().optional(),
  'specialProvisions.rulesInput': z.string().optional(),
  'specialProvisions.propertySearchUnits': z.unknown().optional(),
  'condition.inspector': z
    .nativeEnum(RentalHousingConditionInspector)
    .optional(),
  'condition.inspectorName': z.string().optional(),
  'condition.resultsDescription': z.string().optional(),
  'condition.resultsFiles': z.array(z.unknown()).optional(),
  'fireProtections.smokeDetectors': z.string().optional(),
  'fireProtections.fireExtinguisher': z.string().optional(),
  'fireProtections.fireBlanket': z.nativeEnum(EmergencyExitOptions).optional(),
  'fireProtections.emergencyExits': z
    .nativeEnum(EmergencyExitOptions)
    .optional(),
  'fireProtections.propertySize': z.unknown().optional(),
})

export type RentalAgreementSdfAnswers = z.TypeOf<typeof dataSchema>
