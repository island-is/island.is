import { defineMessages } from 'react-intl'

export const serviceCenter = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.serviceCenter.general.sectionTitle',
      defaultMessage: 'Sveitarfélagi',
      description: 'Service center section title',
    },
    pageTitle: {
      id: 'fa.application:section.serviceCenter.general.pageTitle',
      defaultMessage: 'Fjárhagsaðstoð hjá þínu sveitarfélagi',
      description: 'Service center page title',
    },
    description: {
      id: 'fa.application:section.serviceCenter.general.description#markdown',
      defaultMessage:
        'Samkvæmt **Þjóðskrá** ert þú með lögheimili í **{applicantsServiceCenter}**',
      description: 'Service center description',
    },
    notRegistered: {
      id: 'fa.application:section.serviceCenter.general.notRegistered',
      defaultMessage:
        'Þitt sveitarfélag er ekki komið inn í þetta umsóknarferli. Kynntu þér málið eða sæktu um fjárhagsaðstoð á heimasíðu þíns sveitarfélags eða þess sveitarfélags sem sér um fjárhagsaðstoð hjá þínu sveitarfélagi.',
      description: 'When service center is not regisitered',
    },
    linkToServiceCenter: {
      id: 'fa.application:section.serviceCenter.general.linkToServiceCenter',
      defaultMessage: 'Fjárhagsaðstoð {applicantsServiceCenter}',
      description: 'Service center page title',
    },
  }),
}
