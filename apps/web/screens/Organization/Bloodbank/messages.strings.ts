import { defineMessages } from 'react-intl'

export const m = {
  listPage: defineMessages({
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
    mainHeading: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.mainHeading',
      defaultMessage: 'Hvenær má gefa blóð',
      description: 'Texti fyrir aðal heading á yfirlitssíðu',
    },
    cardDescriptionPrefix: {
      id: 'web.bloodbank.bloodDonationRestrictions:listPage.cardDescriptionPrefix',
      defaultMessage: 'Lýsing: ',
      description: 'Texti á undan lýsingu í spjaldi',
    },
  }),
  detailsPage: defineMessages({
    detailTextHeading: {
      id: 'web.bloodbank.bloodDonationRestrictions:detailsPage.detailTextHeading',
      defaultMessage: 'Nánar um áhrif',
      description: 'Nánar um áhrif (heading fyrir ofan texta á details síðu)',
    },
  }),
}
