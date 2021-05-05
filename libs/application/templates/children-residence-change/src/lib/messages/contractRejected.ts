import { defineMessages } from 'react-intl'

export const contractRejected = {
  general: defineMessages({
    sectionTitle: {
      id: 'crc.application:section.contractRejected.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Contract rejected section title',
    },
    pageTitle: {
      id: 'crc.application:section.contractRejected.general.pageTitle',
      defaultMessage: 'Samning um breytt lögheimili hafnað',
      description: 'Contract rejected title',
    },
    description: {
      id:
        'crc.application:section.contractRejected.general.description#markdown',
      defaultMessage: 'Þú hefur hafnað samningi um breytt lögheimili.',
      description: 'Counterparty contract rejected description text',
      applicant: {
        id:
          'crc.application:section.contractRejected.general.description.applicant#markdown',
        defaultMessage:
          '__{counterPartyName}__ hafnaði umsókn þinni um breytt lögheimili.',
        description: 'Applicant contract rejected description text',
      },
    },
  }),
  nextSteps: {
    title: {
      id: 'crc.application:section.contractRejected.nextSteps.title',
      defaultMessage: 'Næstu skref',
      description: 'Contract rejected next steps title',
    },
    description: {
      id:
        'crc.application:section.contractRejected.nextSteps.description#markdown',
      defaultMessage:
        '- Þið getið útbúið nýjan samning með því að hefja ferlið aftur.\\n\\n - Þú getur sent beiðni um lögheimilisbreytingu á sýslumann, sem tekur málið til meðferðar.\\n\\n -Þú getur óskað eftir viðtali hjá sýslumanni til að ræða næstu skref.',
      description: 'Contract rejected next steps description',
    },
  },
}
