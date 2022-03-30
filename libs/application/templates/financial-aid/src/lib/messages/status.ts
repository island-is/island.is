import { defineMessages } from 'react-intl'

export const status = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.status.general.sectionTitle',
      defaultMessage: 'Staða umsóknar fyrir fjárhagsaðstoð',
      description: 'Status section title',
    },
    pageTitle: {
      id: 'fa.application:section.status.general.pageTitle',
      defaultMessage: 'Aðstoðin þín',
      description: 'Status page title',
    },
  }),
  moreActions: defineMessages({
    title: {
      id: 'fa.application:section.status.moreActions.title',
      defaultMessage: 'Frekari aðgerðir í boði',
      description: 'More action title',
    },
    rulesLink: {
      id: 'fa.application:section.status.moreActions.rulesLink#markup',
      defaultMessage: '[Reglur um fjárhagsaðstoð]({rulesPage})',
      description: 'More action link to rules',
    },
    emailLink: {
      id: 'fa.application:section.status.moreActions.emailLink#markup',
      defaultMessage: '[Hafa samband]({email})',
      description: 'More action link to email',
    },
  }),
}
