import { defineMessages } from 'react-intl'

// Contract
export const contract = {
  general: defineMessages({
    pageTitle: {
      id: 'crc.application:section.contract.overview.pageTitle',
      defaultMessage: 'Samningur',
      description: 'Contract page title',
    },
    description: {
      id: 'crc.application:section.contract.overview.description#markdown',
      defaultMessage:
        'Hér er yfirlit yfir samning um breytt lögheimili. __Þú og {otherParent}__ þurfa að staðfesta með undirritun áður en umsóknin fer í afgreiðslu hjá sýslumanni.\\n\\nBreyting á lögheimili og þar með á greiðslu meðlags og barnabóta tekur gildi eftir að sýslumaður hefur staðfest samninginn.',
      description: 'Contract page description',
    },
    parentBDescription: {
      id: 'crc.application:section.contract.overview.parentBDescription#markdown',
      defaultMessage:
        'Hér er yfirlit yfir samning um breytt lögheimili og meðlag. __{otherParent}__ hefur nú þegar undrritað samningin og næst þarft þú að undirrita áður en umsóknin fer í afgreiðslu hjá sýslumanni.\\n\\nBreyting á lögheimili og þar með á greiðslu meðlags og barnabóta tekur gildi eftir að sýslumaður hefur staðfest samninginn.',
      description: 'Contract page description for parent B',
    },
  }),
  labels: defineMessages({
    childName: {
      id: 'crc.application:section.contract.overview.labels.childName',
      defaultMessage:
        '{count, plural, =0 {Nafn barns} one {Nafn barns} other {Nöfn barna}}',
      description: 'Label for a child names',
    },
    contactInformation: {
      id: 'crc.application:section.contract.overview.labels.contactInformation',
      defaultMessage: 'Tengiliðaupplýsingar þínar',
      description: 'Label for parent contact information',
    },
    currentResidence: {
      id: 'crc.application:section.contract.overview.labels.currentResidence',
      defaultMessage: 'Núverandi lögheimilisforeldri:',
      description: 'Label for current residence',
    },
    newResidence: {
      id: 'crc.application:section.contract.overview.labels.newResidence',
      defaultMessage: 'Nýtt lögheimilisforeldri:',
      description: 'Label for new residence',
    },
  }),
  childBenefit: defineMessages({
    label: {
      id: 'crc.application:section.contract.overview.childBenefit.label',
      defaultMessage: 'Framfærsla',
      description: 'Label for child benefit',
    },
    text: {
      id: 'crc.application:section.contract.overview.childBenefit.text#markdown',
      defaultMessage:
        '{currentResidenceParentName} greiðir einfalt meðlag með hverju barni til nýs lögheimilisforeldris.',
      description: 'Text for child benefit',
    },
    agreementText: {
      id: 'crc.application:section.contract.overview.childBenefit.agreementText#markdown',
      defaultMessage:
        'Samkomulag er um framfærslu, ekki verður af greiðslu hefðbundins meðlags.',
      description: 'Text for child benefit agreement',
    },
  }),
  duration: defineMessages({
    text: {
      id: 'crc.application:section.contract.overview.duration.text',
      defaultMessage: 'Samningurinn er tímabundinn og gildir til {date}',
      description: 'Duration contract text',
    },
    permanentText: {
      id: 'crc.application:section.contract.overview.duration.permanentText',
      defaultMessage:
        'Samningurinn er varanlegur þar til barn hefur náð 18 ára aldri',
      description: 'Duration contract permanent text',
    },
  }),
  checkbox: defineMessages({
    label: {
      id: 'crc.application:section.contract.overview.checkbox.label',
      defaultMessage:
        'Ég hef lesið yfir samningsskjalið og er tilbúin/n að undirrita samninginn',
      description: 'Label for confirm checkbox',
    },
  }),
  pdfButton: defineMessages({
    label: {
      id: 'crc.application:section.contract.overview.pdfButton.label',
      defaultMessage: 'Sjá samning á PDF skjali',
      description: 'Label for PDF button',
    },
  }),
}
