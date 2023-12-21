import { defineMessages } from 'react-intl'

export const preview = {
  general: defineMessages({
    formTitle: {
      id: 'ojoi.application:preview.general.formTitle',
      defaultMessage: 'Forskoðun',
      description: 'Title of the preview form',
    },
    formIntro: {
      id: 'ojoi.application:preview.general.formIntro',
      defaultMessage:
        'Auglýsandi ber ábyrgð á efni auglýsingar sem send er til birtingar í Stjórnartíðindum og hefur sú birting réttaráhrif. Í þessu skrefi er mikilvægt að forskoða vefbirtinguna og yfirfara og tryggja að innihald og uppsetning séu rétt. Ef þörf er á lagfæringum er hægt að fara aftur í skráningu máls og lagfæra. Leiðbeiningar um uppsetningu mála má finna hér - Linkur á leiðbeiningar. {br} ATH! Á þessu stigi liggja ekki fyrir upplýsingar um númer máls og útgáfudag í Stjórnartíðindum. Þær upplýsingar bætast sjálfkrafa við þegar auglýsingin birtist á stjornartidindi.is.',
      description: 'Intro of the preview form',
    },
    sectionTitle: {
      id: 'ojoi.application:preview.general.sectionTitle',
      defaultMessage: 'Forskoðun',
      description: 'Title of the preview section',
    },
  }),
  buttons: defineMessages({
    fetchPdf: {
      id: 'ojoi.application:preview.buttons.fetchPdf',
      defaultMessage: 'Sækja pdf',
      description: 'Label of the fetch pdf button',
    },
    copyPreviewLink: {
      id: 'ojoi.application:preview.buttons.copyPreviewLink',
      defaultMessage: 'Afrita hlekk á forskoðunarskjal',
      description: 'Label of the copy link button',
    },
  }),
}
