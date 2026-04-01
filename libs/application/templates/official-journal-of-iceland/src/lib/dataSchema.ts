import { z } from 'zod'
import { error } from './messages'
import { MessageDescriptor } from 'react-intl'
import { YesOrNoEnum, EMAIL_REGEX } from '@island.is/application/core'
import { TitlePrefix, isDateNotBeforeToday } from './utils'

const isValidEmail = (value?: string) =>
  value ? EMAIL_REGEX.test(value) : false

export const additionSchema = z.array(
  z
    .object({
      id: z.string().optional(),
      title: z.string().optional(),
      content: z.string().optional(),
      type: z.enum(['html', 'file']).optional(),
    })
    .partial(),
)

export const memberItemSchema = z
  .object({
    name: z.string().optional(),
    before: z.string().optional(),
    below: z.string().optional(),
    above: z.string().optional(),
    after: z.string().optional(),
  })
  .partial()

export const membersSchema = z.array(memberItemSchema).optional()

const signatureRecordItemSchema = z.object({
  institution: z.string().optional(),
  signatureDate: z.string().optional(),
  chairman: memberItemSchema.optional(),
  members: membersSchema.optional(),
  additional: z.string().optional(),
})

const signatureRecordSchema = z.object({
  records: z.array(signatureRecordItemSchema).optional(),
})

const signatureSchema = z.object({
  regular: signatureRecordSchema.optional(),
  committee: signatureRecordSchema.optional(),
})

export const regularSignatureItemSchema = z
  .object({
    date: z.string().optional(),
    institution: z.string().optional(),
    members: membersSchema.optional(),
    html: z.string().optional(),
  })
  .partial()

export const baseEntitySchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
})

export const channelSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  })
  .partial()

const advertSchema = z
  .object({
    department: baseEntitySchema.optional(),
    type: baseEntitySchema.optional().nullable(),
    mainType: baseEntitySchema
      .extend({ types: z.array(baseEntitySchema).optional() })
      .optional(),
    title: z.string().optional(),
    involvedPartyId: z.string().optional(),
    html: z.string().optional(),
    requestedDate: z.string().optional(),
    categories: z.array(baseEntitySchema).optional(),
    channels: z.array(channelSchema).optional(),
    message: z.string().optional(),
    additions: additionSchema.optional(),
  })
  .partial()

const miscSchema = z
  .object({
    signatureType: z.string().optional(),
    selectedTemplate: z.string().optional(),
    asDocument: z.boolean().optional(),
    asRoman: z.boolean().optional(),
    titlePrefix: z.nativeEnum(TitlePrefix).optional(),
    mainTextAsFile: z.boolean().optional(),
    mainTextFilename: z.string().optional(),
  })
  .partial()

// ---------------------------------------------------------------------------
// Regulation-specific schemas
//
// For regulation application types (base_regulation / amending_regulation),
// these fields live in the regulations-admin DB as single source of truth.
// Only `regulation.draftId` is stored in application.answers.
// The schema definitions are kept here for type inference, validation
// schemas, and backward compatibility with legacy applications.
// ---------------------------------------------------------------------------

export const regulationAppendixSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  diff: z.string().optional(),
  revoked: z.boolean().optional(),
})

export const regulationImpactSchema = z.object({
  id: z.string(),
  impactId: z.string().optional(), // Server-side UUID from regulations-admin DB
  type: z.enum(['amend', 'repeal']),
  name: z.string(), // RegName or 'self'
  regTitle: z.string().optional(),
  date: z.string().optional(), // ISODate
  // Fields only present for 'amend' type
  title: z.string().optional(),
  text: z.string().optional(), // HTMLText
  appendixes: z.array(regulationAppendixSchema).optional(),
  comments: z.string().optional(), // HTMLText
  diff: z.string().optional(), // HTMLText
})

