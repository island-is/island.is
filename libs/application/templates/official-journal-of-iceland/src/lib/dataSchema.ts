import { z } from 'zod'
import { error } from './messages'
import { AnswerOption, FileNames } from './constants'

const memberSchema = z
  .object({
    name: z.string(),
    before: z.string(),
    below: z.string(),
    above: z.string(),
    after: z.string(),
  })
  .partial()

export const signatureSchema = z
  .object({
    date: z.string(),
    institution: z.string(),
    members: z.array(memberSchema),
    additionalSignature: z.string(),
    html: z.string(),
  })
  .partial()

const channelSchema = z
  .object({
    email: z.string(),
    phone: z.string(),
  })
  .partial()

const advertSchema = z
  .object({
    departmentId: z.string(),
    typeId: z.string(),
    title: z.string(),
    html: z.string(),
    requestedDate: z.string(),
    categories: z.array(z.string()),
    channels: z.array(channelSchema),
    message: z.string(),
  })
  .partial()

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

const attachmentSchema = z.object({
  files: z.array(fileSchema),
  fileNames: z.enum([FileNames.ADDITIONS, FileNames.DOCUMENT]),
})

const miscSchema = z
  .object({
    signatureType: z.string(),
    selectedTemplate: z.string(),
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
  advert: advertSchema,
  signatures: z
    .object({
      regular: z.array(signatureSchema),
      committee: signatureSchema.extend({
        chairman: memberSchema,
      }),
    })
    .partial(),
  misc: miscSchema,
  attachments: z.array(attachmentSchema).optional(),
})

const advertValidation = (advert: z.infer<typeof advertSchema>) => {
  if (
    !advert ||
    !advert.typeId ||
    !advert.title ||
    !advert.html ||
    !advert.requestedDate ||
    !advert.categories
  ) {
    return false
  }

  return true
}

const memberValidation = (members?: z.infer<typeof memberSchema>[]) => {
  if (!members || members.length === 0) {
    return false
  }

  for (const member of members) {
    if (!member || !member.name) {
      return false
    }
  }

  return true
}

const signatureValidation = (signatures: z.infer<typeof signatureSchema>[]) => {
  if (!signatures || signatures.length === 0) {
    return false
  }

  for (const signature of signatures) {
    if (!signature || !signature.date || !signature.institution) {
      return false
    }

    if (!memberValidation(signature.members)) {
      return false
    }
  }

  return true
}

const validationSchema = z.object({
  advert: advertSchema.refine((advert) => advertValidation(advert), {
    params: error.applicationValidationError,
    path: ['advert'],
  }),
  signature: z
    .array(signatureSchema)
    .refine((signatures) => signatureValidation(signatures), {
      params: error.signaturesValidationError,
      path: ['signatures'],
    }),
})

export type partialSchema = z.infer<typeof partialSchema>

export type validationSchema = z.infer<typeof validationSchema>
