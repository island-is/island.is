import { z } from 'zod'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { AddressDeliveryType } from '../shared'

const isOtherAddressFieldMissing = (
  type: AddressDeliveryType,
  value?: string,
) => type === AddressDeliveryType.OTHER && !value?.trim()

export const CardDeliverySchema = z
  .object({
    type: z.nativeEnum(AddressDeliveryType),
    currentAddress: z
      .object({
        streetAddress: z.string().optional(),
        postalCode: z.string().optional(),
        city: z.string().optional(),
      })
      .optional(),
    address: z.string().optional(),
    postalCodeAndCity: z.string().optional(),
    recipient: z.string().optional(),
  })
  .refine(({ type, address }) => !isOtherAddressFieldMissing(type, address), {
    path: ['address'],
  })
  .refine(
    ({ type, postalCodeAndCity }) =>
      !isOtherAddressFieldMissing(type, postalCodeAndCity),
    { path: ['postalCodeAndCity'] },
  )

export const MachineLicenseCardReissueAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema({ phoneRequired: true }),
  cardDelivery: CardDeliverySchema,
  overview: z.object({
    agreementCheckbox: z.array(z.string().min(1)).nonempty(),
  }),
})

export type MachineLicenseCardReissueAnswers = z.TypeOf<
  typeof MachineLicenseCardReissueAnswersSchema
>
export type CardDeliveryAnswers = z.TypeOf<typeof CardDeliverySchema>
