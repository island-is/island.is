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
  timeline: defineMessages({
    title: {
      id: 'fa.application:section.status.timeline.title',
      defaultMessage: 'Umsóknarferlið',
      description: 'Timeline title',
    },
    description: {
      id: 'fa.application:section.status.timeline.description',
      defaultMessage: 'Hér geturðu séð hvað hefur gerst og hvað er framundan. Hikaðu ekki við að senda okkur athugasemd ef þú telur eitthvað óljóst eða rangt.',
      description: 'Timeline description',
    },
    receivedTitle: {
      id: 'fa.application:section.status.timeline.receivedTitle',
      defaultMessage: 'Umsókn móttekin',
      description: 'Timeline received step title',
    },
    receivedDescription: {
      id: 'fa.application:section.status.timeline.receivedDescription',
      defaultMessage: 'Umsóknin verður tekin til úrvinnslu eins fljótt og kostur er.',
      description: 'Timeline received step description',
    },
    inProgressTitle: {
      id: 'fa.application:section.status.timeline.inProgressTitle',
      defaultMessage: 'Umsókn í vinnslu',
      description: 'Timeline in progress step title',
    },
    inProgressDescription: {
      id: 'fa.application:section.status.timeline.inProgressDescription',
      defaultMessage: 'Úrvinnsla umsóknarinnar er hafin. Ef þörf er á frekari upplýsingum eða gögnum mun vinnsluaðili óska eftir því hér á þessari stöðusíðu.',
      description: 'Timeline in progress step description',
    },
    resultsTitle: {
      id: 'fa.application:section.status.timeline.resultsTitle',
      defaultMessage: 'Niðurstaða',
      description: 'Timeline results step title',
    },
    resultsDescription: {
      id: 'fa.application:section.status.timeline.resultsDescription',
      defaultMessage: 'Umsókn verður samþykkt eða henni hafnað og umsækjandi látinn vita um niðurstöðuna.',
      description: 'Timeline results step description',
    },
  }),
}
