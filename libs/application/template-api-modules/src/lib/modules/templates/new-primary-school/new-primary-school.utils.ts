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
      role: 'parent',
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
            role: 'parent',
          },
        ]
      : []),
    ...relatives.map((relative) => ({
      name: relative.fullName,
      nationalId: relative.nationalId,
      phone: relative.phoneNumber,
      role: relative.relation,
    })),
    // TODO: Skoða hvernig ég veit hvaða ástæða var valin (ég er ekki með lista yfir ástæður)
    ...(reasonForApplication ===
    ReasonForApplicationOptions.SIBLINGS_IN_THE_SAME_PRIMARY_SCHOOL
      ? siblings.map((sibling) => ({
          name: sibling.fullName,
          nationalId: sibling.nationalId,
          // TODO: Siblings relation valmöguleikar eru ekki í key-options endapunktinum => Júní ætlar að bæta því við (Þurfum að passa að þeir valmöguleikar komi ekki upp í dropdown á aðstandenda síðunni)
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
      // TODO: Skoða hvernig ég veit hvaða ástæða var valin (ég er ekki með lista yfir ástæður)
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
      ReasonForApplicationOptions.TRANSFER_OF_LEGAL_DOMICILE
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
