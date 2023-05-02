import * as z from 'zod'
import { m } from './messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { customZodError } from './utils/customZodError'
import { EstateTypes, YES, NO } from './constants'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const checkIfFilledOut = (arr: Array<string | undefined>) => {
  if (arr.every((v) => v === '')) {
    return true
  } else if (arr.every((v) => v !== '')) {
    return true
  } else {
    return false
  }
}

const asset = z
  .object({
    assetNumber: z.string().optional(),
    description: z.string().optional(),
    marketValue: z.string().optional(),
    initial: z.boolean(),
    enabled: z.boolean(),
    dummy: z.boolean().optional(),
    share: z.number().optional(),
  })
  .refine(
    ({ assetNumber, description }) => {
      return checkIfFilledOut([assetNumber, description])
    },
    {
      params: m.fillOutRates,
      path: ['assetNumber'],
    },
  )
  .array()
  .optional()

export const estateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),

  // Applicant
  applicant: z.object({
    name: z.string(),
    nationalId: z.string(),
    phone: z.string().refine((v) => isValidPhoneNumber(v), {
      params: m.errorPhoneNumber,
    }),
    email: customZodError(z.string().email(), m.errorEmail),
    address: z.string(),
  }),

  selectedEstate: z.enum([
    EstateTypes.divisionOfEstate,
    EstateTypes.estateWithoutAssets,
    EstateTypes.permitToPostponeEstateDivision,
    EstateTypes.divisionOfEstateByHeirs,
  ]),

  // Eignir
  estate: z.object({
    estateMembers: z
      .object({
        name: z.string(),
        relation: customZodError(z.string().min(1), m.errorRelation),
        nationalId: z.string().optional(),
        custodian: z.string().length(10).optional(),
        foreignCitizenship: z.string().array().min(0).max(1).optional(),
        dateOfBirth: z.string().min(1).optional(),
        initial: z.boolean(),
        enabled: z.boolean(),
        dummy: z.boolean().optional(),
      })
      .array()
      .optional(),
    assets: asset,
    flyers: asset,
    vehicles: asset,
    ships: asset,
    guns: asset,
    knowledgeOfOtherWills: z.enum([YES, NO]).optional(),
    caseNumber: z.string().min(1).optional(),
    dateOfDeath: z.date().optional(),
    nameOfDeceased: z.string().min(1).optional(),
    nationalIdOfDeceased: z.string().optional(),
    districtCommissionerHasWill: z.boolean().optional(),
  }),

  // is: Innbú
  inventory: z
    .object({
      info: z.string().optional(),
      value: z.string().optional(),
    })
    .refine(
      ({ info, value }) => {
        return checkIfFilledOut([info, value])
      },
      {
        params: m.fillOutRates,
        path: ['value'],
      },
    )
    .optional(),

  // is: Innistæður í bönkum
  bankAccounts: z
    .object({
      accountNumber: z.string().optional(),
      balance: z.string().optional(),
    })
    .refine(
      ({ accountNumber, balance }) => {
        return checkIfFilledOut([accountNumber, balance])
      },
      {
        params: m.fillOutRates,
        path: ['balance'],
      },
    )
    .array()
    .optional(),

  // is: Verðbréf og kröfur
  claims: z
    .object({
      publisher: z.string().optional(),
      value: z.string().optional(),
    })
    .refine(
      ({ publisher, value }) => {
        return checkIfFilledOut([publisher, value])
      },
      {
        params: m.fillOutRates,
        path: ['value'],
      },
    )
    .array()
    .optional(),

  // is: Hlutabréf
  stocks: z
    .object({
      organization: z.string().optional(),
      nationalId: z.string().optional(),
      faceValue: z.string().optional(),
      rateOfExchange: z.string().optional(),
      value: z.string().optional(),
    })
    .refine(
      ({ organization, nationalId, value }) => {
        return checkIfFilledOut([organization, nationalId, value])
      },
      {
        params: m.fillOutRates,
        path: ['value'],
      },
    )
    .array()
    .optional(),

  // is: Peningar og bankahólf
  moneyAndDeposit: z
    .object({
      info: z.string().optional(),
      value: z.string().optional(),
    })
    .refine(
      ({ info, value }) => {
        return checkIfFilledOut([info, value])
      },
      {
        params: m.fillOutRates,
        path: ['value'],
      },
    )
    .optional(),

  // is: Aðrar eignir
  otherAssets: z
    .object({
      info: z.string().optional(),
      value: z.string().optional(),
    })
    .refine(
      ({ info, value }) => {
        return checkIfFilledOut([info, value])
      },
      {
        params: m.fillOutRates,
        path: ['value'],
      },
    )
    .optional(),

  // is: Skuldir
  debts: z
    .object({
      creditorName: z.string().optional(),
      nationalId: z.string().optional(),
      balance: z.string().optional(),
    })
    .refine(
      ({ creditorName, nationalId, balance }) => {
        return checkIfFilledOut([creditorName, nationalId, balance])
      },
      {
        params: m.fillOutRates,
        path: ['balance'],
      },
    )
    .array()
    .optional(),
  acceptDebts: z.array(z.enum([YES, NO])).nonempty(),

  // is: Umboðsmaður
  representative: z
    .object({
      representativeName: z.string().min(1).optional(),
      representativeNationalId: z.string().length(10).optional(),
      representativePhoneNumber: z
        .string()
        .refine((v) => isValidPhoneNumber(v), {
          params: m.errorPhoneNumber,
        })
        .optional(),
      representativeEmail: customZodError(
        z.string().email(),
        m.errorEmail,
      ).optional(),
    })
    .refine(
      ({
        representativeName,
        representativeNationalId,
        representativePhoneNumber,
        representativeEmail,
      }) => {
        return checkIfFilledOut([
          representativeName,
          representativeNationalId,
          representativePhoneNumber,
          representativeEmail,
        ])
      },
      {
        params: m.fillOutRates,
        path: ['balance'],
      },
    )
    .optional(),

  // is: Heimild til setu í óskiptu búi skv. erfðaskrá
  undividedEstateResidencePermission: z.enum([YES, NO]),

  // is: Hefur umsækjandi forræði á búi?
  applicantHasLegalCustodyOverEstate: z.enum([YES, NO]),

  readTerms: z.array(z.enum([YES])).length(1),
})
