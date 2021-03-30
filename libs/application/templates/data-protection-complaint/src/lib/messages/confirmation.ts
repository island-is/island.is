import { defineMessage, defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    pageTitle: {
      id: 'dpac.application:section.overview.pageTitle',
      defaultMessage: 'Yfirlit kvörtunar',
      description: 'overview page title',
    },
  }),
  labels: defineMessage({
    bulletOne: {
      id: 'dpac.application:section.overview.labels.bulletOne',
      defaultMessage: `
      Almennt er áætlað að afgreiðsla kvartana geti tekið um 9-15
      mánuði en afgreiðslutími getur þó lengst enn frekar ef mál
      eru sérstaklega flókin eða umfangsmikil. Forgangsmál geta
      tekið skemmri tíma. Öll mál eru afgreidd eins hratt og mögulegt
      er og er þeim forgangsraðað eftir tilefni og getu hverju sinni. `,
      description: 'The first bullet',
    },
    bulletTwo: {
      id: 'dpac.application:section.overview.labels.bulletTwo',
      defaultMessage: `
      Telji Persónuvernd að upplýsa þurfi málið betur getur stofnunin
      óskað eftir frekari upplýsingumeða gögnum frá öllum aðilum.
      Aðilum máls er sent afrit allra bréfa. Hafi allir þættir málsins
      verið upplýstir og málið ekki til lykta leitt með öðrum hætti
      úrskurðar Persónuvernd um lögmæti þeirrar vinnslu sem kvartað er yfir.`,
      description: 'The second bullet',
    },
    pdfButton: {
      id: 'dpac.application:section.overview.labels.pdfButton',
      defaultMessage: `Skoða kvörtun í PDF skjali`,
      description: 'Open the application on a PDF format',
    },
  }),
}
