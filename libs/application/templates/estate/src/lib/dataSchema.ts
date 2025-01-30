import * as z from 'zod'
import { m } from './messages'
import { EstateTypes, YES, NO } from './constants'
import * as kennitala from 'kennitala'
import {
  customZodError,
  isNumericalString,
  isValidEmail,
  isValidPhoneNumber,
  isValidString,
} from './utils'

const asset = z
  .object({
    assetNumber: z.string(),
    description: z.string(),
    marketValue: z.string(),
    initial: z.boolean(),
    enabled: z.boolean(),
    share: z.number(),
  })
  .refine(
    ({ enabled, marketValue }) => {
      return enabled ? marketValue !== '' : true
    },
    {
      path: ['marketValue'],
    },
  )
  .refine(
    ({ enabled, assetNumber }) => {
      return enabled ? isValidString(assetNumber) : true
    },
    {
      path: ['assetNumber'],
    },
  )
  .refine(
    ({ share }) => {
      return share ? share > 0 && share <= 100 : true
    },
    {
      path: ['share'],
    },
  )
  .refine(
    ({ enabled, description }) => {
      return enabled ? isValidString(description) : true
    },
    {
      path: ['description'],
    },
  )
  .array()
  .optional()

const fileSchema = z.object({
  name: z.string(),
  key: z.string(),
  url: z.string().optional(),
})

