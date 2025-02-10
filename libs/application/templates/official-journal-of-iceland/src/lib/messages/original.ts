import { defineMessages } from 'react-intl'

export const original = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:original.general.title',
      defaultMessage: 'Frumrit',
      description: 'Title of the original data form',
    },
    intro: {
      id: 'ojoi.application:original.general.intro',
      defaultMessage:
        'Hér skal setja inn skjal sem er skannað afrit af frumtexta auglýsingarinnar þar sem koma fram undirritanir þeirra sem við á. Undirritun máls er staðfesting á innihaldi og réttmæti auglýsingar sem send hefur verið til birtingar í Stjórnartíðindum og er lagalega bindandi. Þetta skjal verður ekki birt á vef Stjórnartíðinda en er vistað í innri kerfum. ',
      description: 'Intro of the original data form',
    },
    section: {
      id: 'ojoi.application:original.general.section',
      defaultMessage: 'Frumrit',
      description: 'Title of the original data section',
    },
  }),
  fileUpload: defineMessages({
    header: {
      id: 'ojoi.application:original.fileUpload.header',
      defaultMessage:
        'Dragðu skannað afrit eða rafrænt undirritað skjal með frumtexta',
      description: 'Header of the file upload',
    },
    description: {
      id: 'ojoi.application:original.fileUpload.description',
      defaultMessage: 'Tekið er við skjali af gerð .pdf',
      description: 'Description of the file upload',
    },
    buttonLabel: {
      id: 'ojoi.application:original.fileUpload.buttonLabel',
      defaultMessage: 'Veljið skjal',
      description: 'Label of the file upload button',
    },
  }),
}
