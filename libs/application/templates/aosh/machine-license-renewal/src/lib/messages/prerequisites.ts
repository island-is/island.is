import { defineMessages } from 'react-intl'

export const prerequisites = {
  general: defineMessages({
    tabTitle: {
      id: 'aosh.mlr.application:prerequisites.general.tabTitle',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of prerequisites tab',
    },
    title: {
      id: 'aosh.mlr.application:prerequisites.general.title',
      defaultMessage: 'Endurnýjun vinnuvélaskírteinis',
      description: 'Title of prerequisites screen',
    },
    subTitle: {
      id: 'aosh.mlr.application:prerequisites.general.subTitle',
      defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
      description: 'Subtitle of prerequisites screen',
    },
    checkboxLabel: {
      id: 'aosh.mlr.application:prerequisites.general.checkboxLabel',
      defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
      description: 'Prerequisites checkbox label',
    },
    submitButton: {
      id: 'aosh.mlr.application:prerequisites.general.submitButton',
      defaultMessage: 'Staðfesta',
      description: 'Prerequisites submit button',
    },
  }),
  nationalRegistry: defineMessages({
    title: {
      id: 'aosh.mlr.application:prerequisites.nationalRegistry.title',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'National registry data provider title',
    },
    subTitle: {
      id: 'aosh.mlr.application:prerequisites.nationalRegistry.subTitle',
      defaultMessage: 'Hér sækjum við nafn, kennitölu og heimilisfang',
      description: 'National registry data provider subtitle',
    },
  }),
  userProfile: defineMessages({
    title: {
      id: 'aosh.mlr.application:prerequisites.userProfile.title',
      defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
      description: 'User profile data provider title',
    },
    subTitle: {
      id: 'aosh.mlr.application:prerequisites.userProfile.subTitle',
      defaultMessage:
        'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      description: 'User profile data provider subtitle',
    },
  }),
  machineLicenseRights: defineMessages({
    title: {
      id: 'aosh.mlr.application:prerequisites.machineLicenseRights.title',
      defaultMessage: 'Upplýsingar frá Vinnueftirlitinu',
      description: 'Machine license rights data provider title',
    },
    subTitle: {
      id: 'aosh.mlr.application:prerequisites.machineLicenseRights.subTitle',
      defaultMessage: 'Sóttar eru upplýsingar um vinnuvélaréttindi.',
      description: 'Machine license rights data provider subtitle',
    },
  }),
}
