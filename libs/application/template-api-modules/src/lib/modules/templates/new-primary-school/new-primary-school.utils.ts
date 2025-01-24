import {
  getApplicationAnswers,
  getApplicationExternalData,
  ReasonForApplicationOptions,
} from '@island.is/application/templates/new-primary-school'
import { Application, YES } from '@island.is/application/types'
import {
  AgentDto,
  FormDto,
  FormDtoTypeEnum,
} from '@island.is/clients/mms/frigg'

export const transformApplicationToNewPrimarySchoolDTO = (
  application: Application,
): FormDto => {
  const {
    childInfo,
    parents,
    siblings,
    contacts,
    reasonForApplication,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
    selectedSchool,
    language1,
    language2,
    language3,
    language4,
    childLanguage,
    languageEnvironment,
    signLanguage,
    interpreter,
    developmentalAssessment,
    specialSupport,
    startDate,
    requestMeeting,
  } = getApplicationAnswers(application.answers)

  const { primaryOrgId } = getApplicationExternalData(application.externalData)

  const agents: AgentDto[] = [
    {
      name: parents.parent1.fullName,
      nationalId: parents.parent1.nationalId,
      domicile: {
        address: parents.parent1.address.streetAddress,
        postCode: parents.parent1.address.postalCode,
      },
      email: parents.parent1.email,
      phone: parents.parent1.phoneNumber,
      role: 'guardian',
    },
    ...(parents.parent2
      ? [
          {
            name: parents.parent2.fullName,
            nationalId: parents.parent2.nationalId,
            domicile: {
              address: parents.parent2.address.streetAddress,
              postCode: parents.parent2.address.postalCode,
            },
            email: parents.parent2.email,
            phone: parents.parent2.phoneNumber,
            role: 'guardian',
          },
        ]
      : []),
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
      requestingMeeting: requestMeeting === YES,
      expectedStartDate: new Date(startDate),
      reason: reasonForApplication,
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
    social: {
      hasHadSupport: specialSupport === YES,
      hasDiagnoses: developmentalAssessment === YES,
    }, // Languages needs to be updated when Juni is ready with the data struccture
    language: {
      nativeLanguage: '',
      noIcelandic: false,
      otherLanguages: undefined,
    },
  }

  return newPrimarySchoolDTO
}
