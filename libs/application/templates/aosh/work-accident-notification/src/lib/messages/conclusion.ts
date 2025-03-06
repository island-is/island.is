import { defineMessages } from 'react-intl'

export const conclusion = {
  general: defineMessages({
    title: {
      id: 'aosh.wan.application:conclusion.general.title',
      defaultMessage: 'Staðfesting',
      description: 'Title of conclusion screen',
    },
  }),
  default: defineMessages({
    alertTitle: {
      id: 'aosh.wan.application:conclusion.default.alertTitle',
      defaultMessage: 'Tilkynning um vinnuslys móttekin!',
      description: 'Conclusion seller alert title',
    },
    accordionTitle: {
      id: 'aosh.wan.application:conclusion.default.accordionTitle',
      defaultMessage: 'Hvað gerist næst?',
      description: 'Conclusion seller accordion title',
    },
    accordionText: {
      id: 'aosh.wan.application:conclusion.default.accordionText',
      defaultMessage: `Eu velit scelerisque quam quisque sit vivamus sed ullamcorper. Dapibus tristique et nisi nec. Lobortis et sagittis eget at. Nulla morbi bibendum ipsum nullam donec feugiat lacus. Ultrices nunc tortor orci at. Non enim mi sagittis interdum volutpat.`,
      description: 'Conclusion seller accordion text',
    },
  }),
  pdfOverview: defineMessages({
    download: {
      id: 'aosh.wan.application:conclusion.pdfOverview.download',
      defaultMessage: 'Hlaða niður',
      description: 'Conclusion pdf download button text',
    },
    pdfName: {
      id: 'aosh.wan.application:conclusion.pdfOverview.pdfName',
      defaultMessage: 'Tilkynning um vinnuslys',
      description: 'Conclusion pdf name',
    },
  }),
}
