import { z } from 'zod'
import * as nationalId from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { m } from './messages'
import { RoleConfirmationEnum } from '../types'

import { customZodError } from './utils/customZodError'
import { NO, YES } from '@island.is/application/core'

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
        nationalId: z.string(),
        name: z.string(),
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
          ? electPerson.name !== '' && electPerson.nationalId !== ''
          : !electPerson
          ? true
          : roleConfirmation === RoleConfirmationEnum.CONTINUE
          ? true
          : false,
      {
        message: m.errorNationalIdNoName.defaultMessage,
        path: ['electPerson', 'nationalId'],
      },
    )
    .refine(
      ({ roleConfirmation, electPerson }) =>
        roleConfirmation === RoleConfirmationEnum.DELEGATE && !!electPerson
          ? electPerson.nationalId &&
            nationalId.isPerson(electPerson.nationalId) &&
            nationalId.info(electPerson.nationalId).age >= 18
          : !electPerson
          ? true
          : roleConfirmation === RoleConfirmationEnum.CONTINUE
          ? true
          : false,
      {
        message: m.errorNationalIdIncorrect.defaultMessage,
        path: ['electPerson', 'nationalId'],
      },
    ),

  applicantPhone: z.string().refine((v) => isValidPhoneNumber(v), {
    params: m.errorPhoneNumber,
  }),
  applicantEmail: customZodError(z.string().email(), m.errorEmail),
  applicantRelation: customZodError(z.string().min(1), m.errorRelation),
  hadFirearms: z.enum([YES, NO]),
  firearmApplicant: z
    .object({
      nationalId: z.string().refine((v) => nationalId.isPerson(v)),
      name: z.string(),
      phone: z.string().refine((v) => isValidPhoneNumber(v), {
        params: m.errorPhoneNumber,
      }),
      email: customZodError(z.string().email(), m.errorEmail),
    })
    .optional(),
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
      .refine(
        ({ name, relation, nationalId, foreignCitizenship, dateOfBirth }) => {
          const hasNameAndRelation = name && relation

          if (foreignCitizenship && foreignCitizenship.length !== 0) {
            return Boolean(dateOfBirth) && hasNameAndRelation
          } else {
            return Boolean(nationalId) && hasNameAndRelation
          }
        },
        {
          message: m.errorNoDateOfBirthProvided.defaultMessage,
          path: ['dateOfBirth'],
        },
      )
      .array()
      .optional(),
    encountered: z.boolean().optional(),
    confirmation: z.array(z.enum([YES])).length(1),
  }),
  flyers: asset,
  ships: asset,
  vehicles: z.object({
    vehicles: asset,
    encountered: z.boolean().optional(),
  }),
  certificateOfDeathAnnouncement: z
    .string()
    .refine((val) => val && val.length > 0, {
      params: m.errorSelectRecipient,
    }),
  authorizationForFuneralExpenses: z
    .string()
    .refine((val) => val && val.length > 0, {
      params: m.errorSelectRecipient,
    }),
  financesDataCollectionPermission: z
    .string()
    .refine((val) => val && val.length > 0, {
      params: m.errorSelectRecipient,
    }),
})

export type AnnouncementOfDeath = z.TypeOf<typeof dataSchema>