export const estateSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  preApproveExternalData: z.boolean().refine((v) => v),

  // Applicant
  applicant: z.object({
    name: z.string(),
    nationalId: z.string(),
    phone: z.string().refine((v) => isValidPhoneNumber(v), {
      params: m.errorPhoneNumber,
    }),
    email: customZodError(z.string().email(), m.errorEmail),
    address: z.string(),
    relationToDeceased: z.string().optional(),
    autonomous: z
      .enum([YES, NO])
      .optional()
      .refine((v) => v !== NO, {
        params: m.errorNotAutonmous,
      }),
  }),

  selectedEstate: z.enum([
    EstateTypes.officialDivision,
    EstateTypes.estateWithoutAssets,
    EstateTypes.permitForUndividedEstate,
    EstateTypes.divisionOfEstateByHeirs,
  ]),

  estateInfoSelection: z.string().min(1),

  // Eignir
  estate: z.object({
    estateMembers: z
      .object({
        name: z.string(),
        relation: customZodError(z.string().min(1), m.errorRelation),
        relationWithApplicant: z.string().nullish(),
        nationalId: z.string().optional(),
        custodian: z.string().length(10).optional(),
        noContactInfo: z
          .array(z.union([z.literal(YES), z.literal(NO)]))
          .optional(),
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
        ({ foreignCitizenship, nationalId }) => {
          return !foreignCitizenship?.length
            ? nationalId && kennitala.isValid(nationalId)
            : true
        },
        {
          path: ['nationalId'],
        },
      )

      /* Validating email and phone of member depending on whether the field is 
          enabled and whether member has advocate */
      .refine(
        ({ enabled, advocate, phone, noContactInfo }) => {
          return enabled && noContactInfo?.[0] !== YES && !advocate
            ? isValidPhoneNumber(phone)
            : true
        },
        {
          path: ['phone'],
        },
      )
      .refine(
        ({ enabled, advocate, email, noContactInfo }) => {
          return enabled && !advocate && noContactInfo?.[0] !== YES
            ? isValidEmail(email)
            : true
        },
        {
          path: ['email'],
        },
      )

      /* validation for advocates */
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
        return selection === YES
          ? spouse?.nationalId && kennitala.isValid(spouse?.nationalId)
          : true
      },
      {
        path: ['spouse', 'nationalId'],
      },
    ),

  // is: Innbú
  inventory: z
    .object({
      info: z.string(),
      value: z.string(),
    })
    .refine(
      ({ info, value }) => {
        return info !== '' ? value !== '' : true
      },
      {
        path: ['value'],
      },
    )
    .refine(
      ({ info, value }) => {
        return value !== '' ? isValidString(info) : true
      },
      {
        path: ['info'],
      },
    )
    .optional(),

  // is: Innistæður í bönkum
  bankAccounts: z
    .object({
      accountNumber: z.string(),
      balance: z.string(),
      total: z.number().optional(),
    })
    .refine(
      ({ accountNumber, balance }) => {
        return accountNumber !== '' ? isValidString(balance) : true
      },
      {
        path: ['balance'],
      },
    )
    .refine(
      ({ accountNumber, balance }) => {
        return balance !== '' ? accountNumber !== '' : true
      },
      {
        path: ['accountNumber'],
      },
    )
    .array()
    .optional(),

  // is: Verðbréf og kröfur
  claims: z
    .object({
      publisher: z.string(),
      value: z.string(),
      nationalId: z.string().optional(),
    })
    .refine(
      ({ publisher, value }) => {
        return publisher !== '' ? isValidString(value) : true
      },
      {
        path: ['value'],
      },
    )
    .refine(
      ({ publisher, value }) => {
        return value !== '' ? isValidString(publisher) : true
      },
      {
        path: ['publisher'],
      },
    )
    .refine(
      ({ nationalId }) => {
        return nationalId && nationalId !== ''
          ? kennitala.isValid(nationalId)
          : true
      },
      {
        path: ['nationalId'],
      },
    )
    .array()
    .optional(),

  // is: Hlutabréf
  stocks: z
    .object({
      organization: z.string(),
      nationalId: z.string().optional(),
      faceValue: z.string(),
      rateOfExchange: z.string(),
      value: z.string().optional(),
    })
    /* ---- Validating whether the fields are either all filled out or all empty ---- */
    .refine(
      // only validate nationalId if it is not empty
      ({ nationalId }) => {
        return nationalId !== ''
          ? nationalId && kennitala.isValid(nationalId)
          : true
      },
      {
        path: ['nationalId'],
      },
    )
    .refine(
      ({ organization, nationalId, faceValue, rateOfExchange }) => {
        return nationalId !== '' || faceValue !== '' || rateOfExchange !== ''
          ? isValidString(organization)
          : true
      },
      {
        path: ['organization'],
      },
    )
    .refine(
      ({ organization, nationalId, faceValue, rateOfExchange }) => {
        return organization !== '' || nationalId !== '' || rateOfExchange !== ''
          ? isNumericalString(faceValue)
          : true
      },
      {
        path: ['faceValue'],
      },
    )
    .refine(
      ({ organization, nationalId, faceValue, rateOfExchange }) => {
        return nationalId !== '' || faceValue !== '' || organization !== ''
          ? isNumericalString(rateOfExchange)
          : true
      },
      {
        path: ['rateOfExchange'],
      },
    )
    .array()
    .optional(),

  // is: Peningar og bankahólf
  moneyAndDeposit: z
    .object({
      info: z.string(),
      value: z.string(),
    })
    .refine(
      ({ info, value }) => {
        return info !== '' ? value !== '' : true
      },
      {
        path: ['value'],
      },
    )
    .refine(
      ({ info, value }) => {
        return value !== '' ? isValidString(info) : true
      },
      {
        path: ['info'],
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
      ({ info }) => {
        return !!info
      },
      {
        path: ['info'],
      },
    )
    .refine(
      ({ value }) => {
        return !!value
      },
      {
        path: ['value'],
      },
    )
    .array()
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
    .refine(
      ({ creditorName, nationalId, balance, loanIdentity }) => {
        return nationalId !== '' || creditorName !== '' || balance !== ''
          ? isValidString(loanIdentity)
          : true
      },
      {
        path: ['loanIdentity'],
      },
    )
    .refine(
      ({ creditorName, nationalId, balance, loanIdentity }) => {
        return nationalId !== '' || creditorName !== '' || loanIdentity !== ''
          ? isValidString(balance)
          : true
      },
      {
        path: ['balance'],
      },
    )
    .refine(
      ({ creditorName, nationalId, balance, loanIdentity }) => {
        return nationalId !== '' || balance !== '' || loanIdentity !== ''
          ? isValidString(creditorName)
          : true
      },
      {
        path: ['creditorName'],
      },
    )
    .array()
    .optional(),
  acceptDebts: z.array(z.enum([YES, NO])).nonempty(),

  // is: Umboðsmaður
  representative: z
    .object({
      name: z.string().optional(),
      nationalId: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
    })
    /* ---- Validating whether the fields are either all filled out or all empty ---- */
    .refine(
      ({ name, nationalId, phone, email }) => {
        return !!name || !!nationalId || !!phone
          ? email && isValidEmail(email)
          : true
      },
      {
        path: ['email'],
      },
    )
    .refine(
      ({ name, nationalId, phone, email }) => {
        return !!name || !!nationalId || !!email
          ? phone && isValidPhoneNumber(phone)
          : true
      },
      {
        path: ['phone'],
      },
    )
    .refine(
      ({ name, nationalId, phone, email }) => {
        return !!name || !!phone || !!email
          ? nationalId &&
              kennitala.isPerson(nationalId) &&
              kennitala.info(nationalId).age >= 18
          : true
      },
      {
        path: ['nationalId'],
      },
    )
    .refine(
      ({ name, nationalId, phone, email }) => {
        return !!phone || !!email || !!nationalId ? isValidString(name) : true
      },
      {
        path: ['name'],
      },
    )
    .optional(),
  estateAttachments: z.object({
    attached: z.object({
      file: z.array(fileSchema),
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
  confirmActionAssetsAndDebt: z.array(z.enum([YES])).length(1),
  confirmActionUndividedEstate: z.array(z.enum([YES])).length(1),
})
