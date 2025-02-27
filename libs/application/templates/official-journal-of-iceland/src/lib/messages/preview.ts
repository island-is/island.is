import { defineMessages } from 'react-intl'

export const preview = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:preview.general.title',
      defaultMessage: 'Forskoðun',
      description: 'Title of the preview form',
    },
    intro: {
      id: 'ojoi.application:preview.general.intro',
      defaultMessage:
        'Auglýsandi ber ábyrgð á efni auglýsingar sem send er til birtingar í Stjórnartíðindum og hefur sú birting réttaráhrif. Í þessu skrefi er mikilvægt að forskoða vefbirtinguna og yfirfara og tryggja að innihald og uppsetning séu rétt. Ef þörf er á lagfæringum er hægt að fara aftur í skráningu máls og lagfæra. Leiðbeiningar um uppsetningu mála má finna hér - Linkur á leiðbeiningar. {br} ATH! Á þessu stigi liggja ekki fyrir upplýsingar um númer máls og útgáfudag í Stjórnartíðindum. Þær upplýsingar bætast sjálfkrafa við þegar auglýsingin birtist á stjornartidindi.is.',
      description: 'Intro of the preview form',
    },
    section: {
      id: 'ojoi.application:preview.general.section',
      defaultMessage: 'Forskoðun',
      description: 'Title of the preview section',
    },
  }),
  errors: defineMessages({
    noContent: {
      id: 'ojoi.application:preview.errors.noContent',
      defaultMessage: 'Upplýsingar vantar í skráningu auglýsingar',
      description: 'Error message when content is missing',
    },
    noContentMessage: {
      id: 'ojoi.application:preview.errors.noContentMessage',
      defaultMessage: 'Að lágmarki þarf að fylla út',
      description: 'Error message when content is missing',
    },
    pdfError: {
      id: 'ojoi.application:preview.errors.pdfError',
      defaultMessage: 'Villa kom upp við að sækja skjal',
      description: 'Error message when pdf download fails',
    },
    pdfErrorMessage: {
      id: 'ojoi.application:preview.errors.pdfErrorMessage',
      defaultMessage: 'Ekki tókst að sækja skjal, reyndu aftur',
      description: 'Error message when pdf download fails',
    },
    invalidPdf: {
      id: 'ojoi.application:preview.errors.invalidPdf',
      defaultMessage: 'Ógilt skjal',
      description: 'Error message when pdf is invalid',
    },
    invalidPdfMessage: {
      id: 'ojoi.application:preview.errors.invalidPdfMessage',
      defaultMessage: 'Skjalið er ógilt eða á vitlausu formi, reyndu aftur',
      description: 'Error message when pdf is invalid',
    },
  }),
  buttons: defineMessages({
    fetchPdf: {
      id: 'ojoi.application:preview.buttons.fetchPdf',
      defaultMessage: 'Sækja pdf',
      description: 'Label of the fetch pdf button',
    },
    fetchPdfNoDate: {
      id: 'ojoi.application:preview.buttons.fetchPdfNoDate',
      defaultMessage: 'Sækja pdf án dags.',
      description: 'Label of the fetch pdf button without date',
    },
    copyPreviewLink: {
      id: 'ojoi.application:preview.buttons.copyPreviewLink',
      defaultMessage: 'Afrita hlekk á forskoðunarskjal',
      description: 'Label of the copy link button',
    },
  }),
}