const regulationSchema = z
  .object({
    draftId: z.string().optional(), // ID linking to regulations-admin draft in DB
    effectiveDate: z.string().optional(),
    fastTrack: z.boolean().optional(),
    lawChapters: z
      .array(
        z.object({
          slug: z.string(),
          name: z.string(),
        }),
      )
      .optional(),
    draftingNotes: z.string().optional(),
    impacts: z.array(regulationImpactSchema).optional(),
  })
  .partial()

export const readerSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    nationalId: z.string(),
  })
  .optional()

export const partialSchema = z.object({
  requirements: z
    .object({
      approveExternalData: z.string(),
    })
    .refine((schema) => schema.approveExternalData === YesOrNoEnum.YES, {
      params: error.dataGathering,
      path: ['approveExternalData'],
    }),
  applicationType: z
    .enum(['ad', 'base_regulation', 'amending_regulation'])
    .optional(),
  advert: advertSchema.optional(),
  signature: signatureSchema.optional(),
  misc: miscSchema.optional(),
  regulation: regulationSchema.optional(),
  reader: readerSchema,
})

// We make properties optional to throw custom error messages
export const advertValidationSchema = z.object({
  advert: z.object({
    department: baseEntitySchema
      .optional()
      .nullable()
      .refine((value) => value !== null && value !== undefined, {
        params: error.missingDepartment,
      }),
    type: baseEntitySchema
      .optional()
      .nullable()
      .refine((value) => value !== null && value !== undefined, {
        params: error.missingType,
      }),
    title: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingTitle,
      }),
    html: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingHtml,
      }),
  }),
})

export const previewValidationSchema = z.object({
  advert: z.object({
    department: baseEntitySchema
      .optional()
      .nullable()
      .refine((value) => value !== null && value !== undefined, {
        params: error.missingDepartment,
      }),
    type: baseEntitySchema
      .optional()
      .nullable()
      .refine((value) => value !== null && value !== undefined, {
        params: error.missingType,
      }),
    title: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingPreviewTitle,
      }),
    html: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingPreviewHtml,
      }),
  }),
})

export const publishingValidationSchema = z.object({
  requestedDate: z
    .string()
    .optional()
    .refine((value) => value && value.length > 0, {
      params: error.missingRequestedDate,
    })
    .refine(
      (value) => {
        if (!value) return true
        return isDateNotBeforeToday(value)
      },
      {
        params: error.dateBeforeToday,
      },
    ),
  categories: z
    .array(baseEntitySchema)
    .optional()
    .refine((value) => Array.isArray(value) && value.length > 0, {
      params: error.noCategorySelected,
    }),
  channels: z
    .array(channelSchema)
    .optional()
    .superRefine((schema, context) => {
      let pass = true
      if (!schema || schema.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          params: error.emptyChannel,
          path: ['advert', 'channels'],
        })

        pass = false
      }

      const validChannels = schema?.every(
        (channel) => validateChannel(channel) === true,
      )

      if (!validChannels) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          params: error.invalidChannel,
          path: ['advert', 'channels'],
        })

        pass = false
      }

      return pass
    }),
})

export const signatureValidator = (type: string) => {
  return z
    .object({
      committee: signatureRecordSchema.optional(),
      regular: signatureRecordSchema.optional(),
    })
    .optional()
    .superRefine((schema, context) => {
      if (!schema) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          params: error.missingSignature,
        })

        return false
      }

      let hasValidInstitutionAndDate = true
      let hasValidSignatureMembers = true
      let hasValidChairman = true

      const recordsToParse =
        type === 'committee' ? schema.committee : schema.regular

      if (!recordsToParse?.records || recordsToParse.records.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          params: error.missingSignature,
        })

        hasValidInstitutionAndDate = false
      }

      recordsToParse?.records?.forEach((record) => {
        if (!record?.institution) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.missingSignatureInstitution,
          })

          hasValidInstitutionAndDate = false
        }

        if (!record?.signatureDate) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.missingSignatureDate,
          })

          hasValidInstitutionAndDate = false
        }

        if (type === 'committee') {
          if (!record?.chairman || !record?.chairman?.name) {
            context.addIssue({
              code: z.ZodIssueCode.custom,
              params: error.missingChairmanName,
            })

            hasValidChairman = false
          }
        }

        if (!record.members || record.members.length === 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.missingSignatureMember,
          })

          hasValidSignatureMembers = false
        }

        hasValidSignatureMembers =
          record.members?.every((member) => validateMember(member, context)) ??
          false
      })

      return (
        hasValidInstitutionAndDate &&
        hasValidSignatureMembers &&
        hasValidChairman
      )
    })
}

