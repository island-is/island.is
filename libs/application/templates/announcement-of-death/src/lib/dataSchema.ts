import { z } from 'zod'
import * as nationalId from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { m } from './messages'
import { RoleConfirmationEnum } from '../types'

import { customZodError } from './utils/customZodError'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const asset = z
  .object({
    share: z.number().optional(),
    initial: z.boolean().optional(),
    dummy: z.boolean().optional(),
    assetNumber: customZodError(z.string().min(1), m.errorNumberEmpty),
    description: z.string().optional(),
  })
  .array()
  .optional()

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
    .refine(({ roleConfirmation }) => !!roleConfirmation, {
      message: m.errorRoleConfirmation.defaultMessage,
      path: ['roleConfirmation'],
    })
    .refine(
      ({ roleConfirmation, electPerson }) =>
        roleConfirmation === RoleConfirmationEnum.DELEGATE && !!electPerson
          ? electPerson.electedPersonName !== '' &&
            electPerson.electedPersonNationalId !== ''
          : !electPerson
          ? true
          : roleConfirmation === RoleConfirmationEnum.CONTINUE
          ? true
          : false,
      {
        message: m.errorNationalIdNoName.defaultMessage,
        path: ['electPerson', 'electedPersonNationalId'],
      },
    )
    .refine(
      ({ roleConfirmation, electPerson }) =>
        roleConfirmation === RoleConfirmationEnum.DELEGATE && !!electPerson
          ? electPerson.electedPersonNationalId &&
            nationalId.isPerson(electPerson.electedPersonNationalId) &&
            nationalId.info(electPerson.electedPersonNationalId).age >= 18
          : !electPerson
          ? true
          : roleConfirmation === RoleConfirmationEnum.CONTINUE
          ? true
          : false,
      {
        message: m.errorNationalIdIncorrect.defaultMessage,
        path: ['electPerson', 'electedPersonNationalId'],
      },
    ),

  applicantPhone: z.string().refine((v) => isValidPhoneNumber(v), {
    params: m.errorPhoneNumber,
  }),
  applicantEmail: customZodError(z.string().email(), m.errorEmail),
  applicantRelation: customZodError(z.string().min(1), m.errorRelation),
  assets: z.object({
    assets: z
      .object({
        assetNumber: z.string().refine(
          (v) => {
            return /^[Ff]{0,1}\d{7}$|^[Ll]{0,1}\d{6}$/.test(v)
          },
          { params: m.errorAssetNumber },
        ),
        share: z.number().optional(),
        initial: z.boolean().optional(),
        dummy: z.boolean().optional(),
        description: z.string().optional(),
      })
      .array()
      .optional(),
    encountered: z.boolean().optional(),
  }),
  estateMembers: z.object({
    members: z
      .object({
        initial: z.boolean().optional(),
        name: z.string().min(1),
        relation: customZodError(z.string().min(1), m.errorRelation),
        nationalId: z.string().optional(),
        custodian: z.string().length(10).optional(),
        foreignCitizenship: z.string().array().min(0).max(1).optional(),
        dateOfBirth: z.string().min(1).optional(),
        dummy: z.boolean().optional(),
      })
      .array()
      .optional(),
    encountered: z.boolean().optional(),
  }),
  flyers: asset,
  ships: asset,
  vehicles: z.object({
    vehicles: asset,
    encountered: z.boolean().optional(),
  }),
})
