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
        'Skírteinin verða bæði aðgengileg á mínum síðum Ísland.is, í appinu og einnig send á heimilisfang ef óskað var eftir því. Tilkynningin verður send þegar skírteini hafa verið gerð aðgengileg.',
      description: 'Conclusion expandable description',
    },
  }),
}
