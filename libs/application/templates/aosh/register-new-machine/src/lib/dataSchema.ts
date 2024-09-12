import { NO, YES } from '@island.is/application/types'
import { z } from 'zod'
import { NEW, USED } from '../shared/types'
import * as kennitala from 'kennitala'

const PersonInformationSchema = z.object({
  name: z.string().min(1),
  nationalId: z
    .string()
    .refine((nationalId) => nationalId && kennitala.isValid(nationalId)),
  address: z.string().min(1),
  postCode: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().min(1),
})

const RemovablePersonInformationSchema = z.object({
  name: z.string().optional(),
  nationalId: z.string().optional(),
  address: z.string().optional(),
  postCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
})

const BasicInformationSchema = z.object({
  productionCountry: z.string().min(1),
  productionYear: z.string().min(1),
  productionNumber: z.string().min(1),
  markedCE: z.enum([YES, NO]),
  preRegistration: z.enum([YES, NO]).refine((v) => v.length > 0),
  isUsed: z.enum([NEW, USED]),
  location: z.string().min(1),
  cargoFileNumber: z.string().min(1),
})

const AboutMachineSchema = z.object({
  type: z.string().optional(),
  model: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  registrationNumberPrefix: z.string().optional(),
  fromService: z.boolean().optional(),
})

const TechInfoSchema = z.object({
  value: z.string().optional(),
  variableName: z.string().optional(),
  label: z.string().optional(),
})

export const NewMachineAnswersSchema = z.object({
  approveExternalData: z.boolean(),
  importerInformation: z
    .object({
      importer: PersonInformationSchema,
      isOwnerOtherThanImporter: z.enum([YES, NO]),
      owner: RemovablePersonInformationSchema.optional(),
    })
    .refine(
      ({ isOwnerOtherThanImporter, owner }) => {
        if (isOwnerOtherThanImporter === NO) return true
        return owner && owner.name && owner.name.length > 0
      },
      {
        path: ['owner', 'name'],
      },
    )
    .refine(
      ({ isOwnerOtherThanImporter, owner }) => {
        if (isOwnerOtherThanImporter === NO) return true
        return (
          owner &&
          owner.nationalId &&
          owner.nationalId.length > 0 &&
          kennitala.isValid(owner.nationalId)
        )
      },
      {
        path: ['owner', 'nationalId'],
      },
    )
    .refine(
      ({ isOwnerOtherThanImporter, owner }) => {
        if (isOwnerOtherThanImporter === NO) return true
        return owner && owner.address && owner.address.length > 0
      },
      {
        path: ['owner', 'address'],
      },
    )
    .refine(
      ({ isOwnerOtherThanImporter, owner }) => {
        if (isOwnerOtherThanImporter === NO) return true
        return owner && owner.postCode && owner.postCode.length > 0
      },
      {
        path: ['owner', 'postCode'],
      },
    )
    .refine(
      ({ isOwnerOtherThanImporter, owner }) => {
        if (isOwnerOtherThanImporter === NO) return true
        return owner && owner.phone && owner.phone.length > 0
      },
      {
        path: ['owner', 'phone'],
      },
    )
    .refine(
      ({ isOwnerOtherThanImporter, owner }) => {
        if (isOwnerOtherThanImporter === NO) return true
        return owner && owner.email && owner.email.length > 0
      },
      {
        path: ['owner', 'email'],
      },
    ),
  operatorInformation: z
    .object({
      operator: RemovablePersonInformationSchema.optional(),
      hasOperator: z.enum([YES, NO]),
    })
    .refine(
      ({ hasOperator, operator }) => {
        if (hasOperator === NO) return true
        return operator && operator.name && operator.name.length > 0
      },
      {
        path: ['operator', 'name'],
      },
    )
    .refine(
      ({ hasOperator, operator }) => {
        if (hasOperator === NO) return true
        return (
          operator &&
          operator.nationalId &&
          operator.nationalId.length > 0 &&
          kennitala.isValid(operator.nationalId)
        )
      },
      {
        path: ['operator', 'nationalId'],
      },
    )
    .refine(
      ({ hasOperator, operator }) => {
        if (hasOperator === NO) return true
        return operator && operator.address && operator.address.length > 0
      },
      {
        path: ['operator', 'address'],
      },
    )
    .refine(
      ({ hasOperator, operator }) => {
        if (hasOperator === NO) return true
        return operator && operator.postCode && operator.postCode.length > 0
      },
      {
        path: ['operator', 'postCode'],
      },
    )
    .refine(
      ({ hasOperator, operator }) => {
        if (hasOperator === NO) return true
        return operator && operator.phone && operator.phone.length > 0
      },
      {
        path: ['operator', 'phone'],
      },
    )
    .refine(
      ({ hasOperator, operator }) => {
        if (hasOperator === NO) return true
        return operator && operator.email && operator.email.length > 0
      },
      {
        path: ['operator', 'email'],
      },
    ),
  machine: z.object({
    machineType: z
      .object({
        type: z.string().optional(),
        model: z.string().optional(),
      })
      .optional(),
    aboutMachine: AboutMachineSchema.optional(),
    basicInformation: BasicInformationSchema.optional(),
    streetRegistration: z
      .object({
        registerToTraffic: z.enum([YES, NO]),
        size: z.enum(['1', '2', '3']),
      })
      .optional(),
  }),
  techInfo: z.array(TechInfoSchema),
})

export type NewMachineAnswers = z.TypeOf<typeof NewMachineAnswersSchema>
export type PersonInformation = z.TypeOf<typeof PersonInformationSchema>
export type BasicInformation = z.TypeOf<typeof BasicInformationSchema>
export type AboutMachine = z.TypeOf<typeof AboutMachineSchema>
export type TechInfo = z.TypeOf<typeof TechInfoSchema>
