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
    descriptionFieldMessage: {
      id: 'hid.application:conclution.descriptionFieldMessage#markdown',
      defaultMessage: `* Tryggingaryfirlýsingin hefur verið send í stafrænt pósthólf hér.
* Tryggingaryfirlýsingar barna fara í pósthólf umsækjanda.
* Þú getur einnig hlaðið niður skjölunum hér`,
      description: 'Conclution section description field message',
    },
  }),
  downloadButtonAriaLabel: {
    id: 'hid.application:conclution.downloadButtonAriaLabel',
    defaultMessage: 'Hlaða niður skrá',
    description: 'Aria label for download button',
  },
}
