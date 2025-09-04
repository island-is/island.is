import { NO, YES } from '@island.is/application/core'
import {
  ApplicationType,
  getApplicationAnswers,
  getApplicationExternalData,
  getSelectedChild,
  LanguageEnvironmentOptions,
  ReasonForApplicationOptions,
  SchoolType,
} from '@island.is/application/templates/new-primary-school'
import { Application } from '@island.is/application/types'
import {
  AgentInput,
  AgentInputTypeEnum,
  ApplicationInput,
  ApplicationInputTypeEnum,
  CaseWorkerInputTypeEnum,
  UserInputGenderEnum,
} from '@island.is/clients/mms/frigg'

export const getGenderCode = (genderCode: string) => {
  switch (genderCode) {
    case '1':
    case '3':
      return UserInputGenderEnum.Male
    case '2':
    case '4':
      return UserInputGenderEnum.Female
    default:
      return UserInputGenderEnum.Other
  }
}

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
): ApplicationInput => {
  const {
    applicationType,
    childInfo,
    guardians,
    relatives,
    reasonForApplication,
    reasonForApplicationId,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
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
    selectedSchool,
    selectedSchoolType,
    currentSchoolId,
  } = getApplicationAnswers(application.answers)

  const { primaryOrgId, childCitizenshipCode } = getApplicationExternalData(
    application.externalData,
  )
  const selectedChild = getSelectedChild(
    application.answers,
    application.externalData,
  )

  const agents: AgentInput[] = [
    ...guardians.map((guardian) => ({
      name: guardian.fullName,
      nationalId: guardian.nationalId,
      nationality: guardian.citizenshipCode,
      type: AgentInputTypeEnum.Guardian,
      domicile: {
        address: guardian.address.streetAddress,
        postCode: guardian.address.postalCode,
      },
      email: guardian.email,
      phone: guardian.phoneNumber,
      requiresInterpreter: guardian.requiresInterpreter.includes(YES),
      ...(guardian.requiresInterpreter.includes(YES) && {
        preferredLanguage: guardian.preferredLanguage,
      }),
    })),
    ...relatives.map((relative) => ({
      name: relative.fullName,
      nationalId: relative.nationalId,
      type: AgentInputTypeEnum.EmergencyContact,
      phone: relative.phoneNumber,
      relationTypeId: relative.relation,
    })),
    ...(reasonForApplication ===
    ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL
      ? siblings.map((sibling) => ({
          name: sibling.fullName,
          nationalId: sibling.nationalId,
          type: AgentInputTypeEnum.Sibling,
        }))
      : []),
  ]

  const newPrimarySchoolDTO: ApplicationInput = {
    type: ApplicationInputTypeEnum.Registration,
    user: {
      name: childInfo?.name || '',
      nationalId: childInfo?.nationalId || '',
      nationality: childCitizenshipCode,
      gender: getGenderCode(selectedChild?.genderCode || ''),
      ...(childInfo?.usePronounAndPreferredName?.includes(YES) && {
        preferredName: childInfo?.preferredName,
        pronouns: childInfo?.pronouns,
      }),
      domicile: {
        address: childInfo?.address?.streetAddress || '',
        postCode: childInfo?.address?.postalCode || '',
      },
      ...(childInfo?.differentPlaceOfResidence === YES &&
        childInfo?.placeOfResidence && {
          residence: {
            address: childInfo?.placeOfResidence?.streetAddress,
            postCode: childInfo?.placeOfResidence?.postalCode,
          },
        }),
      ...(childInfo?.differentPlaceOfResidence === NO &&
        childInfo?.placeOfResidence && {
          residence: {
            address: '',
            postCode: '',
          },
        }),
    },
    agents,
    registration: {
      ...((primaryOrgId || currentSchoolId) && {
        defaultOrganizationId: primaryOrgId || currentSchoolId,
      }),
      selectedOrganizationId: selectedSchool,
      requestingMeeting: requestingMeeting === YES,
      ...(applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
        ? {
            expectedStartDate: new Date(expectedStartDate || ''),
            ...(selectedSchoolType === SchoolType.INTERNATIONAL_SCHOOL &&
              temporaryStay === YES && {
                expectedEndDate: new Date(expectedEndDate || ''),
              }),
          }
        : {
            expectedStartDate: new Date(), // Temporary until we start working on the "Enrollment in primary school" application
          }),
      reason: reasonForApplicationId, // LAGA: Add a condition for this when Júní has added school type
      ...(reasonForApplication ===
        ReasonForApplicationOptions.MOVING_MUNICIPALITY && {
        tempDomicile: {
          address: reasonForApplicationStreetAddress || '',
          postCode: reasonForApplicationPostalCode || '',
        },
      }),
    },
    health: {
      ...(hasFoodAllergiesOrIntolerances?.includes(YES) && {
        foodAllergiesOrIntolerances,
      }),
      ...(hasOtherAllergies?.includes(YES) && {
        allergies: otherAllergies,
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
      languageEnvironment: languageEnvironmentId,
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
