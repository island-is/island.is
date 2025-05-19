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
    policeEscortAlertMessage: {
      id: 'ta.eft.application:freight.create.policeEscortAlertMessage',
      defaultMessage:
        'Þar sem heildarmælingar ná {maxLength} metra lengd og/eða {maxHeight} metra hæð og/eða {maxWidth} metra breidd þarfnast þessi flutningur lögreglufylgdar. Flutningsaðili ber sjálfur ábyrgð á að hafa samband við lögreglu varðandi samþykki og fyrirkomulag vegna viðkomandi undanþáguflutnings, í framhaldi af veittri undanþágu frá Samgöngustofu. ',
      description: 'Alert message if police escort is required',
    },
    errorAlertMessageTitle: {
      id: 'ta.eft.application:freight.create.errorAlertMessageTitle',
      defaultMessage: 'Athugið',
      description: 'Freight error alert title',
    },
    errorEmptyListAlertMessageMessage: {
      id: 'ta.eft.application:freight.create.errorEmptyListAlertMessageMessage',
      defaultMessage: 'Það verður að skrá amk einn farm',
      description: 'Error empty freight list alert message',
    },
    errorPoliceEscortAlertMessageMessage: {
      id: 'ta.eft.application:freight.create.errorPoliceEscortAlertMessageMessage',
      defaultMessage:
        'Farmur sem fer yfir {maxLength} metra lengd þarfnast lögreglufylgdar. Lögreglufylgd er aðeins í boði fyrir skammtímaundanþágu. Vinsamlegast fjarlægðu farm {freightNumber}: {freightName}.',
      description: 'Error police escort alert message',
    },
  }),
  pairing: defineMessages({
    subSectionTitle: {
      id: 'ta.eft.application:freight.pairing.subSectionTitle',
      defaultMessage: 'Para vagnlest við farm {freightNumber}: {freightName}',
      description: 'Title of pairing freight with convoy sub section',
    },
    pageTitle: {
      id: 'ta.eft.application:freight.pairing.pageTitle',
      defaultMessage: 'Farmur {freightNumber}: {freightName}',
      description: 'Title ofpairing freight with convoy page',
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
    withConvoySubtitle: {
      id: 'ta.eft.application:freight.labels.withConvoySubtitle',
      defaultMessage: 'Upplýsingar um vagnlest með farmi',
      description: 'With convoy subtitle',
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
      id: 'ta.eft.application:freight.labels.metersSuffix',
      defaultMessage: ' tonn',
      description: 'Tons suffix',
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
