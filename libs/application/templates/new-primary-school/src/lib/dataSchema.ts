import { NO, YES } from '@island.is/application/core'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { z } from 'zod'
import {
  ApplicationType,
  AttachmentOptions,
  LanguageEnvironmentOptions,
  PayerOption,
} from '../utils/constants'
import { errorMessages } from './messages'

const validatePhoneNumber = (value: string) => {
  const phoneNumber = parsePhoneNumberFromString(value, 'IS')
  return phoneNumber && phoneNumber.isValid()
}

const phoneNumberSchema = z
  .string()
  .refine((value) => validatePhoneNumber(value), {
    params: errorMessages.phoneNumber,
  })

const nationalIdWithNameSchema = z.object({
  name: z.string().min(1),
  nationalId: z.string().refine((nationalId) => kennitala.isValid(nationalId), {
    params: errorMessages.nationalId,
  }),
})

const nameEmailSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
  })
  .optional()

export const dataSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
  childNationalId: z.string().min(1),
  applicationType: z.nativeEnum(ApplicationType),
  childInfo: z
    .object({
      usePronounAndPreferredName: z.array(z.string()),
      preferredName: z.string().optional(),
      pronouns: z.array(z.string()).optional().nullable(),
    })
    .refine(
      ({ usePronounAndPreferredName, preferredName, pronouns }) =>
        usePronounAndPreferredName.includes(YES)
          ? !!preferredName || (pronouns && pronouns.length > 0)
          : true,
      { path: ['preferredName'] },
    )
    .refine(
      ({ usePronounAndPreferredName, pronouns, preferredName }) =>
        usePronounAndPreferredName.includes(YES)
          ? (!!pronouns && pronouns.length > 0) || !!preferredName
          : true,
      { path: ['pronouns'] },
    ),
  guardians: z.array(
    z
      .object({
        email: z.string().email(),
        phoneNumber: phoneNumberSchema,
        requiresInterpreter: z.array(z.string()),
        preferredLanguage: z.string().optional().nullable(),
      })
      .refine(
        ({ requiresInterpreter, preferredLanguage }) =>
          requiresInterpreter.includes(YES) ? !!preferredLanguage : true,
        {
          path: ['preferredLanguage'],
          params: errorMessages.languageRequired,
        },
      ),
  ),
  relatives: z
    .array(
      z
        .object({
          nationalIdWithName: nationalIdWithNameSchema,
          phoneNumber: phoneNumberSchema,
          relation: z.string(),
          applicantNationalId: z.string().optional(),
          otherGuardianNationalId: z.string().optional(),
        })
        .refine(
          ({
            nationalIdWithName,
            applicantNationalId,
            otherGuardianNationalId,
          }) =>
            nationalIdWithName?.nationalId !== applicantNationalId &&
            nationalIdWithName?.nationalId !== otherGuardianNationalId,
          {
            path: ['nationalIdWithName', 'nationalId'],
            params: errorMessages.relativeSameAsGuardian,
          },
        ),
    )
    .refine((r) => r === undefined || r.length > 0, {
      params: errorMessages.relativesRequired,
    }),
  currentNursery: z.object({
    municipality: z.string(),
    nursery: z.string(),
  }),
  reasonForApplication: z.object({
    reason: z.string(),
  }),
  counsellingRegardingApplication: z.object({
    counselling: z.string(),
    hasVisitedSchool: z.enum([YES, NO]),
  }),
  currentSchool: z
    .object({
      municipality: z.string().optional().nullable(),
      school: z.string().optional().nullable(),
    })
    .refine(
      ({ municipality, school }) =>
        !municipality || (school && school.length > 0),
      {
        path: ['school'],
      },
    )
    .optional(),
  newSchool: z.object({
    municipality: z.string(),
    school: z.string(),
  }),
  school: z.object({
    applyForPreferredSchool: z.enum([YES, NO]),
  }),
  siblings: z
    .array(
      z.object({
        nationalIdWithName: nationalIdWithNameSchema,
      }),
    )
    .refine((r) => r === undefined || r.length > 0, {
      params: errorMessages.siblingsRequired,
    }),
  startingSchool: z
    .object({
      expectedStartDate: z.string(),
      temporaryStay: z.string().min(1).optional(),
      expectedEndDate: z.string().optional(),
    })
    .refine(
      ({ expectedStartDate, expectedEndDate, temporaryStay }) =>
        !(
          temporaryStay === YES &&
          expectedEndDate &&
          new Date(expectedStartDate) > new Date(expectedEndDate)
        ),
      {
        path: ['expectedEndDate'],
        params: errorMessages.expectedEndDateMessage,
      },
    )
    .refine(
      ({ expectedEndDate, temporaryStay }) =>
        !(temporaryStay === YES && !expectedEndDate),
      {
        path: ['expectedEndDate'],
        params: errorMessages.expectedEndDateRequired,
      },
    ),
  languages: z
    .object({
      languageEnvironment: z.string(),
      signLanguage: z.enum([YES, NO]),
      selectedLanguages: z
        .array(z.object({ code: z.string().optional().nullable() }))
        .optional(),
      preferredLanguage: z.string().optional().nullable(),
    })
    .superRefine(({ languageEnvironment, selectedLanguages }, ctx) => {
      // LanguageEnvironment is stored as <id>::<option> in the DB
      const selectedLanguageEnvironment =
        languageEnvironment.split('::')[1] ?? ''

      const checkAndAddIssue = (index: number) => {
        // If required 2 languages but the second language field is still hidden
        // else check if applicant has selected a languages
        if (index === 1 && selectedLanguages?.length === 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: errorMessages.twoLanguagesRequired,
            path: ['selectedLanguages'],
          })
        } else if (!selectedLanguages?.[index]?.code) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: errorMessages.languageRequired,
            path: ['selectedLanguages', index, 'code'],
          })
        }
      }

      if (
        selectedLanguageEnvironment ===
        LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC
      ) {
        checkAndAddIssue(0)
      } else if (
        selectedLanguageEnvironment ===
        LanguageEnvironmentOptions.ICELANDIC_AND_OTHER
      ) {
        checkAndAddIssue(0)
        checkAndAddIssue(1)
      }
    })
    .refine(
      ({ languageEnvironment, selectedLanguages, preferredLanguage }) => {
        // LanguageEnvironment is stored as <id>::<option> in the DB
        const selectedLanguageEnvironment =
          languageEnvironment.split('::')[1] ?? ''

        if (
          (selectedLanguageEnvironment ===
            LanguageEnvironmentOptions.ONLY_OTHER_THAN_ICELANDIC &&
            !!selectedLanguages &&
            selectedLanguages?.length >= 1) ||
          (selectedLanguageEnvironment ===
            LanguageEnvironmentOptions.ICELANDIC_AND_OTHER &&
            !!selectedLanguages &&
            selectedLanguages?.length >= 2)
        ) {
          return !!preferredLanguage
        }

        return true
      },
      {
        path: ['preferredLanguage'],
        params: errorMessages.languageRequired,
      },
    ),
  healthProtection: z
    .object({
      hasFoodAllergiesOrIntolerances: z.array(z.string()),
      foodAllergiesOrIntolerances: z.array(z.string()).optional().nullable(),
      hasOtherAllergies: z.array(z.string()),
      otherAllergies: z.array(z.string()).optional().nullable(),
      usesEpiPen: z.string().optional(),
      hasConfirmedMedicalDiagnoses: z.enum([YES, NO]),
      requestsMedicationAdministration: z.enum([YES, NO]),
    })
    .refine(
      ({ hasFoodAllergiesOrIntolerances, foodAllergiesOrIntolerances }) =>
        hasFoodAllergiesOrIntolerances.includes(YES)
          ? !!foodAllergiesOrIntolerances &&
            foodAllergiesOrIntolerances.length > 0
          : true,
      {
        path: ['foodAllergiesOrIntolerances'],
        params: errorMessages.foodAllergiesOrIntolerancesRequired,
      },
    )
    .refine(
      ({ hasOtherAllergies, otherAllergies }) =>
        hasOtherAllergies.includes(YES)
          ? !!otherAllergies && otherAllergies.length > 0
          : true,
      {
        path: ['otherAllergies'],
        params: errorMessages.otherAllergiesRequired,
      },
    )
    .refine(
      ({ hasFoodAllergiesOrIntolerances, hasOtherAllergies, usesEpiPen }) =>
        hasFoodAllergiesOrIntolerances.includes(YES) ||
        hasOtherAllergies.includes(YES)
          ? !!usesEpiPen
          : true,
      { path: ['usesEpiPen'] },
    ),
  support: z
    .object({
      hasDiagnoses: z.enum([YES, NO]),
      hasHadSupport: z.enum([YES, NO]),
      hasWelfareContact: z.string().optional(),
      welfareContact: nameEmailSchema,
      hasCaseManager: z.string().optional(),
      caseManager: nameEmailSchema,
      hasIntegratedServices: z.string().optional(),
      requestingMeeting: z.array(z.enum([YES, NO])).optional(),
    })
    .refine(
      ({ hasDiagnoses, hasHadSupport, hasWelfareContact }) =>
        hasDiagnoses === YES || hasHadSupport === YES
          ? !!hasWelfareContact
          : true,
      { path: ['hasWelfareContact'] },
    )
    .refine(
      ({ hasDiagnoses, hasHadSupport, hasWelfareContact, welfareContact }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES
          ? welfareContact && !!welfareContact.name?.trim()
          : true,
      { path: ['welfareContact', 'name'] },
    )
    .refine(
      ({ hasDiagnoses, hasHadSupport, hasWelfareContact, welfareContact }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES
          ? welfareContact && !!welfareContact.email?.trim()
          : true,
      { path: ['welfareContact', 'email'] },
    )
    .refine(
      ({ hasDiagnoses, hasHadSupport, hasWelfareContact, hasCaseManager }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES
          ? !!hasCaseManager
          : true,
      { path: ['hasCaseManager'] },
    )
    .refine(
      ({
        hasDiagnoses,
        hasHadSupport,
        hasWelfareContact,
        hasCaseManager,
        caseManager,
      }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES &&
        hasCaseManager === YES
          ? caseManager && !!caseManager.name?.trim()
          : true,
      { path: ['caseManager', 'name'] },
    )
    .refine(
      ({
        hasDiagnoses,
        hasHadSupport,
        hasWelfareContact,
        hasCaseManager,
        caseManager,
      }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES &&
        hasCaseManager === YES
          ? caseManager && !!caseManager.email?.trim()
          : true,
      {
        path: ['caseManager', 'email'],
      },
    )
    .refine(
      ({
        hasDiagnoses,
        hasHadSupport,
        hasIntegratedServices,
        hasWelfareContact,
      }) =>
        (hasDiagnoses === YES || hasHadSupport === YES) &&
        hasWelfareContact === YES
          ? !!hasIntegratedServices
          : true,
      { path: ['hasIntegratedServices'] },
    ),
  attachments: z.object({
    answer: z.nativeEnum(AttachmentOptions),
  }),
  specialEducationSupport: z
    .object({
      hasWelfareContact: z.enum([YES, NO]),
      welfareContact: nameEmailSchema,
      hasCaseManager: z.enum([YES, NO]),
      caseManager: nameEmailSchema,
      hasIntegratedServices: z.enum([YES, NO]),
      hasAssessmentOfSupportNeeds: z.enum([YES, NO]),
      isAssessmentOfSupportNeedsInProgress: z.string().optional(),
      supportNeedsAssessmentBy: z.string().optional(),
      hasConfirmedDiagnosis: z.enum([YES, NO]),
      isDiagnosisInProgress: z.string().optional(),
      diagnosticians: z.array(z.string()).optional(),
      hasOtherSpecialists: z.enum([YES, NO]),
      specialists: z.array(z.string()).optional(),
      hasReceivedServicesFromMunicipality: z.enum([YES, NO]),
      servicesFromMunicipality: z.array(z.string()).optional(),
      hasReceivedChildAndAdolescentPsychiatryServices: z
        .string()
        .min(1)
        .optional(),
      isOnWaitlistForServices: z.string().optional(),
      childAndAdolescentPsychiatryDepartment: z.string().optional(),
      childAndAdolescentPsychiatryServicesReceived: z
        .array(z.string())
        .optional(),
      hasBeenReportedToChildProtectiveServices: z.string().min(1).optional(),
      isCaseOpenWithChildProtectiveServices: z.string().optional(),
    })
    .refine(
      ({ hasWelfareContact, welfareContact }) =>
        hasWelfareContact === YES
          ? welfareContact && !!welfareContact.name?.trim()
          : true,
      { path: ['welfareContact', 'name'] },
    )
    .refine(
      ({ hasWelfareContact, welfareContact }) =>
        hasWelfareContact === YES
          ? welfareContact && !!welfareContact.email?.trim()
          : true,
      { path: ['welfareContact', 'email'] },
    )
    .refine(
      ({ hasCaseManager, caseManager }) =>
        hasCaseManager === YES
          ? caseManager && !!caseManager.name?.trim()
          : true,
      { path: ['caseManager', 'name'] },
    )
    .refine(
      ({ hasCaseManager, caseManager }) =>
        hasCaseManager === YES
          ? caseManager && !!caseManager.email?.trim()
          : true,
      { path: ['caseManager', 'email'] },
    )
    .refine(
      ({ hasAssessmentOfSupportNeeds, isAssessmentOfSupportNeedsInProgress }) =>
        hasAssessmentOfSupportNeeds === NO
          ? !!isAssessmentOfSupportNeedsInProgress
          : true,
      { path: ['isAssessmentOfSupportNeedsInProgress'] },
    )
    .refine(
      ({
        hasAssessmentOfSupportNeeds,
        isAssessmentOfSupportNeedsInProgress,
        supportNeedsAssessmentBy,
      }) =>
        hasAssessmentOfSupportNeeds === YES ||
        (hasAssessmentOfSupportNeeds === NO &&
          isAssessmentOfSupportNeedsInProgress === YES)
          ? !!supportNeedsAssessmentBy
          : true,
      { path: ['supportNeedsAssessmentBy'] },
    )
    .refine(
      ({ hasConfirmedDiagnosis, isDiagnosisInProgress }) =>
        hasConfirmedDiagnosis === NO ? !!isDiagnosisInProgress : true,
      { path: ['isDiagnosisInProgress'] },
    )
    .refine(
      ({ hasConfirmedDiagnosis, isDiagnosisInProgress, diagnosticians }) =>
        hasConfirmedDiagnosis === YES ||
        (hasConfirmedDiagnosis === NO && isDiagnosisInProgress === YES)
          ? !!diagnosticians
          : true,
      { path: ['diagnosticians'] },
    )
    .refine(
      ({ hasOtherSpecialists, specialists }) =>
        hasOtherSpecialists === YES ? !!specialists : true,
      { path: ['specialists'] },
    )
    .refine(
      ({ hasReceivedServicesFromMunicipality, servicesFromMunicipality }) =>
        hasReceivedServicesFromMunicipality === YES
          ? !!servicesFromMunicipality
          : true,
      { path: ['servicesFromMunicipality'] },
    )
    .refine(
      ({
        hasReceivedChildAndAdolescentPsychiatryServices,
        isOnWaitlistForServices,
      }) =>
        hasReceivedChildAndAdolescentPsychiatryServices === NO
          ? !!isOnWaitlistForServices
          : true,
      { path: ['isOnWaitlistForServices'] },
    )
    .refine(
      ({
        hasReceivedChildAndAdolescentPsychiatryServices,
        isOnWaitlistForServices,
        childAndAdolescentPsychiatryDepartment,
      }) =>
        hasReceivedChildAndAdolescentPsychiatryServices === YES ||
        (hasReceivedChildAndAdolescentPsychiatryServices === NO &&
          isOnWaitlistForServices === YES)
          ? !!childAndAdolescentPsychiatryDepartment
          : true,
      { path: ['childAndAdolescentPsychiatryDepartment'] },
    )
    .refine(
      ({
        hasReceivedChildAndAdolescentPsychiatryServices,
        childAndAdolescentPsychiatryServicesReceived,
      }) =>
        hasReceivedChildAndAdolescentPsychiatryServices === YES
          ? !!childAndAdolescentPsychiatryServicesReceived
          : true,
      { path: ['childAndAdolescentPsychiatryServicesReceived'] },
    )
    .refine(
      ({
        hasBeenReportedToChildProtectiveServices,
        isCaseOpenWithChildProtectiveServices,
      }) =>
        hasBeenReportedToChildProtectiveServices === YES
          ? !!isCaseOpenWithChildProtectiveServices
          : true,
      { path: ['isCaseOpenWithChildProtectiveServices'] },
    ),
  payer: z
    .object({
      option: z.nativeEnum(PayerOption),
      other: z
        .object({
          name: z.string(),
          nationalId: z.string(),
          email: z.string().email().optional().or(z.literal('')),
        })
        .optional(),
    })
    .refine(
      ({ option, other }) =>
        option === PayerOption.OTHER ? other && !!other.name?.trim() : true,
      { path: ['other', 'name'] },
    )
    .refine(
      ({ option, other }) =>
        option === PayerOption.OTHER
          ? other && kennitala.isValid(other.nationalId)
          : true,
      { path: ['other', 'nationalId'], params: errorMessages.nationalId },
    )
    .refine(
      ({ option, other }) =>
        option === PayerOption.OTHER ? other && !!other.email?.trim() : true,
      { path: ['other', 'email'] },
    ),
})

export type SchemaFormValues = z.infer<typeof dataSchema>
