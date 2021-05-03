import { defineMessages } from 'react-intl'
import { ApplicationConfigurations } from '@island.is/application/core'
const t = ApplicationConfigurations.FundingGovernmentProjects.translation

// Global string for the application
export const application = defineMessages({
  name: {
    id: `${t}:application.name`,
    defaultMessage: 'Umsókn um fjármögnun ríkisverkefnis',
    description: 'Name of the Funding Government Projects application',
  },
  description: {
    id: `${t}:application.description`,
    defaultMessage: 'Lýsing á umsókn um fjármögnun ríkisverkefnis',
    description: 'Description of the Funding Government Projects application',
  },
})
