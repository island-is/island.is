import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import { errorMessages } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const validateOptionalPhoneNumber = (value: string) => {
  return isValidPhoneNumber(value) || value === ''
}

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicantInfo: z.object({
    email: z.string().email(),
    phonenumber: z.string().refine((v) => validateOptionalPhoneNumber(v), {
      params: errorMessages.phoneNumber,
    }),
  }),
  fileUploadAdditionalFilesRequired: z.object({
    additionalDocumentsRequired: z
      .array(FileSchema)
      .refine((a) => a.length !== 0, {
        params: errorMessages.requireAttachment,
      }),
  }),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
