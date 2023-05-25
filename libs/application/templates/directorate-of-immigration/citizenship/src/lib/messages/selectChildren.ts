import { defineMessages } from 'react-intl'

// Select children
export const selectChildren = {
  general: defineMessages({
    sectionTitle: {
      id:
        'doi.cs.application:section.backgroundInformation.selectChildren.sectionTitle',
      defaultMessage: 'Velja barn/börn',
      description: 'Select children section title',
    },
    pageTitle: {
      id:
        'doi.cs.application:section.backgroundInformation.selectChildren.pageTitle',
      defaultMessage: 'Veldu barn/börn',
      description: 'Select children page title',
    },
    description: {
      id:
        'doi.cs.application:section.backgroundInformation.selectChildren.description#markdown',
      defaultMessage:
        'Hér sérðu lista yfir börn sem eru skráð í þinni forsjá. Þú getur valið fyrir hvaða barn/börn á að flytja lögheimili.\\n\\nAðeins er hægt að velja börn sem eru skráð með sama lögheimili og eiga sömu foreldra.',
      description: 'Select children subtitle',
    },
  }),
  warningAgeChildren: defineMessages({
    title: {
      id: 'doi.cs.application:section.backgroundInformation.selectChildren.warningMessageTitle',
      defaultMessage: 'Til athugunar',
      description: 'Warning message for persons with children over age of 18'
    },
    information: {
      id: 'doi.cs.application:section.backgroundInformation.selectChildren.warningMessageTitle',
      defaultMessage: 'Ef barn er orðið 18 ára þegar foreldri fær veittan ríkisborgararétt getur barn ekki fylgt foreldri við veitinguna. Börn umsækjanda sem eru orðin 18 ára þegar foreldri fær veittan ríkisborgararétt þurfa að leggja fram umsókn sjálf.  Sjá nánar upplýsingar um afgreiðslutíma',
      description: 'Warning message for persons with children over age of 18'
    }
  }),
  checkboxes: defineMessages({
    title: {
      id:
        'doi.cs.application:section.backgroundInformation.selectChildren.checkboxes.title',
      defaultMessage: 'Börn í þinni forsjá',
      description: 'Title: displayed above checkboxes',
    },
    subLabel: {
      id:
        'doi.cs.application:section.backgroundInformation.selectChildren.checkboxes.sublabel',
      defaultMessage: 'Hinn forsjáraðilinn:',
      description: 'Sublabel: displayed below a childs name',
    },
  }),
}
