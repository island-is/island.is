import { z } from 'zod'
import { applicantInformationSchema } from '@island.is/application/ui-forms'
import { postalCodes } from '@island.is/shared/utils'
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
        streetAddress: z.string().nullish(),
        postalCode: z.string().nullish(),
        city: z.string().nullish(),
      })
      .nullish(),
    // Nullish: SelectController sets unmatched values to null, and these fields
    // keep stale values when the user switches back to the current address
    address: z.string().nullish(),
    postalCode: z.string().nullish(),
    recipient: z.string().nullish(),
  })
  .refine(({ type, address }) => !isOtherAddressFieldMissing(type, address), {
    path: ['address'],
  })
  .refine(
    ({ type, postalCode }) =>
      type !== AddressDeliveryType.OTHER ||
      postalCodes.includes(Number(postalCode)),
    { path: ['postalCode'] },
  )

export const MachineLicenseCardReissueAnswersSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  applicant: applicantInformationSchema({ phoneRequired: true }),
  cardDelivery: CardDeliverySchema,
})

export type MachineLicenseCardReissueAnswers = z.TypeOf<
  typeof MachineLicenseCardReissueAnswersSchema
>
export type CardDeliveryAnswers = z.TypeOf<typeof CardDeliverySchema>
