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
      Vinsamlegast athugið að þegar kvörtun er tekin til meðferðar
      er gagnaðila tilkynnt um aðborist hafi kvörtun frá tilteknum
      nafngreindum aðila og honum gefinn kostur á að koma áframfæri andmælum sínum.
      Kvartanda er einnig gefið færi á að koma að athugasemdumvið andmæli þess
      sem kvartað er yfir. Svarfrestur málsaðila er að jafnaði þrjár vikur.`,
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
