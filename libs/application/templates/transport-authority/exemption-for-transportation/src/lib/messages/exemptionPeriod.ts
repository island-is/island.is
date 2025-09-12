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
        'Vinsamlega veldu hvers eðlis umsóknin er. Skammtímaundanþága er ætluð fyrir [ ... ]. Langtímaundanþága gildir um 32 daga og lengur.',
      description: 'Description of exemption period page',
    },
  }),
  type: defineMessages({
    subtitle: {
      id: 'ta.eft.application:exemptionPeriod.type.subtitle',
      defaultMessage: ' ',
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
        'Athugið. Langtímaundanþágur eru með gildistíma frá mánuði í allt að eitt ár og eru ætlaðar fyrir ákveðin svæði sem flutningsaðili er með starfsemi á.',
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
