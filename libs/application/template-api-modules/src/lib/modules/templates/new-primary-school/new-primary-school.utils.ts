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
  AgentInput,
  AgentInputTypeEnum,
  ApplicationInput,
  ApplicationInputTypeEnum,
} from '@island.is/clients/mms/frigg'

export const transformApplicationToNewPrimarySchoolDTO = (
  application: Application,
): ApplicationInput => {
  const {
    applicationType,
    childInfo,
    guardians,
    relatives,
    reasonForApplication,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
    siblings,
    languageEnvironment,
    //selectedLanguages,
    preferredLanguage,
    signLanguage,
    guardianRequiresInterpreter,
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
    hasCaseManager,
    caseManagerName,
    caseManagerEmail,
    requestingMeeting,
    expectedStartDate,
    temporaryStay,
    expectedEndDate,
    selectedSchool,
    selectedSchoolType,
  } = getApplicationAnswers(application.answers)

  const { primaryOrgId } = getApplicationExternalData(application.externalData)

  const agents: AgentInput[] = [
    ...guardians.map((guardian) => ({
      name: guardian.fullName,
      nationalId: guardian.nationalId,
      nationality: '', // LAGA
      type: AgentInputTypeEnum.Guardian,
      domicile: {
        address: guardian.address.streetAddress,
        postCode: guardian.address.postalCode,
      },
      email: guardian.email,
      phone: guardian.phoneNumber,
    })),
    ...relatives.map((relative) => ({
      name: relative.fullName,
      nationalId: relative.nationalId,
      nationality: '', // LAGA
      type: AgentInputTypeEnum.EmergencyContact,
      phone: relative.phoneNumber,
      relationTypeId: relative.relation,
    })),
    ...(reasonForApplication ===
    ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL
      ? siblings.map((sibling) => ({
          name: sibling.fullName,
          nationalId: sibling.nationalId,
          nationality: '', // LAGA
          type: AgentInputTypeEnum.Sibling,
        }))
      : []),
  ]

  const newPrimarySchoolDTO: ApplicationInput = {
    type: ApplicationInputTypeEnum.Registration,
    user: {
      name: childInfo.name,
      nationalId: childInfo.nationalId,
      nationality: '', // LAGA
      ...(childInfo.usePronounAndPreferredName?.includes(YES)
        ? {
            preferredName: childInfo.preferredName,
            pronouns: childInfo.pronouns,
          }
        : {}),
      domicile: {
        address: childInfo.address.streetAddress,
        postCode: childInfo.address.postalCode,
      },
      ...(childInfo.differentPlaceOfResidence === YES &&
      childInfo.placeOfResidence
        ? {
            residence: {
              address: childInfo.placeOfResidence.streetAddress,
              postCode: childInfo.placeOfResidence.postalCode,
            },
          }
        : {}),
    },
    agents,
    registration: {
      defaultOrganizationId: primaryOrgId,
      selectedOrganizationId: selectedSchool,
      requestingMeeting: requestingMeeting === YES,
      ...(applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
        ? {
            expectedStartDate: new Date(expectedStartDate),
            ...(selectedSchoolType === SchoolType.INTERNATIONAL_SCHOOL &&
            temporaryStay === YES
              ? { expectedEndDate: new Date(expectedEndDate) }
              : {}),
          }
        : {
            expectedStartDate: new Date(), // Temporary until we start working on the "Enrollment in primary school" application
          }),
      reason: reasonForApplication, //LAGA: Add a condition for this when Júní has added school type
      ...(reasonForApplication ===
      ReasonForApplicationOptions.MOVING_MUNICIPALITY
        ? {
            newDomicile: {
              address: reasonForApplicationStreetAddress,
              postCode: reasonForApplicationPostalCode,
            },
          }
        : {}),
    },
    health: {
      ...(hasFoodAllergiesOrIntolerances?.includes(YES)
        ? {
            foodAllergiesOrIntolerances,
          }
        : {}),
      ...(hasOtherAllergies?.includes(YES)
        ? {
            allergies: otherAllergies,
          }
        : {}),
      ...(hasFoodAllergiesOrIntolerances?.includes(YES) ||
      hasOtherAllergies?.includes(YES)
        ? {
            usesEpipen: usesEpiPen === YES,
          }
        : {}),
      hasConfirmedMedicalDiagnoses: hasConfirmedMedicalDiagnoses === YES,
      requestsMedicationAdministration:
        requestsMedicationAdministration === YES,
    },
    social: {
      hasHadSupport: hasHadSupport === YES,
      hasDiagnoses: hasDiagnoses === YES,
      ...(hasHadSupport === YES || hasDiagnoses === YES
        ? {
            hasIntegratedServices: hasIntegratedServices === YES,
            ...(hasIntegratedServices === YES
              ? {
                  hasCaseManager: hasCaseManager === YES,
                  ...(hasCaseManager === YES
                    ? {
                        caseManager: {
                          name: caseManagerName,
                          email: caseManagerEmail,
                        },
                      }
                    : {}),
                }
              : {}),
          }
        : {}),
    },
    language: {
      languageEnvironment: '', // LAGA
      signLanguage: signLanguage === YES,
      ...(languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
        ? {
            preferredLanguage,
            guardianRequiresInterpreter: guardianRequiresInterpreter === YES,
            // firstLanguage: selectedLanguages[0]?.code,// LAGA
            // secondLanguage: selectedLanguages[1]?.code,// LAGA
            // thirdLanguage: selectedLanguages[2]?.code,// LAGA
            // fourthLanguage: selectedLanguages[3]?.code,// LAGA
          }
        : {
            preferredLanguage: 'is',
            guardianRequiresInterpreter: false,
            // firstLanguage: 'is', // LAGA
          }),
      languages: [], // LAGA
    },
  }

  return newPrimarySchoolDTO
}
