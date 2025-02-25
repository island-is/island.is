import { YES } from '@island.is/application/core'
import {
  ApplicationType,
  getApplicationAnswers,
  getApplicationExternalData,
  LanguageEnvironmentOptions,
  ReasonForApplicationOptions,
} from '@island.is/application/templates/new-primary-school'
import { Application } from '@island.is/application/types'
import {
  AgentDto,
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
    contacts,
    reasonForApplication,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
    siblings,
    languageEnvironment,
    selectedLanguages,
    preferredLanguage,
    signLanguage,
    guardianRequiresInterpreter,
    acceptFreeSchoolLunch,
    hasSpecialNeeds,
    specialNeedsType,
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
    selectedSchool,
  } = getApplicationAnswers(application.answers)

  const { primaryOrgId } = getApplicationExternalData(application.externalData)

  const agents: AgentDto[] = [
    ...guardians.map((guardian) => ({
      name: guardian.fullName,
      nationalId: guardian.nationalId,
      domicile: {
        address: guardian.address.streetAddress,
        postCode: guardian.address.postalCode,
      },
      email: guardian.email,
      phone: guardian.phoneNumber,
      role: 'guardian',
    })),
    ...contacts.map((contact) => ({
      name: contact.fullName,
      nationalId: contact.nationalId,
      phone: contact.phoneNumber,
      role: contact.relation,
    })),
    ...(reasonForApplication ===
    ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL
      ? siblings.map((sibling) => ({
          name: sibling.fullName,
          nationalId: sibling.nationalId,
          role: 'sibling',
        }))
      : []),
  ]

  const newPrimarySchoolDTO: FormDto = {
    type: FormDtoTypeEnum.Registration,
    user: {
      name: childInfo.name,
      nationalId: childInfo.nationalId,
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
      defaultOrg: primaryOrgId,
      selectedOrg: selectedSchool,
      requestingMeeting: requestingMeeting === YES,
      ...(applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
        ? {
            expectedStartDate: new Date(expectedStartDate),
            // expectedEndDate: new Date(), // TODO: Add this when Júní has added school type
          }
        : {}),
      reason: reasonForApplication, // TODO: Add a condition for this when Júní has added school type
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
    ...(applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
      ? {
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
        }
      : {}),
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
      languageEnvironment,
      signLanguage: signLanguage === YES,
      ...(languageEnvironment !== LanguageEnvironmentOptions.ONLY_ICELANDIC
        ? {
            preferredLanguage,
            guardianRequiresInterpreter: guardianRequiresInterpreter === YES,
            firstLanguage: selectedLanguages[0]?.code,
            secondLanguage: selectedLanguages[1]?.code,
            thirdLanguage: selectedLanguages[2]?.code,
            fourthLanguage: selectedLanguages[3]?.code,
          }
        : {
            preferredLanguage: 'is',
            guardianRequiresInterpreter: false,
            firstLanguage: 'is',
          }),
    },
    schoolMeal: {
      acceptFreeSchoolLunch: acceptFreeSchoolLunch === YES,
      ...(acceptFreeSchoolLunch === YES
        ? {
            hasSpecialNeeds: hasSpecialNeeds === YES,
            ...(hasSpecialNeeds === YES
              ? {
                  specialNeeds: specialNeedsType,
                }
              : {}),
          }
        : {}),
    },
  }

  return newPrimarySchoolDTO
}
