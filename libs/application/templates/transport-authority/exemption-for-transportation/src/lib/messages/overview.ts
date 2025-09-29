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
      defaultMessage: 'Yfirlit umsóknar',
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
      defaultMessage: 'Ósk um svæði',
      description: 'Overview long-term location directions label',
    },
  }),
  convoy: defineMessages({
    subtitle: {
      id: 'ta.eft.application:overview.convoy.subtitle',
      defaultMessage: 'Vagnlest',
      description: 'Overview convoy subtitle',
    },
    label: {
      id: 'ta.eft.application:overview.convoy.label',
      defaultMessage: 'Vagnlest {convoyNumber}',
      description: 'Overview convoy number label',
    },
    vehicleLabel: {
      id: 'ta.eft.application:overview.convoy.vehicleLabel',
      defaultMessage: 'Bíll: {permno}',
      description: 'Overview convoy vehicle label',
    },
    trailerLabel: {
      id: 'ta.eft.application:overview.convoy.trailerLabel',
      defaultMessage: 'Eftirvagn: {permno}',
      description: 'Overview convoy trailer label',
    },
    dollySingleLabel: {
      id: 'ta.eft.application:overview.convoy.dollySingleLabel',
      defaultMessage: 'Dollý: Einfalt',
      description: 'Overview convoy dolly single label',
    },
    dollyDoubleLabel: {
      id: 'ta.eft.application:overview.convoy.dollyDoubleLabel',
      defaultMessage: 'Dollý: Tvöfalt',
      description: 'Overview convoy dolly double label',
    },
  }),
  freight: defineMessages({
    subtitle: {
      id: 'ta.eft.application:overview.freight.subtitle',
      defaultMessage: 'Farmur',
      description: 'Overview freight subtitle',
    },
    label: {
      id: 'ta.eft.application:overview.freight.label',
      defaultMessage: 'Farmur {freightNumber}: {freightName}',
      description: 'Overview freight label',
    },
    convoyLabel: {
      id: 'ta.eft.application:overview.freight.convoyLabel',
      defaultMessage: 'Vagnlest {convoyNumber}: {vehicleAndTrailerPermno}',
      description: 'Overview freight convoy pairing label',
    },
    freightNameLabel: {
      id: 'ta.eft.application:overview.freight.freightNameLabel',
      defaultMessage: 'Tegund farms: {freightName}',
      description: 'Overview freight name label',
    },
    lengthLabel: {
      id: 'ta.eft.application:overview.freight.lengthLabel',
      defaultMessage: 'Lengd farms: {length}',
      description: 'Overview freight length label',
    },
    weightLabel: {
      id: 'ta.eft.application:overview.freight.weightLabel',
      defaultMessage: 'Þyngd farms: {weight}',
      description: 'Overview freight weight label',
    },
    heightLabel: {
      id: 'ta.eft.application:overview.freight.heightLabel',
      defaultMessage: 'Mesta hæð: {height}',
      description: 'Overview freight height label',
    },
    widthLabel: {
      id: 'ta.eft.application:overview.freight.widthLabel',
      defaultMessage: 'Mesta breidd: {width}',
      description: 'Overview freight width label',
    },
    totalLengthLabel: {
      id: 'ta.eft.application:overview.freight.totalLengthLabel',
      defaultMessage: 'Heildarlengd: {totalLength}',
      description: 'Overview freight total length label',
    },
    exemptionForWidthLabel: {
      id: 'ta.eft.application:overview.freight.exemptionForWidthLabel',
      defaultMessage: 'Undanþága vegna breiddar: Já',
      description: 'Overview freight exemption for width label',
    },
    exemptionForHeightLabel: {
      id: 'ta.eft.application:overview.freight.exemptionForHeightLabel',
      defaultMessage: 'Undanþága vegna hæðar: Já',
      description: 'Overview freight exemption for height label',
    },
    exemptionForLengthLabel: {
      id: 'ta.eft.application:overview.freight.exemptionForLengthLabel',
      defaultMessage: 'Undanþága vegna lengdar: Já',
      description: 'Overview freight exemption for length label',
    },
    exemptionForWeightLabel: {
      id: 'ta.eft.application:overview.freight.exemptionForWeightLabel',
      defaultMessage: 'Undanþága vegna þyngdar: Já',
      description: 'Overview freight exemption for weight label',
    },
    convoyMissingErrorTitle: {
      id: 'ta.eft.application:overview.freight.convoyMissingErrorTitle',
      defaultMessage: 'Athugið',
      description: 'Overview convoy missing in freight pairing error title',
    },
    convoyMissingErrorMessage: {
      id: 'ta.eft.application:overview.freight.convoyMissingErrorMessage',
      defaultMessage:
        'Vantar að para vagnlest {convoyNumber}: {vehicleAndTrailerPermno} við farm',
      description: 'Overview convoy missing in freight pairing error message',
    },
  }),
  axleSpacing: defineMessages({
    subtitle: {
      id: 'ta.eft.application:overview.axleSpacing.subtitle',
      defaultMessage: 'Bil á milli öxla',
      description: 'Overview axle spacing subtitle',
    },
    vehicleLabel: {
      id: 'ta.eft.application:overview.axleSpacing.vehicleLabel',
      defaultMessage: 'Bíll - {permno} ({axleCount} öxlar): {axleSpacingList}',
      description:
        'Overview axle spacing label for vehicle with permno and axle spacing',
    },
    trailerLabel: {
      id: 'ta.eft.application:overview.axleSpacing.trailerLabel',
      defaultMessage:
        'Eftirvagn - {permno} ({axleCount} öxlar): {axleSpacingList}',
      description:
        'Overview axle spacing label for trailer with permno and axle spacing',
    },
    dollyLabel: {
      id: 'ta.eft.application:overview.axleSpacing.dollyLabel',
      defaultMessage: 'Tvöfalt dollý (2 öxlar): {axleSpacingList}',
      description:
        'Overview axle spacing label for double dolly with axle spacing',
    },
  }),
  vehicleSpacing: defineMessages({
    subtitle: {
      id: 'ta.eft.application:overview.vehicleSpacing.subtitle',
      defaultMessage: 'Bil á milli vagna',
      description: 'Overview vehicle spacing subtitle',
    },
    shortTermVehicleToTrailerLabel: {
      id: 'ta.eft.application:overview.vehicleSpacing.shortTermVehicleToTrailerLabel',
      defaultMessage: 'Bíll í eftirvagn: {vehicleSpacing}',
      description:
        'Overview vehicle spacing short-term label for vehicle to trailer',
    },
    shortTermVehicleToDollyLabel: {
      id: 'ta.eft.application:overview.vehicleSpacing.shortTermVehicleToDollyLabel',
      defaultMessage: 'Bíll í dollý: {vehicleSpacing}',
      description:
        'Overview vehicle spacing short-term label for vehicle to dolly',
    },
    shortTermDollyToTrailerLabel: {
      id: 'ta.eft.application:overview.vehicleSpacing.shortTermDollyToTrailerLabel',
      defaultMessage: 'Dollý í eftirvagn: {vehicleSpacing}',
      description:
        'Overview vehicle spacing short-term label for dolly to trailer',
    },
    longTermLabel: {
      id: 'ta.eft.application:overview.vehicleSpacing.longTermLabel',
      defaultMessage:
        'Bil í vagnlest {convoyNumber}, bíll ({vehiclePermno}) í eftirvagn ({trailerPermno}): {vehicleSpacing}',
      description: 'Overview vehicle spacing long-term label for convoy',
    },
  }),
  supportingDocuments: defineMessages({
    subtitleShortTerm: {
      id: 'ta.eft.application:overview.supportingDocuments.subtitleShortTerm',
      defaultMessage: 'Athugasemdir og fylgigögn',
      description: 'Overview supporting documents subtitle',
    },
    subtitleLongTerm: {
      id: 'ta.eft.application:overview.supportingDocuments.subtitleLongTerm',
      defaultMessage: 'Athugasemdir',
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
