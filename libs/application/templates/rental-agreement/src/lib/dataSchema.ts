import { z } from 'zod'
import * as kennitala from 'kennitala'
import { YesOrNoEnum } from '@island.is/application/core'
import { RentalHousingConditionInspector } from '../utils/enums'
import { landlordInfo } from './schemas/landlordSchema'
import { tenantInfo } from './schemas/tenantSchema'
import { registerProperty } from './schemas/propertySearchSchema'
import { otherFees } from './schemas/otherFeesSchema'
import { securityDeposit } from './schemas/securityDepositSchema'
import { rentalAmount } from './schemas/rentalAmountSchema'
import * as m from './messages'

const approveExternalData = z.boolean().refine((v) => v)

const applicant = z.object({
  nationalId: z
    .string()
    .refine((val) => (val ? kennitala.isValid(val) : false), {
      params: m.dataSchema.nationalId,
    }),
})

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const specialProvisions = z
  .object({
    descriptionInput: z.string().optional(),
    rulesInput: z.string().optional(),
    // Watched field
    propertySearchUnits: z
      .array(
        z.object({
          size: z.number().optional(),
          changedSize: z.number().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    const anyUnitSizeChanged = data.propertySearchUnits?.some((unit) => {
      return (unit.changedSize && unit.changedSize !== unit.size) || false
    })
    if (anyUnitSizeChanged && !data.descriptionInput) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.specialProvisions.housingInfo.inputRequiredErrorMessage,
        path: ['descriptionInput'],
      })
    }
  })

const condition = z
  .object({
    inspector: z.string().optional(),
    inspectorName: z.string().optional(),
    resultsDescription: z.string().optional(),
    resultsFiles: z.array(fileSchema),
  })
  .superRefine((data, ctx) => {
    if (
      data.inspector === RentalHousingConditionInspector.INDEPENDENT_PARTY &&
      !data.inspectorName
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingCondition.inspectorNameRequired,
        path: ['inspectorName'],
      })
    }

    if (!data.resultsDescription && !data.resultsFiles.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingCondition.inspectionResultsRequired,
        path: ['resultsFiles'],
      })
    }
  })

const rentalPeriod = z
  .object({
    startDate: z
      .string()
      .optional()
      .refine((x) => !!x && x.trim().length > 0, {
        params: m.rentalPeriod.errorAgreementStartDateNotFilled,
      }),
    endDate: z.string().optional(),
    isDefinite: z.string().array().optional(),
  })
  .superRefine((data, ctx) => {
    const start = data.startDate ? new Date(data.startDate) : ''
    const end = data.endDate ? new Date(data.endDate) : ''
    const isDefiniteChecked = data.isDefinite?.includes(YesOrNoEnum.YES)
    if (!isDefiniteChecked) {
      return
    }
    if (!data.endDate || !data.endDate.trim().length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        params: m.rentalPeriod.errorAgreementEndDateNotFilled,
      })
      return
    }
    if (start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        params: m.rentalPeriod.errorEndDateBeforeStart,
      })
    }
  })

const fireProtections = z
  .object({
    smokeDetectors: z.string().optional(),
    fireExtinguisher: z.string().optional(),
    emergencyExits: z.string().optional(),
    fireBlanket: z.string().optional(),
    propertySize: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const propertySizeString = data.propertySize?.replace(',', '.') || ''
    const numberOfSmokeDetectors = Number(data.smokeDetectors)
    const requiredSmokeDetectors = Math.ceil(Number(propertySizeString) / 80)
    if (
      data.smokeDetectors &&
      numberOfSmokeDetectors < requiredSmokeDetectors
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingFireProtections.smokeDetectorMinRequiredError,
        path: ['smokeDetectors'],
      })
    }

    if (data.fireExtinguisher && Number(data.fireExtinguisher) < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingFireProtections.fireExtinguisherNullError,
        path: ['fireExtinguisher'],
      })
    }

    if (data.emergencyExits && Number(data.emergencyExits) < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom error message',
        params: m.housingFireProtections.emergencyExitNullError,
        path: ['emergencyExits'],
      })
    }
  })

const preSignatureInfo = z.object({
  statement: z
    .string()
    .array()
    .refine((x) => x.includes(YesOrNoEnum.YES), {
      params: m.inReview.preSignatureInfo.statementError,
    }),
})

export const dataSchema = z.object({
  approveExternalData,
  applicant,
  landlordInfo,
  tenantInfo,
  registerProperty,
  rentalPeriod,
  rentalAmount,
  securityDeposit,
  specialProvisions,
  condition,
  fireProtections,
  otherFees,
  preSignatureInfo,
})

export type RentalAgreement = z.TypeOf<typeof dataSchema>
