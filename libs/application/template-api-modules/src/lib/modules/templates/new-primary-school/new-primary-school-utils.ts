import { getApplicationAnswers } from '@island.is/application/templates/new-primary-school'
import { Application, YES } from '@island.is/application/types'
import { FormDto, FormDtoTypeEnum } from '@island.is/clients/mms/frigg'

export const transformApplicationToNewPrimarySchoolDTO = (
  application: Application,
): FormDto => {
  const {
    differentPlaceOfResidence,
    childInfo,
    parents,
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
  } = getApplicationAnswers(application.answers)

  const newPrimarySchoolDTO: FormDto = {
    // type: FormDtoTypeEnum,
    // type: 'registration',
    type: FormDtoTypeEnum.Registration,
    // user: UserDto,
    user: {
      // TODO: Vantar ekki "gender"??
      name: childInfo.name,
      nationalId: childInfo.nationalId,
      preferredName: childInfo.chosenName, // TODO: Eigum við að breyta okkar í "preferredName"??
      pronouns: [''],
      address: {
        address: childInfo.address.streetAddress,
        postCode: +childInfo.address.postalCode,
      },
    },
    // agents: Array<AgentDto>,
    agents: [
      {
        name: '',
        nationalId: '',
        preferredName: '',
        pronouns: [''],
        address: {
          address: '',
          postCode: 0,
        },
        email: '',
        phone: '',
        relation: '',
      },
    ],
    // registration: RegistrationDto,
    registration: {
      preRegisteredId: '',
      defaultOrg: '',
      selectedOrg: '',
      requestingMeeting: true,
      expectedStartDate: new Date(),
      reason: '',
      movingAbroadCountry: '',
    },
    // health: HealthDto,
    health: {
      // usesEpipen: true,
      usesEpipen: isUsingEpiPen?.includes(YES),
      // allergies: [''],
      // ...(hasFoodAllergies.includes(YES) && { allergies: foodAllergies }),
      allergies: foodAllergies,
      // intolerances: [''],
      // ...(hasFoodIntolerances.includes(YES) && { intolerances: foodIntolerances }),
      intolerances: foodIntolerances,
    },
    // social: SocialDto,
    social: {
      hasHadSupport: specialSupport === YES,
      hasDiagnoses: developmentalAssessment === YES,
    },
    // language: LanguageDto,
    language: {
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
