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
      id: 'fa.application:section.serviceCenter.general.description',
      defaultMessage:
        'Þú ert að sækja um fjárhagsaðstoð hjá þínu sveitarfélagi fyrir {currentMonth} mánuð. Áður en þú heldur áfram er gott að hafa eftirfarandi í huga:',
      description: 'About form page description',
    },
  }),
}
