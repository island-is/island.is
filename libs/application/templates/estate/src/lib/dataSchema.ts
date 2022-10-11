import * as z from 'zod'
import { m } from './messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { customZodError } from './utils/customZodError'
import { EstateTypes, YES, NO } from './constants'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const asset = z
  .object({
    assetNumber: customZodError(z.string().nonempty(), m.errorNumberEmpty),
    description: z.string().optional(),
    initial: z.boolean(),
  })
  .array()
  .optional()

export const estateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),

  // Initial estate info
  estate: z.object({
    estateMembers: z
      .object({
        name: z.string().nonempty(),
        relation: customZodError(z.string().nonempty(), m.errorRelation),
        nationalId: z.string().optional(),
        custodian: z.string().length(10).optional(),
        foreignCitizenship: z.string().array().min(0).max(1).optional(),
        dateOfBirth: z.string().nonempty().optional(),
        initial: z.boolean(),
      })
      .array()
      .optional(),

    assets: asset, // is: fasteignir
    flyers: asset,
    vehicles: asset,
    ships: asset,
    knowledgeOfOtherWills: z.enum(['yes', 'no']),
    caseNumber: z.string().nonempty(),
    dateOfDeath: z.date(),
    nameOfDeceased: z.string().nonempty(),
    nationalIdOfDeceased: z.string().length(10),
    districtCommissionerHasWill: z.boolean(),
  }),

  //Applicant's info
  applicant: z.object({
    name: z.string(),
    nationalId: z.string(),
    phone: z.string().refine((v) => isValidPhoneNumber(v), {
      params: m.errorPhoneNumber,
    }),
    email: customZodError(z.string().email(), m.errorEmail),
    address: z.string(),
  }),

  //Estate members info
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
        dummy: z.boolean().optional(),
      })
      .array()
      .optional(),
    encountered: z.boolean().optional(),
  }),

  selectedEstate: z.enum([
    EstateTypes.officialEstate,
    EstateTypes.noPropertyEstate,
    EstateTypes.residencePermit,
  ]),
  // is: innbú
  inventory: z.string().optional(),
  inventoryValue: z.string().optional(),

  bankAccounts: z
    .object({
      accountNumber: z.string().nonempty(),
      balance: z.string().nonempty(),
    })
    .array()
    .optional(),

  stocks: z
    .object({
      organization: z.string().nonempty(),
      ssn: z.string().length(10),
      faceValue: z.string().nonempty(), // is: nafnverð
      rateOfExchange: z.string().nonempty(), // is: gengi
      value: z.string().nonempty(),
    })
    .array()
    .optional(),

  // is: Peningar og bankahólf
  moneyAndDepositBoxesInfo: z.string().optional(),
  moneyAndDepositBoxesValue: z.string().optional(),

  otherAssets: z.string().optional(),
  otherAssetsValue: z.string().optional(),

  debts: z
    .object({
      creditorName: z.string().nonempty(), // is: kröfuhafi
      ssn: z.string().length(10),
      balance: z.string().nonempty(),
    })
    .array()
    .optional(),
  acceptDebts: z.array(z.enum([YES, NO])).optional(),

  // is: Heimild til setu í óskiptu búi skv. erfðaskrá
  undividedEstateResidencePermission: z.enum([YES, NO]),

  // is: Hefur umsækjandi forræði á búi?
  applicantHasLegalCustodyOverEstate: z.enum([YES, NO]),
})
