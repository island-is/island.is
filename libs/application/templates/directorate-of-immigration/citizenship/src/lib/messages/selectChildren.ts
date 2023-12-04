import { defineMessages } from 'react-intl'

// Select children
export const selectChildren = {
  general: defineMessages({
    subSectionTitle: {
      id: 'doi.cs.application:selectChildren.subSectionTitle',
      defaultMessage: 'Börn í þinni forsjá',
      description: 'Pick children sub section title',
    },
    pageTitle: {
      id: 'doi.cs.application:selectChildren.pageTitle',
      defaultMessage: 'Börn í þinni forsjá',
      description: 'Pick children page title',
    },
    sectionTitle: {
      id: 'doi.cs.application:selectChildren.sectionTitle',
      defaultMessage: 'Velja barn/börn',
      description: 'Select children section title',
    },
    description: {
      id: 'doi.cs.application:selectChildren.description',
      defaultMessage:
        'Eftirfarandi börn eru í þinni forsjá og eru skráð með lögheimili á Íslandi. Hakaðu við þau börn sem þú vilt að hljóti íslenskan ríkisborgararétt samhliða því að þú fáir veitingu.',
      description: 'Pick children description',
    },
    maxNumberTitle: {
      id: 'doi.cs.application:selectChildren.maxNumberTitle',
      defaultMessage: 'Fjöldatakmörkun',
      description: 'Maximum number of children title',
    },
    maxNumberDescription: {
      id: 'doi.cs.application:selectChildren.maxNumberDescription',
      defaultMessage: 'Ekki hægt að sækja um fyrir svona mörg börn',
      description: 'Maximum number of children description',
    },
  }),
  extraInformation: defineMessages({
    subSectionTitle: {
      id: 'doi.cs.application:selectChildren.extraInformation.sectionTitle',
      defaultMessage: 'Viðbótarupplýsingar barna',
      description:
        'Extra information about selected children sub section title',
    },
    description: {
      id: 'doi.cs.application:selectChildren.extraInformation.description',
      defaultMessage:
        'Vinsamlegast skráðu eftirfarandi upplýsingar fyrir valin börn',
      description: 'Extra information about selected children description',
    },
    pageTitle: {
      id: 'doi.cs.application:selectChildren.extraInformation.pageTitle',
      defaultMessage: 'Viðbótarupplýsingar barna',
      description: 'Extra information about selected children page title',
    },
    fullCustodyQuestion: {
      id: 'doi.cs.application:selectChildren.extraInformation.fullCustodyQuestion',
      defaultMessage: 'Ert þú með fulla forsjá?',
      description: 'Do you have full custody question title',
    },
    dateLabel: {
      id: 'doi.cs.application:selectChildren.extraInformation.dateLabel',
      defaultMessage: 'Fæðingardagur',
      description: 'Birth date of other parent date label',
    },
    areaSeparator: {
      id: 'doi.cs.application:selectChildren.extraInformation.areaSeparator',
      defaultMessage: 'Upplýsingar fyrir {fullName}',
      description: 'Area label for each child',
    },
    detailsDescription: {
      id: 'doi.cs.application:selectChildren.extraInformation.detailsDescription',
      defaultMessage:
        'Vinsamlegast fylltu inn eftirfarandi upplýsingar um hitt foreldrið',
      description: 'Description for details on other parent',
    },
  }),
  warningAgeChildren: defineMessages({
    title: {
      id: 'doi.cs.application:selectChildren.warningAgeChildren.title',
      defaultMessage: 'Til athugunar',
      description: 'Warning message for persons with children over age of 18',
    },
    information: {
      id: 'doi.cs.application:selectChildren.warningAgeChildren.information',
      defaultMessage:
        'Ef barn er orðið 18 ára þegar foreldri fær veittan ríkisborgararétt getur barn ekki fylgt foreldri við veitinguna. Börn umsækjanda sem eru orðin 18 ára þegar foreldri fær veittan ríkisborgararétt þurfa að leggja fram umsókn sjálf.',
      description: 'Warning message for persons with children over age of 18',
    },
    linkTitle: {
      id: 'doi.cs.application:selectChildren.warningAgeChildren.linkTitle',
      defaultMessage: 'Sjá nánar upplýsingar um afgreiðslutíma',
      description: 'title of link in text',
    },
    linkUrl: {
      id: 'doi.cs.application:selectChildren.warningAgeChildren.linkUrl',
      defaultMessage:
        'https://island.is/s/utlendingastofnun/stada-mala-og-afgreidslutimi',
      description: 'url of the link in text',
    },
  }),
  informationChildrenSection: defineMessages({
    title: {
      id: 'doi.cs.application:selectChildren.informationChildrenSection.title',
      defaultMessage: 'Upplýsingar',
      description:
        'information message title for persons with children between 12 and 17 years of age',
    },
    informationSharedCustody: {
      id: 'doi.cs.application:selectChildren.informationChildrenSection.informationSharedCustody#markdown',
      defaultMessage: `Ef foreldrar fara sameiginlega með forsjá barns þarf að skila inn undirrituðu samþykki hins forsjárforeldrisins til Útlendingastofnunar.`,
      description:
        'information message for persons with children with shared custody',
    },
    informationChildAge: {
      id: 'doi.cs.application:informationChildrenSection.informationChildAge#markdown',
      defaultMessage: `Ef sótt er um ríkisborgararétt fyrir barn á aldrinum 12-17 ára þarf að skila undirrituðu samþykki þess til Útlendingastofnunar`,
      description:
        'information message for persons with children between 12 and 17 years of age',
    },
    linkTitle: {
      id: 'doi.cs.application:selectChildren.informationChildrenSection.linkTitle',
      defaultMessage: 'Sjá eyðublöð á vefsíðu Útlendingastofnunar',
      description: 'title of link in text',
    },
    linkUrl: {
      id: 'doi.cs.application:selectChildren.informationChildrenSection.linkUrl',
      defaultMessage:
        'https://island.is/rafraen-umsokn-um-rikisborgararett/fylgigogn-umsoknar-barns',
      description: 'url of the link in text',
    },
  }),
  checkboxes: defineMessages({
    subLabel: {
      id: 'doi.cs.application:selectChildren.checkboxes.sublabel',
      defaultMessage: 'Hinn forsjáraðilinn',
      description: 'Sublabel: displayed below a childs name',
    },
    tagCitizenship: {
      id: 'doi.cs.application:selectChildren.checkboxes.tagCitizenship',
      defaultMessage: 'Ríkisfang: {citizenship}',
      description: 'Tag: citizenship',
    },
    tagLegalDomicileNotIceland: {
      id: 'doi.cs.application:selectChildren.checkboxes.tagLegalDomicileNotIceland',
      defaultMessage: 'Lögheimili utan Íslands',
      description: 'Tag: legal domicile not iceland',
    },
  }),
}
