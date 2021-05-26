import { defineMessages } from 'react-intl'

// Contract
export const contract = {
  general: defineMessages({
    pageTitle: {
      id: 'jca.application:section.contract.overview.pageTitle',
      defaultMessage:
        'Samningur foreldra um sameiginlega forsjá, lögheimili og meðlag',
      description: 'Contract page title',
    },
    description: {
      id: 'jca.application:section.contract.overview.description#markdown',
      defaultMessage:
        'Hér er yfirlit yfir drög að samningi um sameiginlega forsjá. __Þú og {otherParent}__ þurfið að staðfesta með undirritun áður en umsóknin fer í afgreiðslu hjá sýslumanni.\\n\\nBreytingin tekur gildi eftir að sýslumaður hefur staðfest samninginn.',
      description: 'Contract page description',
    },
    parentBDescription: {
      id:
        'jca.application:section.contract.overview.parentBDescription#markdown',
      defaultMessage:
        'Hér er yfirlit yfir samning um sameiginlega forsjá og meðlag. __{otherParent}__ hefur nú þegar undrritað samningin og næst þarft þú að undirrita áður en umsóknin fer í afgreiðslu hjá sýslumanni.\\n\\nBreyting á forsjá og þar með á greiðslu meðlags og barnabóta tekur gildi eftir að sýslumaður hefur staðfest samninginn.',
      description: 'Contract page description for parent B',
    },
  }),
  labels: defineMessages({
    childName: {
      id: 'jca.application:section.contract.overview.labels.childName',
      defaultMessage:
        '{count, plural, =0 {Nafn barns} one {Nafn barns} other {Nöfn barna}}',
      description: 'Label for a child names',
    },
    contactInformation: {
      id: 'jca.application:section.contract.overview.labels.contactInformation',
      defaultMessage: 'Tengiliðaupplýsingar þínar',
      description: 'Label for parent contact information',
    },
    parents: {
      id: 'jca.application:section.contract.overview.labels.parents',
      defaultMessage: 'Foreldrar sem gera samninginn',
      description: 'Label for parents that are applying for joint custody',
    },
    custodyChange: {
      id: 'jca.application:section.contract.overview.labels.custodyChange',
      defaultMessage: 'Breyting á forsjá',
      description: 'Label for new custody aggreement',
    },
  }),
  arrangement: defineMessages({
    currentCustodyParent: {
      id:
        'jca.application:section.contract.overview.arrangement.currentCustodyParent',
      defaultMessage: 'Núverandi forsjárforeldri er {parentName}',
      description: 'The parent currently with custody',
    },
    jointCustody: {
      id: 'jca.application:section.contract.overview.arrangement.jointCustody',
      defaultMessage: 'Forsjá verður {boldText}',
      description: 'Joint custody',
    },
    joint: {
      id: 'jca.application:section.contract.overview.arrangement.joint',
      defaultMessage: 'sameiginleg',
      description:
        'Text to be displayed as bold within the jca.application:section.contract.overview.arrangement.jointCustody string',
    },
    legalResidence: {
      id:
        'jca.application:section.contract.overview.arrangement.legalResidence',
      defaultMessage: 'Logheimilisforeldri verður {parentName}',
      description: 'Legal residence parent',
    },
  }),
  childBenefit: defineMessages({
    label: {
      id: 'jca.application:section.contract.overview.childBenefit.label',
      defaultMessage: 'Meðlag',
      description: 'Label for child benefit',
    },
    text: {
      id:
        'jca.application:section.contract.overview.childBenefit.text#markdown',
      defaultMessage:
        '__{currentResidenceParentName}__ greiðir einfalt meðlag með hverju barni.\\nEf foreldrar greiða aukið meðlag þarf að semja að nýju og leita staðfestingar sýslumanns.',
      description: 'Text for child benefit',
    },
  }),
  duration: defineMessages({
    text: {
      id: 'jca.application:section.contract.overview.duration.text',
      defaultMessage: 'Samningurinn er tímabundinn og gildir til {date}',
      description: 'Duration contract text',
    },
  }),
  pdfButton: defineMessages({
    label: {
      id: 'jca.application:section.contract.overview.pdfButton.label',
      defaultMessage: 'Samningur á PDF skjali',
      description: 'Label for PDF button',
    },
  }),
}
