import { defineMessages } from 'react-intl'

export const rights = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlr.application:rights.general.sectionTitle',
      defaultMessage: 'Þín réttindi',
      description: 'Title of rights section',
    },
    title: {
      id: 'aosh.mlr.application:rights.general.title',
      defaultMessage: 'Vinnuvélaréttindi',
      description: 'Title of rights screen',
    },
    description: {
      id: 'aosh.mlr.application:rights.general.description#markdown',
      defaultMessage:
        'Hægt er að endurnýja vinnuvélaréttindi þegar sex mánuðir eru eftir af gildistíma. Sjá nánari [reglur um endurnýjun vinnuvélaréttinda](https://island.is/endurnyja-vinnuvelarettindi).',
      description: 'Description of rights screen',
    },
  }),
  labels: defineMessages({
    licenseNumber: {
      id: 'aosh.mlr.application:rights.labels.licenseNumber',
      defaultMessage: 'Númer skírteinis: {licenseNumber}',
      description: 'License number',
    },
    renewableRightsTitle: {
      id: 'aosh.mlr.application:rights.labels.renewableRightsTitle',
      defaultMessage: 'Réttindi sem verða endurnýjuð',
      description: 'Title of table with rights that will be renewed',
    },
    otherRightsTitle: {
      id: 'aosh.mlr.application:rights.labels.otherRightsTitle',
      defaultMessage: 'Önnur réttindi í gildi',
      description: 'Title of table with other valid rights',
    },
    right: {
      id: 'aosh.mlr.application:rights.labels.right',
      defaultMessage: 'Vinnuvélaréttindi',
      description: 'Table header for right',
    },
    validTo: {
      id: 'aosh.mlr.application:rights.labels.validTo',
      defaultMessage: 'Gildir til: {validTo}',
      description: 'Valid to date shown below each rights table title',
    },
  }),
}
