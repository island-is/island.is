import { defineMessages } from 'react-intl'

export const taxReturnForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.aboutForm.general.sectionTitle',
      defaultMessage: 'Skattagögn',
      description: 'About form section title',
    },
    pageTitle: {
      id: 'fa.application:section.aboutForm.general.pageTitle',
      defaultMessage: 'Upplýsingar varðandi umsóknina',
      description: 'About form page title',
    },
    description: {
      id: 'fa.application:section.aboutForm.general.description',
      defaultMessage:
        'Þú ert að sækja um fjárhagsaðstoð hjá þínu sveitarfélagi fyrir {currentMonth} mánuð. Áður en þú heldur áfram er gott að hafa eftirfarandi í huga:',
      description: 'About form page description',
    },
  }),
}
