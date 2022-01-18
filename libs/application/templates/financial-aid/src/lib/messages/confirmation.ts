import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Student form section title',
    },
    pageTitle: {
      id: 'fa.application:section.confirmation.general.pageTitle',
      defaultMessage: 'Staðfesting',
      description: 'Student form page title',
    },
  }),
  nextSteps: defineMessages({
    title: {
      id: 'fa.application:section.confirmation.nextSteps.title',
      defaultMessage: '   Hér eru næstu skref',
      description: 'Student form next step title',
    },
    content: {
      id: 'fa.application:section.confirmation.nextSteps.content#markup',
      defaultMessage:
        '* Vinnsluaðili sveitarfélagsins vinnur úr umsókninni. Umsóknin verður afgreidd eins fljótt og auðið er. \n* Ef umsóknin er samþykkt getur þú reiknað með útgreiðslu í byrjun október. \n* Ef þörf er á frekari upplýsingum eða gögnum til að vinna úr umsókninni mun vinnsluaðili sveitarfélagsins hafa samband.',
      description: 'Student form next steps',
    },
  }),
}
