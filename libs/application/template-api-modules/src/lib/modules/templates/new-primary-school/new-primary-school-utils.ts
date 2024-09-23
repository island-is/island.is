import {
  getApplicationAnswers,
  ReasonForApplicationOptions,
} from '@island.is/application/templates/new-primary-school'
import { Application, YES } from '@island.is/application/types'
import {
  FormDto,
  FormDtoTypeEnum,
  AgentDto,
} from '@island.is/clients/mms/frigg'

export const transformApplicationToNewPrimarySchoolDTO = (
  application: Application,
): FormDto => {
  const {
    // User
    differentPlaceOfResidence,
    childInfo,

    // Agents
    parents,
    siblings,
    relatives,

    // Reason
    reasonForApplication,
    reasonForApplicationCountry,
    reasonForApplicationStreetAddress,
    reasonForApplicationPostalCode,

    // School
    selectedSchool,

    // Language
    nativeLanguage,
    otherLanguagesSpokenDaily,
    otherLanguages,
    icelandicNotSpokenAroundChild,

    // Social
    developmentalAssessment,
    specialSupport,
    startDate,
    requestMeeting,
  } = getApplicationAnswers(application.answers)

  const agents: AgentDto[] = [
    {
      name: parents.parent1.fullName,
      nationalId: parents.parent1.nationalId,
      domicile: {
        address: parents.parent1.address.streetAddress,
        postCode: +parents.parent1.address.postalCode,
      },
      email: parents.parent1.email,
      phone: parents.parent1.phoneNumber,
      role: 'parent', // TODO: Nota strengina undir relation í sem koma frá key options endapunktinum
    },
    ...(parents.parent2
      ? [
          {
            name: parents.parent2.fullName,
            nationalId: parents.parent2.nationalId,
            domicile: {
              address: parents.parent2.address.streetAddress,
              postCode: +parents.parent2.address.postalCode,
            },
            email: parents.parent2.email,
            phone: parents.parent2.phoneNumber,
            role: 'parent', // TODO: Nota strengina undir relation í sem koma frá key options endapunktinum
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
    ReasonForApplicationOptions.SIBLINGS_IN_THE_SAME_PRIMARY_SCHOOL
      ? siblings.map((sibling) => ({
          name: sibling.fullName,
          nationalId: sibling.nationalId,
          // TODO: Siblings relation valmöguleikar eru ekki í key options endapunktinum => Hvað á að senda fyrir systkini?
          role: sibling.relation,
        }))
      : []),
  ]
  console.log('======> agents: ', agents)

  const newPrimarySchoolDTO: FormDto = {
    // type: FormDtoTypeEnum,
    type: FormDtoTypeEnum.Registration,
    // user: UserDto,
    user: {
      // Required: name og nationalId
      name: childInfo.name,
      nationalId: childInfo.nationalId,
      preferredName: childInfo.preferredName,
      pronouns: childInfo.pronouns,
      domicile: {
        address: childInfo.address.streetAddress,
        postCode: +childInfo.address.postalCode,
      },
      ...(differentPlaceOfResidence === YES && childInfo.placeOfResidence
        ? {
            residence: {
              address: childInfo.placeOfResidence.streetAddress,
              postCode: +childInfo.placeOfResidence.postalCode,
            },
          }
        : {}),
    },
    // agents: Array<AgentDto>,:  Bæði forledrar, aðstandendur og systkini (ef "Systkini í sama grunnskóla")
    // Required: name, nationalId, role
    agents,
    // registration: RegistrationDto,: Upplýsingar um uppfærðu skráninguna
    registration: {
      // Required: defaultOrg, selectedOrg, requestingMeeting, expectedStartDate, reason
      defaultOrg: '', // TODO: Current school
      selectedOrg: selectedSchool, // TODO: New school
      requestingMeeting: requestMeeting === YES,
      expectedStartDate: new Date(startDate),
      reason: reasonForApplication, // TODO: Hvað ef "Flutningur erlendis"? Setti optional á önnur svör, það þarf í raun bara að senda umsóknartýpu upplýsingar um barn og registration objectið.
      // TODO: Skoða hvernig ég veit hvaða ástæða var valin (ég er ekki með lista yfir ástæður)
      movingAbroadCountry: reasonForApplicationCountry,
      newDomicile: {
        // TODO: Optional heimilisfang ef ástæða umsóknar er flutt lögheimili eða fluttur dvalarstaður
        address: reasonForApplicationStreetAddress,
        postCode: +reasonForApplicationPostalCode,
      },
    },
    // health: HealthDto,
    health: {}, // TODO: Er ekki skrítið að þurfa að setja inn tómt obj hérna? => Búin að senda á Júní
    // social: SocialDto,
    social: {
      hasHadSupport: specialSupport === YES,
      hasDiagnoses: developmentalAssessment === YES,
    },
    // language: LanguageDto,
    language: {
      // Required: nativeLanguage, noIcelandic
      nativeLanguage: nativeLanguage,
      // TODO: Á að senda "false" og tóman lista ef "otherLanguagesSpokenDaily" er NO??
      // ...(otherLanguagesSpokenDaily === YES && {
      //   noIcelandic: icelandicNotSpokenAroundChild?.includes(YES),
      //   otherLanguages: otherLanguages,
      // }),

      // TODO: Skoða hvað á að senda ef það er ekki svar hér (umsækjandi sér ekki þetta checkbox nema ef önnur tungumál töluð á heimili barns)
      // noIcelandic: icelandicNotSpokenAroundChild?.includes(YES) ?? false,
      noIcelandic:
        otherLanguagesSpokenDaily === YES
          ? icelandicNotSpokenAroundChild?.includes(YES)
          : nativeLanguage !== 'is',
      otherLanguages:
        otherLanguagesSpokenDaily === YES ? otherLanguages : undefined,
      // ...(otherLanguagesSpokenDaily === YES
      //   ? {
      //       noIcelandic: icelandicNotSpokenAroundChild?.includes(YES),
      //       otherLanguages: otherLanguages,
      //     }
      //   : {
      //       noIcelandic: nativeLanguage !== 'is',
      //     }),
    },
  }
  console.log('=====> newPrimarySchoolDTO: ', newPrimarySchoolDTO)

  return newPrimarySchoolDTO
}
