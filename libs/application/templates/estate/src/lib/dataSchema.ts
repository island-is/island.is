import * as z from 'zod'
import { m } from './messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { customZodError } from './utils/customZodError'
import { EstateTypes, YES, NO } from './constants'
import * as kennitala from 'kennitala'
import { formatBankInfo } from '@island.is/application/ui-components'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const asset = z
  .object({
    assetNumber: customZodError(z.string().min(1), m.errorNumberEmpty),
    description: z.string().optional(),
    initial: z.boolean(),
    enabled: z.boolean(),
    dummy: z.boolean().optional(),
    share: z.number().optional(),
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
    EstateTypes.divisionOfEstate,
    EstateTypes.estateWithoutAssets,
    EstateTypes.permitToPostponeEstateDivision,
    EstateTypes.divisionOfEstateByHeirs,
  ]),

  // Eignir
  estate: z.object({
    estateMembers: z
      .object({
        name: z.string().min(1),
        relation: customZodError(z.string().min(1), m.errorRelation),
        nationalId: z
          .string()
          .refine((x) => kennitala.info(x).age >= 18)
          .optional(),
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
    knowledgeOfOtherWills: z.enum([YES, NO]).optional(),
    caseNumber: z.string().min(1).optional(),
    dateOfDeath: z.date().optional(),
    nameOfDeceased: z.string().min(1).optional(),
    nationalIdOfDeceased: z.string().optional(),
    districtCommissionerHasWill: z.boolean().optional(),
  }),

  // is: Innbú
  inventory: z.string().optional(),
  inventoryValue: z.string().optional(),

  // is: Innistæður í bönkum
  bankAccounts: z
    .object({
      accountNumber: z
        .string()
        .refine((v) => {
          if (v !== '') {
            const bankAccount = formatBankInfo(v)
            return bankAccount.length === 14
          } else return true
        })
        .optional(),
      balance: z.string().optional(),
    })
    .refine(({ accountNumber, balance }) => {
      if (accountNumber !== '' && balance !== '') {
        return true
      } else if (accountNumber === '' && balance === '') {
        return true
      } else {
        return false
      }
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
      ssn: z.string().optional(),
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
      ssn: z.string().optional(),
      balance: z.string().optional(),
    })
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
    .optional(),

  // is: Heimild til setu í óskiptu búi skv. erfðaskrá
  undividedEstateResidencePermission: z.enum([YES, NO]),

  // is: Hefur umsækjandi forræði á búi?
  applicantHasLegalCustodyOverEstate: z.enum([YES, NO]),

  readTerms: z.array(z.enum([YES])).length(1),
})
