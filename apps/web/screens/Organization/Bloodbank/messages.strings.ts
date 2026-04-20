import { defineMessages } from 'react-intl'

export const m = {
  listPage: defineMessages({
    effectiveDatePrefix: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.effectiveDatePrefix',
      defaultMessage: 'Gildir frá: ',
      description: 'Texti fyrir áfangadag í spjaldi',
    },
    arrowLinkLabel: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.arrowLinkLabel',
      defaultMessage: 'Undantekningar og athugasemdir',
      description: 'Texti fyrir hlekk í spjaldi',
    },
    cardSubheading: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.cardSubheading',
      defaultMessage: 'Áhrif á blóðgjöf',
      description: 'Texti undirtitil í spjaldi',
    },
    errorTitle: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.errorTitle',
      defaultMessage: 'Ekki tókst að sækja niðurstöður',
      description:
        'Titill á fyrir villueiningu ef ekki tekst að sækja niðurstöður',
    },
    errorDescription: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.errorDescription',
      defaultMessage: 'Villa kom upp við að sækja niðurstöður',
      description:
        'Lýsing á fyrir villueiningu ef ekki tekst að sækja niðurstöður',
    },
    mainHeading: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.mainHeading',
      defaultMessage: 'Hvenær má gefa blóð',
      description: 'Texti fyrir aðal heading á yfirlitssíðu',
    },
    keywordsTextPrefix: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.keywordsTextPrefix',
      defaultMessage: 'Lykilorð: ',
      description: 'Texti á undan lykilorðum í spjaldi',
    },
    searchInputPlaceholder: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.searchInputPlaceholder',
      defaultMessage: 'Sía eftir leitarorði',
      description: 'Placeholder texti í leitarreit',
    },
  }),
  detailsPage: defineMessages({
    detailTextHeading: {
      id: 'web.bloodbank.bloodDonationRestrictions:detailsPage.detailTextHeading',
      defaultMessage: 'Nánar um áhrif',
      description: 'Nánar um áhrif (heading fyrir ofan texta á details síðu)',
    },
    cardSubheading: {
      id: 'web.bloodbank.bloodDonationRestrictions:detailsPage.cardSubheading',
      defaultMessage: 'Undantekningar og athugasemdir',
      description: 'Texti undirtitil í spjaldi',
    },
  }),
}
