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
    differentPlaceOfResidence,
    childInfo,
    isUsingEpiPen,
    hasFoodAllergies,
    foodAllergies,
    hasFoodIntolerances,
    foodIntolerances,
    nativeLanguage,
    otherLanguagesSpokenDaily,
    otherLanguages,
    icelandicNotSpokenAroundChild,
    developmentalAssessment,
    specialSupport,
    startDate,
    requestMeeting,

    // Agents
    reasonForApplication,
    parents,
    siblings,
    relatives,
  } = getApplicationAnswers(application.answers)

  const agents: AgentDto[] = [
    {
      name: parents.parent1.fullName,
      nationalId: parents.parent1.nationalId,
      // TODO: Parents eru ekki með preferredName
      preferredName: '', // TODO: Optional (Júní á eftir að uppfæra)
      // TODO: Parents eru ekki með pronouns
      pronouns: [''], // TODO: Optional (Júní á eftir að uppfæra)
      address: {
        address: parents.parent1.address.streetAddress,
        postCode: +parents.parent1.address.postalCode,
      },
      email: parents.parent1.email,
      phone: parents.parent1.phoneNumber,
      relation: 'parent', // TODO: Optional (Júní á eftir að uppfæra) => // TODO: Nota strengina undir relation í sem koma frá key options endapunktinum
    },
    ...(parents.parent2
      ? [
          {
            name: parents.parent2.fullName,
            nationalId: parents.parent2.nationalId,
            // TODO: Parents eru ekki með preferredName
            preferredName: '', // TODO: Optional (Júní á eftir að uppfæra)
            // TODO: Parents eru ekki með pronouns
            pronouns: [''], // TODO: Optional (Júní á eftir að uppfæra)
            address: {
              address: parents.parent2.address.streetAddress,
              postCode: +parents.parent2.address.postalCode,
            },
            email: parents.parent2.email,
            phone: parents.parent2.phoneNumber,
            relation: 'parent', // TODO: Optional (Júní á eftir að uppfæra) => // TODO: Nota strengina undir relation í sem koma frá key options endapunktinum
          },
        ]
      : []),
    ...relatives.map((relative) => ({
      name: relative.fullName,
      nationalId: relative.nationalId,
      // TODO: Relatives eru ekki með preferredName
      preferredName: '', // TODO: Optional (Júní á eftir að uppfæra)
      // TODO: Relatives eru ekki með preferredName
      pronouns: [''], // TODO: Optional (Júní á eftir að uppfæra)
      // TODO: Relatives eru ekki með address
      address: {
        // TODO: Optional (Júní á eftir að uppfæra)
        address: 'relative.address.streetAddress',
        postCode: 0,
      },
      // TODO: Relatives eru ekki með email
      email: 'relative.email', // TODO: Optional (Júní á eftir að uppfæra)
      phone: relative.phoneNumber,
      relation: relative.relation, // TODO: Optional (Júní á eftir að uppfæra) => // TODO: Nota strengina undir relation í sem koma frá key options endapunktinum
    })),
    ...(reasonForApplication ===
    ReasonForApplicationOptions.SIBLINGS_IN_THE_SAME_PRIMARY_SCHOOL
      ? siblings.map((sibling) => ({
          name: sibling.fullName,
          nationalId: sibling.nationalId,
          preferredName: '', // TODO: Optional (Júní á eftir að uppfæra)
          pronouns: [''], // TODO: Optional (Júní á eftir að uppfæra)
          // TODO: Siblings eru ekki með address
          address: {
            // TODO: Optional (Júní á eftir að uppfæra)
            address: 'siblings.address.streetAddress',
            postCode: 0,
          },
          // TODO: Relatives eru ekki með email
          email: 'sibling.email', // TODO: Optional (Júní á eftir að uppfæra)
          // TODO: Relatives eru ekki með phoneNumber
          phone: 'sibling.phoneNumber', // TODO: Optional (Júní á eftir að uppfæra)
          // TODO: Siblings relation valmöguleikar eru ekki í key options endapunktinum => Hvað á að senda fyrir systkini?
          relation: sibling.relation, // TODO: Optional (Júní á eftir að uppfæra) => // TODO: Nota strengina undir relation í sem koma frá key options endapunktinum
        }))
      : []),
  ]
  console.log('======> agents: ', agents)

  const newPrimarySchoolDTO: FormDto = {
    // type: FormDtoTypeEnum,
    type: FormDtoTypeEnum.Registration,
    // user: UserDto,
    user: {
      name: childInfo.name,
      nationalId: childInfo.nationalId,
      preferredName: childInfo.preferredName ?? '', // TODO: Þarf að senda þetta inn?
      pronouns: childInfo.pronouns ?? [], // TODO: Þarf að senda þetta inn?
      address: {
        address: childInfo.address.streetAddress,
        postCode: +childInfo.address.postalCode,
      },
      // TODO: Júní á eftir að bæta við optional dvalarstað
    },
    // agents: Array<AgentDto>,:  Bæði forledrar, aðstandendur og systkini (ef "Systkini í sama grunnskóla")
    agents,
    // registration: RegistrationDto,: Upplýsingar um uppfærðu skráninguna
    registration: {
      // TODO: Optional (Júní á eftir að uppfæra)
      preRegisteredId: '', // TODO: Mun bæta inn í punktinn þar sem þið sækið upplýsingar um barn hvort það sé til forskráning, kemur inn fyrir fyrsta bekkjar forskráningu ættuð ekki að þurfa að spá í þessu núna
      defaultOrg: '', // TODO: Annaðhvort skóli sem barn er forskráð í eða í þessu tilviki skóli sem barn er í núþegar // TODO: Er þetta nafnið á skólanum eða kt??
      selectedOrg: '', // TODO: Skóli sem er valinn í umsókninni // TODO: Er þetta nafnið á skólanum eða kt??
      requestingMeeting: requestMeeting === YES,
      expectedStartDate: new Date(startDate),
      reason: reasonForApplication, // TODO: Hvað ef "Flutningur erlendis"? Setti optional á önnur svör, það þarf í raun bara að senda umsóknartýpu upplýsingar um barn og registration objectið.
      movingAbroadCountry: '',
      // TODO: Júní á eftir að bæta við optional heimilisfangi ef ástæða umsóknar er flutt lögheimili eða fluttur dvalarstaður
    },
    // health: HealthDto,
    health: {
      // TODO: Optional (Júní á eftir að uppfæra)
      usesEpipen: isUsingEpiPen?.includes(YES),
      // ...(hasFoodAllergies.includes(YES) && { allergies: foodAllergies }),
      allergies: foodAllergies, // TODO: Optional? (Júní á eftir að uppfæra)
      // ...(hasFoodIntolerances.includes(YES) && { intolerances: foodIntolerances }),
      intolerances: foodIntolerances, // TODO: Optional? (Júní á eftir að uppfæra)
    },
    // social: SocialDto,
    social: {
      // TODO: Optional (Júní á eftir að uppfæra)
      hasHadSupport: specialSupport === YES,
      hasDiagnoses: developmentalAssessment === YES,
    },
    // language: LanguageDto,
    language: {
      // TODO: Optional (Júní á eftir að uppfæra)
      nativeLanguage: nativeLanguage,
      // TODO: Á að senda "false" og tóman lista ef "otherLanguagesSpokenDaily" er NO??
      // ...(otherLanguagesSpokenDaily === YES && {
      //   noIcelandic: icelandicNotSpokenAroundChild?.includes(YES),
      //   otherLanguages: otherLanguages,
      // }),
      noIcelandic: icelandicNotSpokenAroundChild?.includes(YES),
      otherLanguages: otherLanguagesSpokenDaily === YES ? otherLanguages : [],
    },
  }
  console.log('=====> newPrimarySchoolDTO: ', newPrimarySchoolDTO)

  return newPrimarySchoolDTO
}
