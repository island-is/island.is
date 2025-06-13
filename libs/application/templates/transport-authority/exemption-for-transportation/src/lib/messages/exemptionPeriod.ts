import { defineMessages } from 'react-intl'

export const exemptionPeriod = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:exemptionPeriod.general.sectionTitle',
      defaultMessage: 'Tímabil',
      description: 'Title of exemption period section',
    },
    pageTitle: {
      id: 'ta.eft.application:exemptionPeriod.general.pageTitle',
      defaultMessage: 'Tímabil',
      description: 'Title of exemption period page',
    },
    description: {
      id: 'ta.eft.application:exemptionPeriod.general.description',
      defaultMessage:
        'Vinsamlega veldu tímabil sem ósk um flutning á að taka gildi',
      description: 'Description of exemption period page',
    },
  }),
  type: defineMessages({
    subtitle: {
      id: 'ta.eft.application:exemptionPeriod.type.subtitle',
      defaultMessage: 'Hvers eðlis er umsóknin',
      description: 'Exemption type subtitle',
    },
    shortTermOptionTitle: {
      id: 'ta.eft.application:exemptionPeriod.type.shortTermOptionTitle',
      defaultMessage: 'Skammtímaundanþága',
      description: 'Exemption type short term option title',
    },
    longTermOptionTitle: {
      id: 'ta.eft.application:exemptionPeriod.type.longTermOptionTitle',
      defaultMessage: 'Langtímaundanþága',
      description: 'Exemption type long term option title',
    },
    alertTitle: {
      id: 'ta.eft.application:exemptionPeriod.type.alertTitle',
      defaultMessage: 'Athugið',
      description: 'Exemption type alert title',
    },
    alertMessage: {
      id: 'ta.eft.application:exemptionPeriod.type.alertMessage',
      defaultMessage:
        'Þú ert að velja langtímaundanþágu. Langtímaundanþága gildir aðeins fyrir bla bla bla...',
      description: 'Exemption type alert message',
    },
  }),
  period: defineMessages({
    dateFrom: {
      id: 'ta.eft.application:exemptionPeriod.period.dateFrom',
      defaultMessage: 'Undanþágutímabil frá',
      description: 'Exemption period date from',
    },
    dateTo: {
      id: 'ta.eft.application:exemptionPeriod.period.dateTo',
      defaultMessage: 'Undanþágutímabil til',
      description: 'Exemption period date to',
    },
    datePlaceholder: {
      id: 'ta.eft.application:exemptionPeriod.period.datePlaceholder',
      defaultMessage: 'Veldu dagsetningu',
      description: 'Exemption period date placeholder',
    },
  }),
}
