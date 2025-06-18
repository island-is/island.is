import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview section',
    },
    pageTitle: {
      id: 'ta.eft.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit undanþágubeiðnar',
      description: 'Title of overview page',
    },
    description: {
      id: 'ta.eft.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp',
      description: 'Description of overview page',
    },
  }),
  userInformation: defineMessages({
    subtitle: {
      id: 'ta.eft.application:overview.userInformation.subtitle',
      defaultMessage: 'Grunnupplýsingar',
      description: 'Overview user information subtitle',
    },
    applicantSubtitle: {
      id: 'ta.eft.application:overview.userInformation.applicantSubtitle',
      defaultMessage: 'Umsækjandi',
      description: 'Overview applicant subtitle',
    },
    transporterSubtitle: {
      id: 'ta.eft.application:overview.userInformation.transporterSubtitle',
      defaultMessage: 'Flutningsaðili',
      description: 'Overview transporter subtitle',
    },
    responsiblePersonSubtitle: {
      id: 'ta.eft.application:overview.userInformation.responsiblePersonSubtitle',
      defaultMessage: 'Ábyrgðarmaður',
      description: 'Overview responsible person subtitle',
    },
  }),
  exemptionPeriod: defineMessages({
    subtitle: {
      id: 'ta.eft.application:overview.exemptionPeriod.subtitle',
      defaultMessage: 'Tímabil',
      description: 'Overview exemption period subtitle',
    },
    dateFrom: {
      id: 'ta.eft.application:overview.exemptionPeriod.dateFrom',
      defaultMessage: 'Undanþága frá',
      description: 'Overview exemption period date from label',
    },
    dateTo: {
      id: 'ta.eft.application:overview.exemptionPeriod.dateTo',
      defaultMessage: 'Undanþága til',
      description: 'Overview exemption period date to label',
    },
    type: {
      id: 'ta.eft.application:overview.exemptionPeriod.type',
      defaultMessage: 'Tegund undanþágu',
      description: 'Overview exemption period type label',
    },
  }),
  shortTermlocation: defineMessages({
    subtitle: {
      id: 'ta.eft.application:overview.shortTermlocation.subtitle',
      defaultMessage: 'Leið',
      description: 'Overview short-term location subtitle',
    },
    from: {
      id: 'ta.eft.application:overview.shortTermlocation.from',
      defaultMessage: 'Upphafsstaður',
      description: 'Overview short-term location from label',
    },
    to: {
      id: 'ta.eft.application:overview.shortTermlocation.to',
      defaultMessage: 'Áfangastaður',
      description: 'Overview short-term location to label',
    },
    directions: {
      id: 'ta.eft.application:overview.shortTermlocation.directions',
      defaultMessage: 'Leiðarlýsing',
      description: 'Overview short-term location directions label',
    },
  }),
  longTermlocation: defineMessages({
    subtitle: {
      id: 'ta.eft.application:overview.longTermlocation.subtitle',
      defaultMessage: 'Svæði',
      description: 'Overview long-term location subtitle',
    },
    regions: {
      id: 'ta.eft.application:overview.longTermlocation.regions',
      defaultMessage: 'Svæði',
      description: 'Overview long-term location regions label',
    },
    directions: {
      id: 'ta.eft.application:overview.longTermlocation.directions',
      defaultMessage: 'Leiðarlýsing',
      description: 'Overview long-term location directions label',
    },
  }),
  supportingDocuments: defineMessages({
    subtitle: {
      id: 'ta.eft.application:overview.supportingDocuments.subtitle',
      defaultMessage: 'Fylgigögn',
      description: 'Overview supporting documents subtitle',
    },
    comments: {
      id: 'ta.eft.application:overview.supportingDocuments.comments',
      defaultMessage: 'Athugasemd',
      description: 'Overview supporting documents comments label',
    },
  }),
  buttons: defineMessages({
    confirm: {
      id: 'ta.eft.application:overview.buttons.confirm',
      defaultMessage:
        'Ég staðfesti að ég hef kynnt mér lög og reglur um farmflutninga í atvinnuskyni þar sem kemur m.a. fram að þegar flutningur á hvers kyns farmi er gegn gjaldi þarf til þess rekstrarleyfi sem er útgefið af Samgöngustofu.',
      description: 'Overview confirm application checkbox',
    },
    submit: {
      id: 'ta.eft.application:overview.buttons.submit',
      defaultMessage: 'Staðfesta',
      description: ' Overview submit application button',
    },
  }),
}
