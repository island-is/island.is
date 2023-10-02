import * as z from 'zod'
import { m } from './messages'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { customZodError } from './utils/customZodError'
import { EstateTypes, YES, NO } from './constants'
import * as kennitala from 'kennitala'

const isValidPhoneNumber = (phoneNumber: string) => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone && phone.isValid()
}

const emailRegex =
  /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
export const isValidEmail = (value: string) => emailRegex.test(value)

const checkIfFilledOut = (arr: Array<string | undefined>) => {
  if (arr.every((v) => v === '' || v === undefined)) {
    return true
  } else if (arr.every((v) => v !== '' && v !== undefined)) {
    return true
  } else {
    return false
  }
}

const asset = z
  .object({
    assetNumber: z.string(),
    description: z.string(),
    marketValue: z.string(),
    initial: z.boolean(),
    enabled: z.boolean(),
    share: z.number().optional(),
  })
  .refine(
    ({ enabled, marketValue }) => {
      return enabled ? marketValue !== '' : true
    },
    {
      path: ['marketValue'],
    },
  )
  .array()
  .optional()

const FileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

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
    EstateTypes.officialDivision,
    EstateTypes.estateWithoutAssets,
    EstateTypes.permitForUndividedEstate,
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
        dateOfBirth: z.string().optional(),
        initial: z.boolean(),
        enabled: z.boolean(),
        phone: z.string(),
        email: z.string(),
        // Málsvari
        advocate: z
          .object({
            name: z.string(),
            nationalId: z.string(),
            phone: z.string(),
            email: z.string(),
          })
          .optional(),
      })
      .refine(
        ({ nationalId, advocate }) => {
          return kennitala.info(nationalId as string).age < 18 ? advocate : true
        },
        {
          path: ['nationalId'],
        },
      )

      /* Validating email and phone depending on whether the field is enabled */
      .refine(
        ({ enabled, phone }) => {
          console.log(enabled, isValidPhoneNumber(phone))
          return enabled ? isValidPhoneNumber(phone) : true
        },
        {
          path: ['phone'],
        },
      )
      .refine(
        ({ enabled, email }) => {
          return enabled ? isValidEmail(email) : true
        },
        {
          path: ['email'],
        },
      )

      /* phone and email validation for advocates */
      .refine(
        ({ enabled, advocate }) => {
          return enabled && advocate ? isValidPhoneNumber(advocate.phone) : true
        },
        {
          path: ['advocate', 'phone'],
        },
      )
      .refine(
        ({ enabled, advocate }) => {
          return enabled && advocate ? isValidEmail(advocate.email) : true
        },
        {
          path: ['advocate', 'email'],
        },
      )
      .array()
      .optional(),
    assets: asset,
    flyers: asset,
    vehicles: asset,
    ships: asset,
    guns: asset,
    knowledgeOfOtherWills: z.enum([YES, NO]).optional(),
    addressOfDeceased: z.string().optional(),
    caseNumber: z.string().min(1).optional(),
    dateOfDeath: z.date().optional(),
    nameOfDeceased: z.string().min(1).optional(),
    nationalIdOfDeceased: z.string().optional(),
    districtCommissionerHasWill: z.boolean().optional(),
    testament: z
      .object({
        wills: z.enum([YES, NO]),
        agreement: z.enum([YES, NO]),
        dividedEstate: z.enum([YES, NO]).optional(),
        additionalInfo: z.string().optional(),
      })
      .optional(),
  }),

  // is: Maki hins látna
  deceasedWithUndividedEstate: z
    .object({
      selection: z.enum([YES, NO]),
      spouse: z
        .object({
          name: z.string().optional(),
          nationalId: z.string().optional(),
        })
        .optional(),
    })
    .refine(
      ({ selection, spouse }) => {
        return selection === YES ? !!spouse?.nationalId : true
      },
      {
        path: ['spouse', 'nationalId'],
      },
    ),

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
    .refine(
      ({ nationalId }) => {
        return nationalId === ''
          ? true
          : nationalId && kennitala.isValid(nationalId)
      },
      {
        params: m.errorNationalIdIncorrect,
        path: ['nationalId'],
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
      loanIdentity: z.string().optional(),
    })
    .refine(
      ({ nationalId }) => {
        return nationalId === ''
          ? true
          : nationalId && kennitala.isValid(nationalId)
      },
      {
        params: m.errorNationalIdIncorrect,
        path: ['nationalId'],
      },
    )
    .array()
    .optional(),
  acceptDebts: z.array(z.enum([YES, NO])).nonempty(),

  // is: Umboðsmaður
  representative: z
    .object({
      name: z.string().or(z.undefined()),
      nationalId: z.string().or(z.undefined()),
      phone: z.string(),
      email: z.string(),
    })
    .refine(
      ({ name, nationalId, phone, email }) => {
        const isAllEmpty = checkIfFilledOut([name, nationalId, phone, email])
        return isAllEmpty ? true : name && name.length > 1
      },
      {
        path: ['name'],
      },
    )
    .refine(
      ({ name, nationalId, phone, email }) => {
        const isAllEmpty = checkIfFilledOut([name, nationalId, phone, email])
        return isAllEmpty ? true : nationalId && kennitala.isPerson(nationalId)
      },
      {
        path: ['nationalId'],
      },
    )
    .optional(),

  estateAttachments: z.object({
    attached: z.object({
      file: z.array(FileSchema),
    }),
  }),

  // is: Eignalaust bú
  estateWithoutAssets: z
    .object({
      estateAssetsExist: z.enum([YES, NO]),
      estateDebtsExist: z.enum([YES, NO]).optional(),
    })
    .refine(
      ({ estateAssetsExist, estateDebtsExist }) => {
        return estateAssetsExist === YES
          ? estateDebtsExist === YES || estateDebtsExist === NO
          : true
      },
      {
        path: ['estateDebtsExist'],
      },
    ),

  confirmAction: z.array(z.enum([YES])).length(1),
})
