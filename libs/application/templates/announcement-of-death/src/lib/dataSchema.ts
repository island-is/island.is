import * as z from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { m } from './messages'
import { RoleConfirmationEnum } from '../types'

import { customZodError } from './utils/customZodError'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const asset = z.object({
  share: z.number().optional(),
  initial: z.boolean().optional(),
  assetNumber: z.string().nonempty(),
  description: z.string().optional(),
})

// todo: set message strings for the error messages
export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  pickRole: z
    .object({
      roleConfirmation: z.enum([
        RoleConfirmationEnum.CONTINUE,
        RoleConfirmationEnum.DELEGATE,
      ]),
      electPerson: z.object({
        electedPersonNationalId: z.string(),
        electedPersonName: z.string(),
      }),
    })
    .partial()
    .refine(
      ({ roleConfirmation, electPerson }) =>
        (roleConfirmation === RoleConfirmationEnum.DELEGATE &&
        electPerson?.electedPersonName
          ? electPerson?.electedPersonName !== ''
          : false) ||
        (roleConfirmation === RoleConfirmationEnum.CONTINUE &&
          (electPerson?.electedPersonName === '' ||
            electPerson?.electedPersonName !== '')),
      {
        message: m.errorNationalIdNoName.defaultMessage,
        path: ['electPerson', 'electedPersonNationalId'],
      },
    )
    .refine(
      ({ roleConfirmation, electPerson }) =>
        (roleConfirmation === RoleConfirmationEnum.DELEGATE &&
        electPerson?.electedPersonNationalId
          ? kennitala.isPerson(electPerson?.electedPersonNationalId)
          : false) ||
        (roleConfirmation === RoleConfirmationEnum.CONTINUE &&
          (electPerson?.electedPersonNationalId === '' ||
            electPerson?.electedPersonNationalId !== '')),
      {
        message: m.errorNationalIdIncorrect.defaultMessage,
        path: ['electPerson', 'electedPersonNationalId'],
      },
    )
    .refine(
      ({ roleConfirmation, electPerson }) =>
        (roleConfirmation === RoleConfirmationEnum.DELEGATE &&
        electPerson?.electedPersonNationalId
          ? kennitala.info(electPerson?.electedPersonNationalId).age >= 18
          : false) ||
        (roleConfirmation === RoleConfirmationEnum.CONTINUE &&
          (electPerson?.electedPersonNationalId === '' ||
            electPerson?.electedPersonNationalId !== '')),
      {
        message: m.errorAge.defaultMessage,
        path: ['electPerson', 'electedPersonNationalId'],
      },
    )
    .refine(({ roleConfirmation }) => !!roleConfirmation, {
      message: m.errorRoleConfirmation.defaultMessage,
      path: ['roleConfirmation'],
    }),

  applicantPhone: z.string().refine((v) => isValidPhoneNumber(v), {
    params: m.errorPhoneNumber,
  }),
  applicantEmail: customZodError(z.string().email(), m.errorEmail),
  applicantRelation: customZodError(z.string().nonempty(), m.errorRelation),
  assets: z.object({
    assets: z
      .object({
        assetNumber: z.string().refine(
          (v) => {
            return /^[fF]{0,1}\d{7}$/.test(v)
          },
          { params: m.errorAssetNumber },
        ),
        share: z.number().optional(),
        initial: z.boolean().optional(),
        description: z.string().optional(),
      })
      .partial()
      .array(),
    encountered: z.boolean().optional(),
  }),
  estateMembers: z.object({
    members: z
      .object({
        initial: z.boolean().optional(),
        name: z.string().nonempty(),
        relation: customZodError(z.string().nonempty(), m.errorRelation),
        nationalId: z.string().optional(),
        custodian: z.string().length(10).optional(),
        foreignCitizenship: z.string().array().min(0).max(1).optional(),
        dateOfBirth: z.string().nonempty().optional(),
      })
      .array(),
    encountered: z.boolean().optional(),
  }),
  flyers: asset.partial().array(),
  ships: asset.partial().array(),
  vehicles: z.object({
    vehicles: asset.partial().array(),
    encountered: z.boolean().optional(),
  }),
})
