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
  },
}
