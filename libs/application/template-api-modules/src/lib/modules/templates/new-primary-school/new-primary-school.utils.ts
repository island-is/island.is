import { YES } from '@island.is/application/core'
import {
  ApplicationType,
  getApplicationAnswers,
  getApplicationExternalData,
  getSelectedSchoolSubType,
  LanguageEnvironmentOptions,
  OrganizationSubType,
  ReasonForApplicationOptions,
} from '@island.is/application/templates/new-primary-school'
import { Application } from '@island.is/application/types'
import {
  CaseWorkerInputTypeEnum,
  RegistrationInput,
} from '@island.is/clients/mms/frigg'

export const getSocialProfile = (application: Application) => {
  const {
    hasDiagnoses,
    hasHadSupport,
    hasWelfareContact,
    welfareContactName,
    welfareContactEmail,
    hasCaseManager,
    caseManagerName,
    caseManagerEmail,
    hasIntegratedServices,
  } = getApplicationAnswers(application.answers)

  if (
    (hasHadSupport === YES || hasDiagnoses === YES) &&
    hasWelfareContact === YES
  ) {
    return {
      hasHadSupport: hasHadSupport === YES,
      hasDiagnoses: hasDiagnoses === YES,
      hasIntegratedServices: hasIntegratedServices === YES,
      caseWorkers: [
        {
          name: welfareContactName ?? '',
          email: welfareContactEmail ?? '',
          type: CaseWorkerInputTypeEnum.SupportManager,
        },
        ...(hasCaseManager === YES
          ? [
              {
                name: caseManagerName ?? '',
                email: caseManagerEmail ?? '',
                type: CaseWorkerInputTypeEnum.CaseManager,
              },
            ]
          : []),
      ],
    }
  }

  // If hasWelfareContact is NO or not defined, return empty caseWorkers array
  return {
    hasHadSupport: hasHadSupport === YES,
    hasDiagnoses: hasDiagnoses === YES,
    hasIntegratedServices: false,
    caseWorkers: [],
  }
}

export const transformApplicationToNewPrimarySchoolDTO = (
  application: Application,
): RegistrationInput => {
  const {
    applicationType,
    childInfo,
    guardians,
    relatives,
    reasonForApplication,
    reasonForApplicationId,
    // reasonForApplicationStreetAddress,
    // reasonForApplicationPostalCode,
    siblings,
    languageEnvironmentId,
    languageEnvironment,
    selectedLanguages,
    preferredLanguage,
    signLanguage,
    hasFoodAllergiesOrIntolerances,
    foodAllergiesOrIntolerances,
    hasOtherAllergies,
    otherAllergies,
    usesEpiPen,
    hasConfirmedMedicalDiagnoses,
    requestsMedicationAdministration,
    requestingMeeting,
    expectedStartDate,
    temporaryStay,
    expectedEndDate,
    selectedSchoolId,
    currentSchoolId,
    applyForPreferredSchool,
  } = getApplicationAnswers(application.answers)

  const { primaryOrgId, preferredSchool } = getApplicationExternalData(
    application.externalData,
  )

  const newPrimarySchoolDTO: RegistrationInput = {
    applicant: {
      nationalId: childInfo?.nationalId || '',
      ...(childInfo?.usePronounAndPreferredName?.includes(YES) && {
        preferredName: childInfo?.preferredName,
        pronounIds: childInfo?.pronouns,
      }),
    },
    guardians: guardians.map((guardian) => ({
      nationalId: guardian.nationalId,
      email: guardian.email,
      phone: guardian.phoneNumber,
      requiresInterpreter: guardian.requiresInterpreter.includes(YES),
      ...(guardian.requiresInterpreter.includes(YES) && {
        preferredLanguage: guardian.preferredLanguage,
      }),
    })),
    ...(reasonForApplication ===
      ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL && {
      siblings: siblings.map((sibling) => sibling.nationalId),
    }),
    emergencyContacts: relatives.map((relative) => ({
      nationalId: relative.nationalId,
      phone: relative.phoneNumber,
      relationTypeId: relative.relation,
    })),
    ...((primaryOrgId || currentSchoolId) && {
      defaultOrganizationId: primaryOrgId || currentSchoolId,
    }),
    selectedOrganizationId:
      (applyForPreferredSchool === YES
        ? preferredSchool?.id
        : selectedSchoolId) || '',
    requestingMeeting: requestingMeeting === YES,
    ...(applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
      ? {
          expectedStartDate: new Date(expectedStartDate || ''),
          ...(getSelectedSchoolSubType(
            application.answers,
            application.externalData,
          ) === OrganizationSubType.INTERNATIONAL_SCHOOL &&
            temporaryStay === YES && {
              expectedEndDate: new Date(expectedEndDate || ''),
            }),
        }
      : {
          expectedStartDate: new Date(), // Temporary until we start working on the "Enrollment in primary school" application
        }),
    reasonId: reasonForApplicationId, // LAGA: Add a condition for this when Júní has added school type
    health: {
      ...(hasFoodAllergiesOrIntolerances?.includes(YES) && {
        foodAllergiesOrIntoleranceIds: foodAllergiesOrIntolerances,
      }),
      ...(hasOtherAllergies?.includes(YES) && {
        allergiesIds: otherAllergies,
      }),
      ...((hasFoodAllergiesOrIntolerances?.includes(YES) ||
        hasOtherAllergies?.includes(YES)) && {
        usesEpipen: usesEpiPen === YES,
      }),
      hasConfirmedMedicalDiagnoses: hasConfirmedMedicalDiagnoses === YES,
      requestsMedicationAdministration:
        requestsMedicationAdministration === YES,
    },
    social: getSocialProfile(application),
    language: {
      languageEnvironmentId: languageEnvironmentId,
      signLanguage: signLanguage === YES,
      ...(languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
        ? {
            preferredLanguage: preferredLanguage || '',
            languages: selectedLanguages.map((language) => language.code),
          }
        : {
            preferredLanguage: 'is',
            languages: ['is'],
          }),
    },
  }

  return newPrimarySchoolDTO
}
