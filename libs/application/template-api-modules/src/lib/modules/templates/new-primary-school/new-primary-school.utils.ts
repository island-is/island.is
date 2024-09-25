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

  const { primaryOrgId } = getApplicationExternalData(application.externalData)

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
      // TODO: Þurfum kannski að geyma upplýsingar um alla skóla í externalData? Þurfum að vita ID á bæði núverandi og nýjum skóla
      defaultOrg: primaryOrgId, // TODO: Current school ID
      selectedOrg: selectedSchool, // TODO: New school ID
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
      noIcelandic:
        // TODO: Passa að ef búið að haka í checkbox og svo valið Íslenska þá er ennþá hakað í checkbox (ekki nóg að athuga hvort otherLanguagesSpokenDaily === YES og includes!!)
        otherLanguagesSpokenDaily === YES
          ? // Check if Icelandic selected
            nativeLanguage === 'is' || otherLanguages?.includes('is')
            ? false
            : icelandicNotSpokenAroundChild?.includes(YES)
          : nativeLanguage !== 'is',
      otherLanguages:
        otherLanguagesSpokenDaily === YES ? otherLanguages : undefined,
    },
  }
  console.log('=====> newPrimarySchoolDTO: ', newPrimarySchoolDTO)

  return newPrimarySchoolDTO
}
