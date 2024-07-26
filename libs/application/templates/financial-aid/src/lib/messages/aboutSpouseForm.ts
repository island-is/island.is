import { defineMessages } from 'react-intl'

export const aboutSpouseForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.aboutSpouseForm.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'About spouse form section title',
    },
    pageTitle: {
      id: 'fa.application:section.aboutSpouseForm.general.pageTitle',
      defaultMessage: 'Umsókn um fjárhagsaðstoð',
      description: 'About spouse form page title',
    },
    description: {
      id: 'fa.application:section.aboutSpouseForm.general.description#markdown',
      defaultMessage:
        'Maki þinn ({spouseName}) hefur sótt um fjárhagsaðstoð fyrir {currentMonth} mánuð.\n\n Svo hægt sé að klára umsóknina þurfum við að fá þig til að hlaða upp **tekjugögnum** til að reikna út fjárhagsaðstoð til útgreiðslu í byrjun {nextMonth}.',
      description: 'About spouse form page description',
    },
  }),
}
