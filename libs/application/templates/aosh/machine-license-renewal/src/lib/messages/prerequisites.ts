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
      defaultMessage: 'Gagnaöflun',
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
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
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
  errors: defineMessages({
    noRightsTitle: {
      id: 'aosh.mlr.application:prerequisites.errors.noRightsTitle',
      defaultMessage: 'Engin vinnuvélaréttindi',
      description:
        'Title of error when the applicant has no machine license rights',
    },
    noRights: {
      id: 'aosh.mlr.application:prerequisites.errors.noRights',
      defaultMessage:
        'Þú ert ekki með skráð vinnuvélaréttindi hjá Vinnueftirlitinu.',
      description: 'Error when the applicant has no machine license rights',
    },
    noRightsToRenewTitle: {
      id: 'aosh.mlr.application:prerequisites.errors.noRightsToRenewTitle',
      defaultMessage: 'Engin réttindi til endurnýjunar',
      description: 'Title of error when the applicant has no rights to renew',
    },
    noRightsToRenew: {
      id: 'aosh.mlr.application:prerequisites.errors.noRightsToRenew',
      defaultMessage:
        'Vinnuvélaréttindin þín eru ekki komin á endurnýjunartíma. Hægt er að endurnýja réttindi þegar sex mánuðir eða minna eru eftir af gildistíma.',
      description:
        'Error when the applicant has machine license rights but none that can be renewed yet',
    },
  }),
}
