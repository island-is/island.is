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
    enabled: z.boolean(),
    dummy: z.boolean().optional(),
  })
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
    EstateTypes.officialEstate,
    EstateTypes.noPropertyEstate,
    EstateTypes.residencePermit,
  ]),

  // Eignir
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
        enabled: z.boolean(),
        dummy: z.boolean().optional(),
      })
      .array()
      .optional(),

    assets: asset,
    flyers: asset,
    vehicles: asset,
    ships: asset,
    knowledgeOfOtherWills: z.enum([YES, NO]).optional(),
    caseNumber: z.string().nonempty().optional(),
    dateOfDeath: z.date().optional(),
    nameOfDeceased: z.string().nonempty().optional(),
    nationalIdOfDeceased: z.string().length(10).optional(),
    districtCommissionerHasWill: z.boolean().optional(),
  }),

  // is: Innbú
  inventory: z.string().optional(),
  inventoryValue: z.string().optional(),

  // is: Innistæður í bönkum
  bankAccounts: z
    .object({
      accountNumber: z.string().optional(),
      balance: z.string().optional(),
    })
    .array()
    .optional(),

  // is: Verðbréf og kröfur
  claims: z
    .object({
      publisher: z.string().optional(),
      value: z.string().optional(),
    })
    .array()
    .optional(),

  // is: Hlutabréf
  stocks: z
    .object({
      organization: z.string().optional(),
      ssn: z.string().length(10).optional(),
      faceValue: z.string().optional(),
      rateOfExchange: z.string().optional(),
      value: z.string().optional(),
    })
    .array()
    .optional(),

  // is: Peningar og bankahólf
  moneyAndDepositBoxesInfo: z.string().optional(),
  moneyAndDepositBoxesValue: z.string().optional(),

  // is: Aðrar eignir
  otherAssets: z.string().optional(),
  otherAssetsValue: z.string().optional(),

  // is: Skuldir
  debts: z
    .object({
      creditorName: z.string().optional(),
      ssn: z.string().length(10).optional(),
      balance: z.string().optional(),
    })
    .array()
    .optional(),
  acceptDebts: z.array(z.enum([YES, NO])).optional(),

  // is: Heimild til setu í óskiptu búi skv. erfðaskrá
  undividedEstateResidencePermission: z.enum([YES, NO]),

  // is: Hefur umsækjandi forræði á búi?
  applicantHasLegalCustodyOverEstate: z.enum([YES, NO]),
})