const validateMember = (
  schema: z.infer<typeof memberItemSchema>,
  context: z.RefinementCtx,
  params?: MessageDescriptor,
) => {
  if (!schema || !schema.name) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      params: params ? params : error.missingSignatureMember,
    })

    return false
  }

  return true
}

const validateInstitutionAndDate = (
  institution: string | undefined,
  date: string | undefined,
  context: z.RefinementCtx,
) => {
  let success = true
  if (!institution) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      params: error.missingSignatureInstitution,
    })

    success = false
  }

  if (!date) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      params: error.missingSignatureDate,
    })

    success = false
  }

  return success
}

const validateChannel = (channel: z.infer<typeof channelSchema>) => {
  const validEmail = isValidEmail(channel.email)

  return validEmail
}

export type partialSchema = z.infer<typeof partialSchema>

// ---------------------------------------------------------------------------
// Regulation validation schemas
// ---------------------------------------------------------------------------

export const regulationContentValidationSchema = z.object({
  advert: z.object({
    department: baseEntitySchema
      .optional()
      .nullable()
      .refine((value) => value !== null && value !== undefined, {
        params: error.missingDepartment,
      }),
    type: baseEntitySchema
      .optional()
      .nullable()
      .refine((value) => value !== null && value !== undefined, {
        params: error.missingType,
      }),
    title: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingRegulationTitle,
      }),
    html: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingRegulationText,
      }),
  }),
})

export const regulationMetaValidationSchema = z.object({
  regulation: z.object({
    effectiveDate: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingEffectiveDate,
      }),
    lawChapters: z
      .array(z.object({ slug: z.string(), name: z.string() }))
      .optional()
      .refine((value) => Array.isArray(value) && value.length > 0, {
        params: error.missingLawChapters,
      }),
  }),
})

export const regulationPublishingValidationSchema = z.object({
  advert: z.object({
    requestedDate: z
      .string()
      .optional()
      .refine((value) => value && value.length > 0, {
        params: error.missingRequestedDate,
      })
      .refine(
        (value) => {
          if (!value) return true
          return isDateNotBeforeToday(value)
        },
        {
          params: error.dateBeforeToday,
        },
      ),
    channels: z
      .array(channelSchema)
      .optional()
      .superRefine((schema, context) => {
        let pass = true
        if (!schema || schema.length === 0) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.emptyChannel,
            path: ['advert', 'channels'],
          })
          pass = false
        }

        const validChannels = schema?.every(
          (channel) => validateChannel(channel) === true,
        )

        if (!validChannels) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            params: error.invalidChannel,
            path: ['advert', 'channels'],
          })
          pass = false
        }

        return pass
      }),
  }),
})

export const regulationImpactsValidationSchema = z.object({
  regulation: z.object({
    impacts: z
      .array(regulationImpactSchema)
      .optional()
      .refine((value) => Array.isArray(value) && value.length > 0, {
        params: error.missingImpacts,
      }),
  }),
})

export type RegulationImpactSchema = z.infer<typeof regulationImpactSchema>
export type RegulationSchema = z.infer<typeof regulationSchema>

export type SignatureMemberKey = keyof z.infer<typeof memberItemSchema>
export type SignatureInstitutionKey = keyof Pick<
  z.infer<typeof signatureRecordItemSchema>,
  'institution' | 'signatureDate' | 'additional'
>

export type SignatureRecordSchema = z.infer<typeof signatureRecordItemSchema>

export type SignatureMemberSchema = z.infer<typeof memberItemSchema>
export type SignatureSchema = z.infer<typeof signatureRecordSchema>
