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
    },
    linkTitle: {
      id: 'doi.cs.application:section.backgroundInformation.selectChildren.linkTitle',
      defaultMessage: 'afgreiðslutíma',
      description: 'title of link in text'
    },
    linkUrl: {
      id: 'doi.cs.application:section.backgroundInformation.selectChildren.linkUrl',
      defaultMessage: 'https://www.mbl.is',
      description: 'url of the link in text'
    },
  }),
  informationChildrenSection: defineMessages({
    title: {
      id: 'doi.cs.application:section.backgroundInformation.selectChildren.informationChildrenSectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'information message title for persons with children between 12 and 17 years of age'
    },
    information: {
      id: 'doi.cs.application:section.backgroundInformation.selectChildren.informationChildrenSectionMessage#markdown',
      defaultMessage: 
        `Ef foreldrar fara sameiginlega með forsjá barns þarf að skila inn undirrituðu samþykki hins forsjárforeldrisins til Útlendingastofnunar. \n\n Ef sótt er um ríkisborgararétt fyrir barn á aldrinum 12-17 ára þarf að skila undirrituðu samþykki þess til Útlendingastofnunar`,
      description: 'information message for persons with children between 12 and 17 years of age'
    },
    linkTitle: {
      id: 'doi.cs.application:section.backgroundInformation.selectChildren.informationChildrenSectionLinkTitle',
      defaultMessage: 'Sjá eyðublöð á vefsíðu Útlendingastofnunar',
      description: 'title of link in text'
    },
    linkUrl: {
      id: 'doi.cs.application:section.backgroundInformation.selectChildren.informationChildrenSectionLinkUrl',
      defaultMessage: 'https://assets.ctfassets.net/8k0h54kbe6bj/5CWucx9zDz2QVPHaUwxW4n/dca72b9eade259a74717055546044a0d/samthykki-barns-rbr.pdf',
      description: 'url of the link in text'
    },
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
