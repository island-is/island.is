import { YES } from '@island.is/application/core'
import {
  ApplicationType,
  getApplicationAnswers,
  getApplicationExternalData,
  LanguageEnvironmentOptions,
  ReasonForApplicationOptions,
  SchoolType,
} from '@island.is/application/templates/new-primary-school'
import { Application } from '@island.is/application/types'
import {
  AgentDto,
  AgentDtoTypeEnum,
  FormDto,
  FormDtoTypeEnum,
} from '@island.is/clients/mms/frigg'

export const transformApplicationToNewPrimarySchoolDTO = (
  application: Application,
): FormDto => {
  const {
    applicationType,
    childInfo,
    guardians,
    relatives,
    reasonForApplication,
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
    hasDiagnoses,
    hasHadSupport,
    hasIntegratedServices,
    requestingMeeting,
    expectedStartDate,
    temporaryStay,
    expectedEndDate,
    selectedSchool,
    selectedSchoolType,
    currentSchoolId,
  } = getApplicationAnswers(application.answers)

  const { primaryOrgId } = getApplicationExternalData(application.externalData)

  const agents: AgentDto[] = [
    ...guardians.map((guardian) => ({
      name: guardian.fullName,
      nationalId: guardian.nationalId,
      nationality: '', // LAGA
      type: AgentDtoTypeEnum.Guardian,
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
      type: AgentDtoTypeEnum.EmergencyContact,
      phone: relative.phoneNumber,
      relationTypeId: relative.relation,
    })),
    ...(reasonForApplication ===
    ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL
      ? siblings.map((sibling) => ({
          name: sibling.fullName,
          nationalId: sibling.nationalId,
          type: AgentDtoTypeEnum.Sibling,
        }))
      : []),
  ]

  const newPrimarySchoolDTO: FormDto = {
    type: FormDtoTypeEnum.Registration,
    user: {
      name: childInfo.name,
      nationalId: childInfo.nationalId,
      nationality: '', // LAGA
      ...(childInfo.usePronounAndPreferredName?.includes(YES) && {
        preferredName: childInfo.preferredName,
        pronouns: childInfo.pronouns,
      }),
      domicile: {
        address: childInfo.address.streetAddress,
        postCode: childInfo.address.postalCode,
      },
      ...(childInfo.differentPlaceOfResidence === YES &&
        childInfo.placeOfResidence && {
          residence: {
            address: childInfo.placeOfResidence.streetAddress,
            postCode: childInfo.placeOfResidence.postalCode,
          },
        }),
    },
    agents,
    registration: {
      ...(primaryOrgId || currentSchoolId
        ? {
            defaultOrganizationId: primaryOrgId || currentSchoolId,
          }
        : {}),
      selectedOrganizationId: selectedSchool,
      requestingMeeting: requestingMeeting === YES,
      ...(applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
        ? {
            expectedStartDate: new Date(expectedStartDate),
            ...(selectedSchoolType === SchoolType.INTERNATIONAL_SCHOOL &&
              temporaryStay === YES && {
                expectedEndDate: new Date(expectedEndDate),
              }),
          }
        : {
            expectedStartDate: new Date(), // Temporary until we start working on the "Enrollment in primary school" application
          }),
      reason: reasonForApplication, // LAGA: Add a condition for this when Júní has added school type
      ...(reasonForApplication ===
        ReasonForApplicationOptions.MOVING_MUNICIPALITY && {
        tempDomicile: {
          address: reasonForApplicationStreetAddress,
          postCode: reasonForApplicationPostalCode,
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
    social: {
      hasHadSupport: hasHadSupport === YES,
      hasDiagnoses: hasDiagnoses === YES,
      ...((hasHadSupport === YES || hasDiagnoses === YES) && {
        hasIntegratedServices: hasIntegratedServices === YES,
        // ...(hasIntegratedServices === YES && {
        //   caseWorkers: [
        //     {
        //       name: 'caseWorker',
        //       email: 'caseWorker@caseWorker.is',
        //       phone: '',
        //     },
        //   ],
        // }),
      }),
    },
    language: {
      languageEnvironment: languageEnvironmentId,
      signLanguage: signLanguage === YES,
      ...(languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
        ? {
            preferredLanguage,
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
