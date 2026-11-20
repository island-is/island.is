import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    sectionTitle: {
      id: 'aosh.mlr.application:conclusion.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion section',
    },
    title: {
      id: 'aosh.mlr.application:conclusion.general.title',
      defaultMessage: 'Umsókn móttekin!',
      description: 'Title of conclusion screen',
    },
    alertTitle: {
      id: 'aosh.mlr.application:conclusion.general.alertTitle',
      defaultMessage: 'Umsókn um endurnýjun vinnuvélaréttinda móttekin.',
      description: 'Conclusion alert title',
    },
    expandableHeader: {
      id: 'aosh.mlr.application:conclusion.general.expandableHeader',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion expandable header',
    },
    expandableDescription: {
      id: 'aosh.mlr.application:conclusion.general.expandableDescription#markdown',
      defaultMessage:
        'Uppfært skírteini verður sýnilegt á mínum síðum, í appinu og einnig sent á heimilisfang ef óskað var eftir því. Tilkynning verður send þegar skírteinið hefur verið gert aðgengilegt.',
      description: 'Conclusion expandable description',
    },
  }),
}
