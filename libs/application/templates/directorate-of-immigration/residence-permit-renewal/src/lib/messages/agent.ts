import { defineMessages } from 'react-intl'

export const agent = {
  general: defineMessages({
    sectionTitle: {
      id: 'doi.rpr.application:agent.general.sectionTitle',
      defaultMessage: 'Umboðsmaður',
      description: 'Agent section title',
    },
  }),
  labels: defineMessages({
    pageTitle: {
      id: 'doi.rpr.application:agent.labels.pageTitle',
      defaultMessage: 'Umboðsmaður',
      description: 'Agent section page title',
    },
    description: {
      id: 'doi.rpr.application:agent.labels.description',
      defaultMessage:
        'Þú þarft aðeins að fylla út þennan lið umsóknar ef þú vilt hafa umboðsmann. Aðeins einn einstaklingur eða lögaðili getur verið umboðsmaður hverju sinni. Óskir þú eftir að fella umboð niður eða skrá nýjan umboðsmann skaltu tilkynna Útlendingastofnun það skriflega.',
      description: 'Agent section description',
    },
    title: {
      id: 'doi.rpr.application:agent.labels.title',
      defaultMessage: 'Vilt þú hafa umbosðmann?',
      description: 'Agent title',
    },
  }),
}
