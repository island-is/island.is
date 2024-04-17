import { defineMessages } from 'react-intl'

export const idInformation = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:idInformation.general.sectionTitle',
      defaultMessage: 'Nafnskírteini',
      description: 'Id Information section title',
    },
    typeofIdSectionTitle: {
      id: 'uni.application:idInformation.general.typeofIdSectionTitle',
      defaultMessage: 'Tegund',
      description: 'type of id section title',
    },
    chosenApplicantsSectionTitle: {
      id: 'uni.application:idInformation.general.chosenApplicantsSectionTitle',
      defaultMessage: 'Umsækjendur',
      description: 'chosen applicants section title',
    },
  }),
  labels: defineMessages({
    typeOfIdTitle: {
      id: 'uni.application:idInformation.labels.typeOfIdTitle',
      defaultMessage: 'Tegund nafnskírteinis',
      description: 'Type of id page title',
    },
    typeOfIdDescription: {
      id: 'uni.application:idInformation.labels.typeOfIdDescription',
      defaultMessage:
        'Eget ultricies diam massa aliquet in lobortis. Nulla mi eget amet nisl laoreet aliquam vel enim. Viverra luctus quis ut at sit nunc. Eget risus vel vehicula fusce sed adipiscing donec semper. Sollicitudin adipiscing id.',
      description: 'Type of id page description',
    },
    typeOfIdRadioLabel: {
      id: 'uni.application:idInformation.labels.typeOfIdRadioLabel',
      defaultMessage: 'Veldu hvaða tegund nafnskírteinis þú vilt sækja um',
      description: 'Type of id radio label',
    },
    typeOfIdRadioAnswerOne: {
      id: 'uni.application:idInformation.labels.typeOfIdRadioAnswerOne',
      defaultMessage: 'Nafnskírteini sem ferðaskilríki',
      description: 'Type of id radio answer id card with travel rights',
    },
    typeOfIdRadioAnswerTwo: {
      id: 'uni.application:idInformation.labels.typeOfIdRadioAnswerTwo',
      defaultMessage: 'Nafnskírteini',
      description: 'Type of id radio answer id card without travel rights',
    },
    chosenApplicantsDescription: {
      id: 'uni.application:idInformation.labels.chosenApplicantsDescription',
      defaultMessage:
        'Þú getur sótt um nafnskírteini / ferðaskilríki fyrir þig og eftirfarandi einstaklinga í þinni umsjón. Veldu þann einstakling sem þú vilt hefja umsókn fyrir og haltu síðan áfram í næsta skref.',
      description: 'description of chosen applicants page',
    },
  }),
}
