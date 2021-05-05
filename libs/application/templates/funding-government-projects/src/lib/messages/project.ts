import { defineMessages } from 'react-intl'

export const project = {
  general: defineMessages({
    pageTitle: {
      id: `affgp.application:section.project.pageTitle`,
      defaultMessage: 'Verkefnið',
      description: 'Project page title',
    },
    pageDescription: {
      id: `affgp.application:section.project.pageDescription`,
      defaultMessage: 'Upplýsingar um það verkefni sem þarfnast fjármögnunar',
      description: 'Project page description',
    },
  }),
  labels: defineMessages({
    projectInfoFieldTitle: {
      id: `affgp.application:section.project.projectInfoFieldTitle`,
      defaultMessage: 'Upplýsingar um verkefnið',
      description: 'Project Info Field Title',
    },
    projectTitle: {
      id: `affgp.application:section.project.projectTitle`,
      defaultMessage: 'Heiti verkefnis',
      description: 'Project Title',
    },
    projectTitlePlaceholder: {
      id: `affgp.application:section.project.projectTitlePlaceholder`,
      defaultMessage: 'Heiti verkefnis sem þarfnast fjármögnunar',
      description: 'Project Title Placeholder',
    },
    projectDescription: {
      id: `affgp.application:section.project.projectDescription`,
      defaultMessage: 'Lýsing á verkefni',
      description: 'Project Description',
    },
    projectDescriptionPlaceholder: {
      id: `affgp.application:section.project.projectDescriptionPlaceholder`,
      defaultMessage: 'Stutt lýsing á verkefni og niðurstöðum úr ávinningsmati',
      description: 'Project Description Placeholder',
    },
    projectCost: {
      id: `affgp.application:section.project.projectCost`,
      defaultMessage: 'Heildarkostnaður',
      description: 'Project Cost',
    },
    projectCostPlaceholder: {
      id: `affgp.application:section.project.projectCostPlaceholder`,
      defaultMessage:
        'Hver er heildarkostnaður verkefnisins sem þarfnast fjármögnunar?',
      description: 'Project Cost Placeholder',
    },
    projectYears: {
      id: `affgp.application:section.project.projectYears`,
      defaultMessage: 'Fjöldi ára sem koma til endurgreiðslu á kostnaði',
      description: 'Project Years',
    },
  }),
}
