import { defineMessages } from 'react-intl'

export const conclution = {
  general: defineMessages({
    sectionTitle: {
      id: 'hid.application:conclution.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Conclution section title',
    },
    descriptionFieldTitle: {
      id: 'hid.application:conclution.descriptionFieldTitle',
      defaultMessage: 'Umsókn er móttekin og afgreidd',
      description: 'Conclution section description field title',
    },
    descriptionFieldMessage2: {
      id: 'hid.application:conclution.descriptionFieldMessage2#markdown',
      defaultMessage: `* Tryggingaryfirlýsingin hefur verið send í stafrænt pósthólf hér\n\n* Tryggingaryfirlýsingar barna fara í pósthólf umsækjanda.\n\n* Þú getur einnig hlaðið niður skjölunum hér`,
      description: 'Conclution section description field message',
    },
  }),
  downloadButtonAriaLabel: {
    id: 'hid.application:conclution.downloadButtonAriaLabel',
    defaultMessage: 'Hlaða niður skrá',
    description: 'Aria label for download button',
  },
}
