import { defineMessages } from 'react-intl'

export const freight = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.eft.application:freight.general.sectionTitle',
      defaultMessage: 'Farmur',
      description: 'Title of freight section',
    },
  }),
  create: defineMessages({
    subSectionTitle: {
      id: 'ta.eft.application:freight.create.subSectionTitle',
      defaultMessage: 'Skrá farm',
      description: 'Title of create freight sub section',
    },
    pageTitle: {
      id: 'ta.eft.application:freight.create.pageTitle',
      defaultMessage: 'Farmur',
      description: 'Title of create freight page',
    },
    description: {
      id: 'ta.eft.application:freight.create.description',
      defaultMessage:
        'Vinsamlegast fylltu út upplýsingar um farminn sem þú ert að fara að flytja.',
      description: 'Description of create freight page',
    },
    policeEscortAlertTitle: {
      id: 'ta.eft.application:freight.create.policeEscortAlertTitle',
      defaultMessage: 'Lögreglufylgd',
      description: 'Alert title if police escort is required',
    },
    warningPoliceEscortAlertMessage: {
      id: 'ta.eft.application:freight.create.warningPoliceEscortAlertMessage',
      defaultMessage:
        'Þar sem heildarmælingar ná {maxLength} metra lengd og/eða {maxHeight} metra hæð og/eða {maxWidth} metra breidd þarfnast þessi flutningur lögreglufylgdar. Flutningsaðili ber sjálfur ábyrgð á að hafa samband við lögreglu varðandi samþykki og fyrirkomulag vegna viðkomandi undanþáguflutnings, í framhaldi af veittri undanþágu frá Samgöngustofu. ',
      description: 'Alert message if police escort is required',
    },
    errorAlertMessageTitle: {
      id: 'ta.eft.application:freight.create.errorAlertMessageTitle',
      defaultMessage: 'Athugið',
      description: 'Freight error alert title',
    },
    errorEmptyListAlertMessage: {
      id: 'ta.eft.application:freight.create.errorEmptyListAlertMessage',
      defaultMessage: 'Það verður að skrá a.m.k. einn farm',
      description: 'Error empty freight list alert message',
    },
    errorPoliceEscortAlertMessage: {
      id: 'ta.eft.application:freight.create.errorPoliceEscortAlertMessage',
      defaultMessage:
        'Farmur sem fer yfir {maxLength} metra lengd þarfnast lögreglufylgdar. Lögreglufylgd er aðeins í boði fyrir skammtímaundanþágu. Vinsamlegast fjarlægðu farm {freightNumber}: {freightName}.',
      description: 'Error police escort alert message when creating freight',
    },
  }),
  pairing: defineMessages({
    subSectionTitle: {
      id: 'ta.eft.application:freight.pairing.subSectionTitle',
      defaultMessage:
        'Para vagnlestir við farm {freightNumber}: {freightName} {length}m/{weight}t',
      description: 'Title of pairing freight with convoy sub section',
    },
    pageTitle: {
      id: 'ta.eft.application:freight.pairing.pageTitle',
      defaultMessage:
        'Farmur {freightNumber}: {freightName} {length}m/{weight}t',
      description: 'Title of pairing freight with convoy page',
    },
    description: {
      id: 'ta.eft.application:freight.pairing.description',
      defaultMessage:
        'Hérna kemur útskýringartexti sem gerir þetta skýrt fyrir notandanum með mestu málin',
      description: 'Description of pairing freight with convoy page',
    },
    errorEmptyListAlertMessage: {
      id: 'ta.eft.application:freight.pairing.errorEmptyListAlertMessage',
      defaultMessage: 'Það verður að velja amk eina vagnlest',
      description: 'Error empty convoy list alert message',
    },
    errorPoliceEscortAlertMessage: {
      id: 'ta.eft.application:freight.pairing.errorPoliceEscortAlertMessage',
      defaultMessage:
        'Farmur sem fer yfir {maxHeight} metra hæð og/eða {maxWidth} metra breidd þarfnast lögreglufylgdar. Lögreglufylgd er aðeins í boði fyrir skammtímaundanþágu. Vinsamlegast fjarlægðu vagnlest {convoyNumber}: {vehicleAndTrailerPermno}.',
      description:
        'Error police escort alert message when pairing freight with convoy',
    },
  }),
  labels: defineMessages({
    freightSubtitle: {
      id: 'ta.eft.application:freight.labels.freightSubtitle',
      defaultMessage: 'Upplýsingar um farm',
      description: 'Freight subtitle',
    },
    freightName: {
      id: 'ta.eft.application:freight.labels.freightName',
      defaultMessage: 'Tegund farms',
      description: 'Freight name label',
    },
    freightLength: {
      id: 'ta.eft.application:freight.labels.freightLength',
      defaultMessage: 'Lengd farms',
      description: 'Freight length label',
    },
    freightWeight: {
      id: 'ta.eft.application:freight.labels.freightWeight',
      defaultMessage: 'Þyngd farms',
      description: 'Freight weight label',
    },
    freightWithConvoySubtitle: {
      id: 'ta.eft.application:freight.labels.freightWithConvoySubtitle',
      defaultMessage: 'Upplýsingar um farm á vagnlest',
      description: 'Freight with convoy subtitle',
    },
    heightWithConvoy: {
      id: 'ta.eft.application:freight.labels.heightWithConvoy',
      defaultMessage: 'Mesta hæð',
      description: 'Height with convoy label',
    },
    widthWithConvoy: {
      id: 'ta.eft.application:freight.labels.widthWithConvoy',
      defaultMessage: 'Mesta breidd',
      description: 'Width with convoy label',
    },
    totalLengthWithConvoy: {
      id: 'ta.eft.application:freight.labels.totalLengthWithConvoy',
      defaultMessage: 'Heildarlengd',
      description: 'Total length with convoy label',
    },
    exemptionFor: {
      id: 'ta.eft.application:freight.labels.exemptionFor',
      defaultMessage: 'Óskað er eftir undanþágu vegna:',
      description: 'Exemption for checkbox label',
    },
    metersSuffix: {
      id: 'ta.eft.application:freight.labels.metersSuffix',
      defaultMessage: ' metrar',
      description: 'Meters suffix',
    },
    tonsSuffix: {
      id: 'ta.eft.application:freight.labels.tonsSuffix',
      defaultMessage: ' tonn',
      description: 'Tons suffix',
    },
    valueAndMetersSuffix: {
      id: 'ta.eft.application:freight.labels.valueAndMetersSuffix',
      defaultMessage: '{value} metrar',
      description: 'Value and meters suffix',
    },
    valueAndTonsSuffix: {
      id: 'ta.eft.application:freight.labels.valueAndTonsSuffix',
      defaultMessage: '{value} tonn',
      description: 'Valud and tons suffix',
    },
    addItemButtonText: {
      id: 'ta.eft.application:freight.labels.addItemButtonText',
      defaultMessage: 'Bæta við farmi',
      description: 'Add item to freight table button text',
    },
    saveItemButtonText: {
      id: 'ta.eft.application:freight.labels.saveItemButtonText',
      defaultMessage: 'Skrá farm',
      description: 'Save item to freight table button text',
    },
    removeItemButtonTooltipText: {
      id: 'ta.eft.application:freight.labels.removeItemTooltipText',
      defaultMessage: 'Eyða farmi',
      description: 'Remove item in freight table button tooltip text',
    },
    editItemButtonTooltipText: {
      id: 'ta.eft.application:freight.labels.editItemButtonTooltipText',
      defaultMessage: 'Breyta farmi',
      description: 'Edit item in freight table button tooltip text',
    },
    pairingConvoyListSubtitle: {
      id: 'ta.eft.application:freight.labels.pairingConvoyListSubtitle',
      defaultMessage:
        'Óskað er eftir að flytja þennan farm á eftirfarandi vagnlestum:',
      description: 'Freight pairing convoy list subtitle',
    },
    pairingConvoyList: {
      id: 'ta.eft.application:freight.labels.pairingConvoyList',
      defaultMessage: 'Vagnlest',
      description: 'Freight pairing convoy list label',
    },
    pairingConvoyOption: {
      id: 'ta.eft.application:freight.labels.pairingConvoyOption',
      defaultMessage: 'Vagnlest {convoyNumber}: {vehicleAndTrailerPermno}',
      description: 'Freight pairing convoy list label',
    },
    pairingFreightWithConvoySubtitle: {
      id: 'ta.eft.application:freight.labels.pairingFreightWithConvoySubtitle',
      defaultMessage:
        'Upplýsingar um farm á vagnlest {convoyNumber}: {vehicleAndTrailerPermno}',
      description: 'Freight pairing with convoy subtitle',
    },
  }),
  exemptionFor: defineMessages({
    widthOptionTitle: {
      id: 'ta.eft.application:freight.exemptionFor.widthOptionTitle',
      defaultMessage: 'Breidd',
      description: 'Exemption for width option title',
    },
    heightOptionTitle: {
      id: 'ta.eft.application:freight.exemptionFor.heightOptionTitle',
      defaultMessage: 'Hæð',
      description: 'Exemption for height option title',
    },
    lengthOptionTitle: {
      id: 'ta.eft.application:freight.exemptionFor.lengthOptionTitle',
      defaultMessage: 'Lengd',
      description: 'Exemption for length option title',
    },
    weightOptionTitle: {
      id: 'ta.eft.application:freight.exemptionFor.weightOptionTitle',
      defaultMessage: 'Þyngd',
      description: 'Exemption for weight option title',
    },
  }),
}
