import { defineMessages } from 'react-intl'
import { ApplicationConfigurations } from '@island.is/application/core'
const t = ApplicationConfigurations.FundingGovernmentProjects.translation

export const section = defineMessages({
  definitionOfApplicant: {
    id: `${t}:section.definitionOfApplicant`,
    defaultMessage: 'Yfirlit',
    description: 'Definition of applicant section title',
  },
  informationAboutInstitution: {
    id: `${t}:section.informationAboutInstitution`,
    defaultMessage: 'Upplýsingar um stofnun',
    description: 'Definition of Information About Institution section title',
  },
  project: {
    id: `${t}:section.project`,
    defaultMessage: 'Upplýsingar um verkefnið',
    description: 'Definition of project section title',
  },
  overview: {
    id: `${t}:section.overview`,
    defaultMessage: 'Yfirlit og staðfesting umsóknar',
    description: 'Overview Section Title',
  },
  submitted: {
    id: `${t}:section.submitted`,
    defaultMessage: 'Takk fyrir umsóknina',
    description: 'Submitted Section Title',
  },
})
