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
    differentPlaceOfResidence,
    childInfo,
    parents,
    siblings,
    relatives,
    reasonForApplication,
    reasonForApplicationCountry,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,
    selectedSchool,
    nativeLanguage,
    otherLanguagesSpokenDaily,
    otherLanguages,
    icelandicNotSpokenAroundChild,
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
    ...relatives.map((relative) => ({
      name: relative.fullName,
      nationalId: relative.nationalId,
      phone: relative.phoneNumber,
      role: relative.relation,
    })),
    ...(reasonForApplication ===
    ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL
      ? siblings.map((sibling) => ({
          name: sibling.fullName,
          nationalId: sibling.nationalId,
          // TODO: Siblings relation options are not in the key-options endpoint => Júní has added "sibling" (We need to make sure that those options do not appear in the dropdown on the relatives page)
          // TODO: We are waiting for a reply from MMS if this is important information or if we should remove it
          role: sibling.relation,
        }))
      : []),
  ]

  let noIcelandic: boolean
  if (otherLanguagesSpokenDaily === YES) {
    if (nativeLanguage === 'is' || otherLanguages?.includes('is')) {
      noIcelandic = false
    } else {
      noIcelandic = icelandicNotSpokenAroundChild?.includes(YES)
    }
  } else {
    noIcelandic = nativeLanguage !== 'is'
  }

  const newPrimarySchoolDTO: FormDto = {
    type: FormDtoTypeEnum.Registration,
    user: {
      name: childInfo.name,
      nationalId: childInfo.nationalId,
      preferredName: childInfo.preferredName,
      pronouns: childInfo.pronouns,
      domicile: {
        address: childInfo.address.streetAddress,
        postCode: childInfo.address.postalCode,
      },
      ...(differentPlaceOfResidence === YES && childInfo.placeOfResidence
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
      ...(reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD
        ? {
            selectedOrg: selectedSchool,
            requestingMeeting: requestMeeting === YES,
            expectedStartDate: new Date(startDate),
          }
        : {
            movingAbroadCountry: reasonForApplicationCountry,
          }),
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
    ...(reasonForApplication !== ReasonForApplicationOptions.MOVING_ABROAD
      ? {
          social: {
            hasHadSupport: specialSupport === YES,
            hasDiagnoses: developmentalAssessment === YES,
          },
          language: {
            nativeLanguage: nativeLanguage,
            noIcelandic,
            otherLanguages:
              otherLanguagesSpokenDaily === YES ? otherLanguages : undefined,
          },
        }
      : {}),
  }

  return newPrimarySchoolDTO
}
