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
    noFishingLicensesFound: {
      id: 'gfl.application:shipSelection.labels.noFishingLicensesFound',
      defaultMessage: 'Engin gild veiðileyfi fundust',
      description: 'No fishing license found tag',
    },
    hookCatchLimit: {
      id: 'gfl.application:shipSelection.labels.hookCatchLimit',
      defaultMessage: 'Almennt veiðileyfi með krókaafla',
      description: 'Hook catch limit tag',
    },
    fishWithDanishSeine: {
      id: 'gfl.application:shipSelection.labels.fishWithDanishSeine',
      defaultMessage: 'Dragnótaveiðileyfi',
      description: 'Fishing with Danish seine',
    },
    // TODO!!!!
    greyslepp: {
      id: 'gfl.application:shipSelection.labels.greyslepp', // TODO
      defaultMessage: 'Grásleppuveiðileyfi',
      description: 'Grásleppuveiðileyfi', // TODO
    },
    // TODO!!!!
    northIceOceanCod: {
      id: 'gfl.application:shipSelection.labels.northIceOceanCod', // TODO
      defaultMessage: 'Norðuríshafsþorskveiðileyfi í norskri lögsögu',
      description: 'Norðuríshafsþorskveiðileyfi í norskri lögsögu', // TODO
    },
    catchMark: {
      id: 'gfl.application:shipSelection.labels.catchMark',
      defaultMessage: 'Almennt veiðileyfi með aflamarki',
      description: 'Catch mark tag',
    },
    lumpfish: {
      id: 'gfl.application:shipSelection.labels.lumpfish',
      defaultMessage: 'Rauðmagaveiðileyfi',
      description: 'Lumpfish',
    },
    costalFisheries: {
      id: 'gfl.application:shipSelection.labels.costalFisheries',
      defaultMessage: 'Strandveiðileyfi',
      description: 'Costal fisheries',
    },
    // TODO!!!!
    freetime: {
      id: 'gfl.application:shipSelection.labels.freetime', // TODO
      defaultMessage: 'Frístundaveiðar án aflaheimilda',
      description: 'Frístundaveiðar án aflaheimilda', // TODO
    },
    // TODO!!!!
    freetimeHook: {
      id: 'gfl.application:shipSelection.labels.freetimeHook', // TODO
      defaultMessage: 'Frístundaveiðar með aflamarki',
      description: 'Frístundaveiðar með aflamarki', // TODO
    },
    // TODO!!!!
    freetimeHookMed: {
      id: 'gfl.application:shipSelection.labels.freetimeHookMed', // TODO
      defaultMessage: 'Frístundaveiðar með aflamarki',
      description: 'Frístundaveiðar með aflamarki', // TODO
    },
    commonWhelk: {
      id: 'gfl.application:shipSelection.labels.commonWhelk',
      defaultMessage: 'Beitukóngsveiðileyfi',
      description: 'Common whelk',
    },
    oceanQuahogin: {
      id: 'gfl.application:shipSelection.labels.oceanQuahogin',
      defaultMessage: 'Kúfiskveiðileyfi',
      description: 'Ocean quahogin',
    },
    crustaceans: {
      id: 'gfl.application:shipSelection.labels.crustaceans',
      defaultMessage: 'Krabbaveiðileyfi',
      description: 'Crustaceans',
    },
    urchin: {
      id: 'gfl.application:shipSelection.labels.urchin',
      defaultMessage: 'Ígulkeraveiðileyfi',
      description: 'Ígulkerjaveiðileyfi',
    },
    unknown: {
      id: 'gfl.application:shipSelection.labels.notSpecified',
      defaultMessage: 'Ekki tilgreint',
      description: 'Not specified',
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
    licenseForbidden: {
      id: 'gfl.application:fishingLicense.warningMessageTitle.licenseForbidden',
      defaultMessage: 'Ekki hægt að sækja um',
      description:
        'Fishing license warning message title for forbidden licenses',
    },
  }),
  warningMessageDescription: defineMessages({
    licenseForbidden: {
      id: 'gfl.application:fishingLicense.warningMessageDescription.licenseForbidden',
      defaultMessage: 'Sjáðu ástæður fyrir því að ekki er hægt að sækja um',
      description:
        'Fishing license warning message description for forbidden licenses',
    },
  }),
}
