import { z } from 'zod'
import { error } from './messages'
import { AnswerOption, SignatureTypes } from './constants'
import { MessageDescriptor } from 'react-intl'

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
const isValidEmail = (value?: string) =>
  value ? emailRegex.test(value) : false
export const memberItemSchema = z
  .object({
    name: z.string().optional(),
    before: z.string().optional(),
    below: z.string().optional(),
    above: z.string().optional(),
    after: z.string().optional(),
  })
  .partial()

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

export const membersSchema = z.array(memberItemSchema).optional()

export const regularSignatureItemSchema = z
  .object({
    date: z.string().optional(),
    institution: z.string().optional(),
    members: membersSchema.optional(),
    html: z.string().optional(),
  })
  .partial()

export const regularSignatureSchema = z
  .array(regularSignatureItemSchema)
  .optional()

export const baseEntitySchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
})

export const signatureInstitutionSchema = z.enum(['institution', 'date'])

export const committeeSignatureSchema = regularSignatureItemSchema
  .extend({
    chairman: memberItemSchema.optional(),
  })
  .partial()

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
  })
  .partial()

export const partialSchema = z.object({
  requirements: z
    .object({
      approveExternalData: z.string(),
    })
    .refine((schema) => schema.approveExternalData === AnswerOption.YES, {
      params: error.dataGathering,
      path: ['approveExternalData'],
    }),
  advert: advertSchema.optional(),
  signatures: z
    .object({
      additionalSignature: z
        .object({
          committee: z.string().optional(),
          regular: z.string().optional(),
        })
        .optional(),
      regular: z.array(regularSignatureItemSchema).optional(),
      committee: committeeSignatureSchema.optional(),
    })
    .partial()
    .optional(),
  misc: miscSchema.optional(),
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
      // TODO: Add date validation
      params: error.missingRequestedDate,
    }),
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

export const signatureValidationSchema = z
  .object({
    signatures: z.object({
      additionalSignature: z
        .object({
          committee: z.string().optional(),
          regular: z.string().optional(),
        })
        .optional(),
      regular: z.array(regularSignatureItemSchema).optional(),
      committee: committeeSignatureSchema.optional(),
    }),
    misc: miscSchema.optional(),
  })
  .superRefine((schema, context) => {
    const signatureType = schema.misc?.signatureType

    if (!signatureType) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        params: error.missingSignatureType,
        path: ['misc', 'signatureType'],
      })
    }

    let hasRegularIssues = false
    let hasCommitteeIssues = false

    if (signatureType === SignatureTypes.REGULAR) {
      hasRegularIssues = validateRegularSignature(
        schema.signatures.regular,
        context,
      )
    }

    if (signatureType === SignatureTypes.COMMITTEE) {
      hasCommitteeIssues = validateCommitteeSignature(
        schema.signatures.committee as z.infer<typeof committeeSignatureSchema>,
        context,
      )
    }

    if (!hasRegularIssues && !hasCommitteeIssues) {
      return false
    }

    return true
  })

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

const validateRegularSignature = (
  schema: z.infer<typeof regularSignatureSchema>,
  context: z.RefinementCtx,
) => {
  if (!schema || (Array.isArray(schema) && schema.length === 0)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      params: error.signaturesValidationError,
    })

    return false
  }

  const validSignatures = schema
    ?.map((signature) => {
      // institution and date are required
      let hasValidInstitutionAndDate = true
      let hasValidMembers = true

      hasValidInstitutionAndDate = validateInstitutionAndDate(
        signature.institution,
        signature.date,
        context,
      )

      if (!signature.members && !Array.isArray(signature.members)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          params: error.noSignatureMembers,
        })
      }

      hasValidMembers =
        signature.members
          ?.map((member) => validateMember(member, context))
          .every((isValid) => isValid) ?? false

      return hasValidInstitutionAndDate && hasValidMembers
    })
    .every((isValid) => isValid)

  return validSignatures
}

const validateCommitteeSignature = (
  schema: z.infer<typeof committeeSignatureSchema>,
  context: z.RefinementCtx,
) => {
  if (!schema) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      params: error.signaturesValidationError,
    })
  }

  let hasValidInstitutionAndDate = true
  let hasValidChairman = true
  let hasValidMembers = true

  hasValidInstitutionAndDate = validateInstitutionAndDate(
    schema.institution,
    schema.date,
    context,
  )

  hasValidChairman = validateMember(
    schema.chairman as z.infer<typeof memberItemSchema>,
    context,
    error.missingChairmanName,
  )

  hasValidMembers =
    schema.members
      ?.map((member) =>
        validateMember(member, context, error.missingCommitteeMemberName),
      )
      .every((isValid) => isValid) ?? false

  return hasValidInstitutionAndDate && hasValidChairman && hasValidMembers
}

const validateChannel = (channel: z.infer<typeof channelSchema>) => {
  const validEmail = isValidEmail(channel.email)

  return validEmail
}

type Flatten<T> = T extends any[] ? T[number] : T

type MapProps<T> = {
  [K in keyof T]: T[K]
}

export type partialSchema = z.infer<typeof partialSchema>

export type partialRegularSignatureSchema = Flatten<
  z.infer<typeof regularSignatureItemSchema>
>

export type partialCommitteeSignatureSchema = MapProps<
  z.infer<typeof committeeSignatureSchema>
>

export type validationSchema = z.infer<typeof advertValidationSchema>

export const signatureProperties = committeeSignatureSchema.keyof()

export const sharedSignatureProperties = signatureProperties
