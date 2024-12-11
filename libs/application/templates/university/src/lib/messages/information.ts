import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Information section title',
    },
  }),
  labels: {
    programSelection: defineMessages({
      sectionTitle: {
        id: 'uni.application:information.labels.programSelection.sectionTitle',
        defaultMessage: 'Námsval',
        description: 'Program selection section title',
      },
      title: {
        id: 'uni.application:information.labels.programSelection.title',
        defaultMessage: 'Námsval',
        description: 'Program selection title',
      },
      subTitle: {
        id: 'uni.application:information.labels.programSelection.subTitle',
        defaultMessage:
          'Vinsamlegast veldu hvaða skóla og námsleið þú vilt sækja um.',
        description: 'Program selection subtitle',
      },
      selectProgramTitle: {
        id: 'uni.application:information.labels.programSelection.selectProgramTitle',
        defaultMessage: 'Veldu nám',
        description: 'school select title',
      },
      selectUniversityLabel: {
        id: 'uni.application:information.labels.programSelection.selectUniversityLabel',
        defaultMessage: 'Skóli',
        description: 'select university label',
      },
      selectUniversityPlaceholder: {
        id: 'uni.application:information.labels.programSelection.selectUniversityPlaceholder',
        defaultMessage: 'Veldu skóla',
        description: 'select university placeholder',
      },
      selectProgramLabel: {
        id: 'uni.application:information.labels.programSelection.selectProgramLabel',
        defaultMessage: 'Námsleið',
        description: 'select program label',
      },
      selectProgramPlaceholder: {
        id: 'uni.application:information.labels.programSelection.selectProgramPlaceholder',
        defaultMessage: 'Veldu námsleið',
        description: 'select program placeholder',
      },
      selectMajorLabel: {
        id: 'uni.application:information.labels.programSelection.selectMajorLabel',
        defaultMessage: 'Kjörsvið',
        description: 'select major label',
      },
      selectMajorPlaceholder: {
        id: 'uni.application:information.labels.programSelection.selectMajorPlaceholder',
        defaultMessage: 'Veldu kjörsvið',
        description: 'select major placeholder',
      },
      checkboxModeOfDeliveryLabel: {
        id: 'uni.application:information.labels.programSelection.checkboxModeOfDeliveryLabel',
        defaultMessage: 'Veldu form kennslu',
        description: 'checkbox label for mode of delivery',
      },
      selectExamLocationPlaceholder: {
        id: 'uni.application:information.labels.programSelection.selectExamLocationPlaceholder',
        defaultMessage: 'Veldu prófstað',
        description: 'select exam location placeholder',
      },
      selectExamLocationLabel: {
        id: 'uni.application:information.labels.programSelection.selectExamLocationLabel',
        defaultMessage: 'Prófstaður',
        description: 'select exam location label',
      },
      specializationLabel: {
        id: 'uni.application:information.labels.programSelection.specializationLabel',
        defaultMessage: 'Kjörsvið',
        description: 'Specialization label label',
      },
      warningEmptyProgramListTitle: {
        id: 'uni.application:information.labels.programSelection.warningEmptyProgramListTitle',
        defaultMessage: 'Athugið',
        description: 'Warning empty program list title',
      },
      warningEmptyProgramListMessage: {
        id: 'uni.application:information.labels.programSelection.warningEmptyProgramListMessage',
        defaultMessage:
          'Ekki er hægt að sækja um nám fyrir þennan skóla að svo stöddu',
        description: 'Warning empty program list message',
      },
    }),
    modeOfDeliverySection: defineMessages({
      sectionTitle: {
        id: 'uni.application:information.labels.modeOfDeliverySection.sectionTitle',
        defaultMessage: 'Form kennslu',
        description: 'Mode of delivery section title',
      },
      title: {
        id: 'uni.application:information.labels.modeOfDeliverySection.title',
        defaultMessage: 'Form kennslu',
        description: 'Mode of delivery title',
      },
      subTitle: {
        id: 'uni.application:information.labels.modeOfDeliverySection.subTitle',
        defaultMessage:
          'Vinsamlegast veldu hvernig þú vilt haga náminu þínu (vantar texta hér)',
        description: 'Mode of delivery subtitle',
      },
      ON_SITE: {
        id: 'uni.application:information.labels.modeOfDeliverySection.onSite',
        defaultMessage: 'Staðnám',
        description: 'On site value',
      },
      REMOTE: {
        id: 'uni.application:information.labels.modeOfDeliverySection.remote',
        defaultMessage: 'Fjarnám',
        description: 'remote value',
      },
      ONLINE: {
        id: 'uni.application:information.labels.modeOfDeliverySection.online',
        defaultMessage: 'Netnám',
        description: 'online value',
      },
      MIXED: {
        id: 'uni.application:information.labels.modeOfDeliverySection.mixed',
        defaultMessage: 'Blandað nám',
        description: 'mixed value',
      },
      UNDEFINED: {
        id: 'uni.application:information.labels.modeOfDeliverySection.undefined',
        defaultMessage: 'Óskilgreint',
        description: 'undefined value',
      },
      ON_SITE_EXTRA: {
        id: 'uni.application:information.labels.modeOfDeliverySection.onSiteExtra',
        defaultMessage: 'Kennsla er alfarið á staðnum',
        description: 'On site extra sub label value',
      },
      REMOTE_EXTRA: {
        id: 'uni.application:information.labels.modeOfDeliverySection.remoteExtra',
        defaultMessage: 'Fjarnám getur falið í sér kröfu um viðveru',
        description: 'remote extra sub label value',
      },
      ONLINE_EXTRA: {
        id: 'uni.application:information.labels.modeOfDeliverySection.onlineExtra',
        defaultMessage: 'Netnám getur falið í sér kröfu um viðveru',
        description: 'online extra sub label value',
      },
      MIXED_EXTRA: {
        id: 'uni.application:information.labels.modeOfDeliverySection.mixedExtra',
        defaultMessage: 'TODO',
        description: 'mixed extra sub label value',
      },
      UNDEFINED_EXTRA: {
        id: 'uni.application:information.labels.modeOfDeliverySection.undefinedExtra',
        defaultMessage: '',
        description: 'undefined extra sub label value',
      },
    }),
    extraPermission: defineMessages({
      sectionTitle: {
        id: 'uni.application:information.labels.extraPermission.sectionTitle',
        defaultMessage: 'Samþykki',
        description: 'Agreenement section title',
      },
    }),
    extraDataProvider: defineMessages({
      sectionTitle: {
        id: 'uni.application:information.labels.extraDataProvider.sectionTitle',
        defaultMessage: 'Nánari upplýsingaöflun',
        description: 'Extra DataProvider section title',
      },
      submitButton: {
        id: 'uni.application:information.labels.extraDataProvider.submitButton',
        defaultMessage: 'Staðfesta og halda áfram',
        description: 'Extra DataProvider button submit text',
      },
    }),
    otherDocumentsSection: defineMessages({
      sectionTitle: {
        id: 'uni.application:information.labels.otherDocumentsSection.sectionTitle',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents section title',
      },
      title: {
        id: 'uni.application:information.labels.otherDocumentsSection.title',
        defaultMessage: 'Önnur fylgigögn',
        description: 'Other documents selection title',
      },
      subTitle: {
        id: 'uni.application:information.labels.otherDocumentsSection.subTitle',
        defaultMessage:
          'Vinsamlegast settu inn eftirfarandi fylgigögn sem nauðsynleg eru fyrir umsóknina þína.',
        description: 'Other documents subtitle',
      },
    }),
  },
}
