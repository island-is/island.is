import { defineMessages } from 'react-intl'

export const fishingLicense = {
  general: defineMessages({
    sectionTitle: {
      id: 'gfl.application:fishingLicense.general.sectionTitle',
      defaultMessage: 'Veiðileyfi',
      description: 'Fishing license section title',
    },
    title: {
      id: 'gfl.application:fishingLicense.general.name',
      defaultMessage: 'Veiðileyfi',
      description: 'Fishing license title',
    },
    description: {
      id: 'gfl.application:fishingLicense.general.description',
      defaultMessage:
        'Hér eru upplýsingar um fiskveiðiskipið sem sótt er um veiðileyfi fyrir og þar fyrir neðan er tegund veiðileyfis valin. ',
      description: 'Fishing license description',
    },
  }),
  labels: defineMessages({
    radioButtonTitle: {
      id: 'gfl.application:fishingLicense.labels.radioButtonTitle',
      defaultMessage: 'Veiðileyfi í boði',
      description: 'Fishing license radio button title',
    },
    hookCatchLimit: {
      id: 'gfl.application:fishingLicense.labels.hookCatchLimit',
      defaultMessage: 'Veiðileyfi með krókaaflamarki',
      description: 'Fishing license radio button with hook catch limit',
    },
    catchMark: {
      id: 'gfl.application:fishingLicense.labels.catchMark',
      defaultMessage: 'Veiðileyfi með aflamarki',
      description: 'Fishing license radio button with catch mark',
    },
  }),
  tooltips: defineMessages({
    hookCatchLimit: {
      id: 'gfl.application:fishingLicense.tooltips.hookCatchLimit',
      defaultMessage:
        'Einungis er heimilt að nýta handfæri og línu með krókaveiðifærum. Báturinn þarf að vera 15 brúttótonn eða minna.',
      description: 'Fishing license radio button tooltip with hook catch limit',
    },
    catchMark: {
      id: 'gfl.application:fishingLicense.tooltips.catchMark',
      defaultMessage: 'Einungis er heimilt að nýta ...',
      description: 'Fishing license radio button tooltip with catch limit',
    },
  }),
  warningMessageTitle: defineMessages({
    hookCatchLimit: {
      id: 'gfl.application:fishingLicense.warningMessageTitle.hookCatchLimit',
      defaultMessage: 'Ekki hægt að sækja um veiðileyfi með krókaaflamarki',
      description: 'Fishing license warning message title for hook catch limit',
    },
    catchMark: {
      id: 'gfl.application:fishingLicense.warningMessageTitle.catchMark',
      defaultMessage: 'Ekki hægt að sækja um veiðileyfi með aflamarki',
      description: 'Fishing license warning message title for catch mark',
    },
  }),
  warningMessageDescription: defineMessages({
    hookCatchLimit: {
      id:
        'gfl.application:fishingLicense.warningMessageDescription.hookCatchLimit',
      defaultMessage:
        'Sjáðu ástæður fyrir því að ekki er hægt að sækja um veiðileyfi með krókaaflamarki',
      description:
        'Fishing license warning message description for hook catch limit',
    },
    catchMark: {
      id: 'gfl.application:fishingLicense.warningMessageDescription.catchMark',
      defaultMessage:
        'Sjáðu ástæður fyrir því að ekki er hægt að sækja um veiðileyfi með aflamarki',
      description: 'Fishing license warning message description for catch mark',
    },
  }),
}
