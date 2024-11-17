import { defineMessages } from 'react-intl'

export const summary = defineMessages({
  sectionName: {
    id: 'ra.application:summary.sectionName',
    defaultMessage: 'Samantekt',
    description: 'Name of the summary section',
  },
  pageTitle: {
    id: 'ra.application:summary.pageTitle',
    defaultMessage: 'Samantekt',
    description: 'Title of the summary page',
  },
  pageDescription: {
    id: 'ra.application:summary.pageDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp. ',
    description: 'Description of the summary page',
  },

  // Property address
  rentalPropertyIdPrefix: {
    id: 'ra.application:summary.rentalPropertyIdPrefix',
    defaultMessage: 'Fasteignanúmer: F',
    description: 'Property id prefix',
  },

  // Rental period
  rentalPeriodStartDateLabel: {
    id: 'ra.application:summary.rentalPeriodStartDateLabel',
    defaultMessage: 'Upphafsdagur samnings',
    description: 'Rental period start date label',
  },
  rentalPeriodEndDateLabel: {
    id: 'ra.application:summary.rentalPeriodEndDateLabel',
    defaultMessage: 'Lokadagur samnings',
    description: 'Rental period end date label',
  },
  rentalPeriodDefiniteLabel: {
    id: 'ra.application:summary.rentalPeriodDefiniteLabel',
    defaultMessage: 'Leigutímabil',
    description: 'Rental period label',
  },
  rentalPeriodDefiniteValue: {
    id: 'ra.application:summary.rentalPeriodDefiniteValue',
    defaultMessage: 'Ótímabundinn samningur',
    description: 'Value if rental period is indefinite',
  },

  // Rental amount & security deposit
  rentalAmountLabel: {
    id: 'ra.application:summary.rentalAmountLabel',
    defaultMessage: 'Leiguupphæð',
    description: 'Rental amount label',
  },
  securityDepositLabel: {
    id: 'ra.application:summary.securityDepositLabel',
    defaultMessage: 'Trygging',
    description: 'Security deposit label',
  },
  securityTypeLabel: {
    id: 'ra.application:summary.securityTypeLabel',
    defaultMessage: 'Tegund',
    description: 'Security type label',
  },

  // Payment & indexation
  paymentDateOptionsLabel: {
    id: 'ra.application:summary.paymentDateOptionsLabel',
    defaultMessage: 'Gjalddagi leigu',
    description: 'Payment date options label',
  },
  indexTypeLabel: {
    id: 'ra.application:summary.indexTypeLabel',
    defaultMessage: 'Vísitala',
    description: 'Indexation type label',
  },
  indexValueLabel: {
    id: 'ra.application:summary.indexValueLabel',
    defaultMessage: 'Vísitala við upphaf samnings',
    description: 'Indexation value label',
  },

  // Rent transaction details
  paymentTransactionTypeLabel: {
    id: 'ra.application:summary.paymentTransactionTypeLabel',
    defaultMessage: 'Greiðslufyrirkomulag',
    description: 'Payment transaction type label',
  },
  paymentTransactionAccountLabel: {
    id: 'ra.application:summary.paymentTransactionAccountLabel',
    defaultMessage: 'Bankareikningur',
    description: 'Payment transaction account label',
  },

  // Other costs
  otherCostsHeader: {
    id: 'ra.application:summary.otherCostsHeader',
    defaultMessage: 'Önnur gjöld',
    description: 'Other costs header',
  },
  electricityCostLabel: {
    id: 'ra.application:summary.electricityCostLabel',
    defaultMessage: 'Rafmagnskostnaður',
    description: 'Electricity cost label',
  },
  heatingCostLabel: {
    id: 'ra.application:summary.heatingCostLabel',
    defaultMessage: 'Hitakostnaður',
    description: 'Heating and water cost label',
  },
  houseFundLabel: {
    id: 'ra.application:summary.houseFundLabel',
    defaultMessage: 'Hússjóður',
    description: 'Housing fund label',
  },
  houseFundAmountLabel: {
    id: 'ra.application:summary.houseFundAmountLabel',
    defaultMessage: 'Upphæð hússjóðs',
    description: 'House fund amount label',
  },
  electricityMeterNumberLabel: {
    id: 'ra.application:summary.electricityMeterNumberLabel',
    defaultMessage: 'Rafmagnsmælir nr.',
    description: 'Electricity meter label',
  },
  heatingCostMeterNumberLabel: {
    id: 'ra.application:summary.heatingCostMeterNumberLabel',
    defaultMessage: 'Hitamælir nr.',
    description: 'Meter number label',
  },
  meterStatusLabel: {
    id: 'ra.application:summary.meterStatusLabel',
    defaultMessage: 'Staða mælis',
    description: 'Meter status label',
  },
  dateOfMeterReadingLabel: {
    id: 'ra.application:summary.dateOfMeterReadingLabel',
    defaultMessage: 'Dags.',
    description: 'Date of meter reading label',
  },
  otherCostsAmountLabel: {
    id: 'ra.application:summary.otherCostsAmountLabel',
    defaultMessage: 'Upphæð',
    description: 'Other costs amount label',
  },

  // Property information
  propertyInfoHeader: {
    id: 'ra.application:summary.propertyInfoHeader',
    defaultMessage: 'Húsnæðið',
    description: 'Property information header',
  },
  propertyTypeLabel: {
    id: 'ra.application:summary.propertyTypeLabel',
    defaultMessage: 'Tegund húsnæðis',
    description: 'Property type label',
  },
  PropertyNumOfRoomsLabel: {
    id: 'ra.application:summary.PropertyNumOfRoomsLabel',
    defaultMessage: 'Herbergi',
    description: 'Number of rooms label',
  },
  propertySizeLabel: {
    id: 'ra.application:summary.propertySizeLabel',
    defaultMessage: 'Fermetrar',
    description: 'Property size label',
  },
  propertyCategoryLabel: {
    id: 'ra.application:summary.propertyCategoryLabel',
    defaultMessage: 'Flokkun húsnæðis',
    description: 'Property category label',
  },
  propertyDescriptionLabel: {
    id: 'ra.application:summary.propertyDescriptionLabel',
    defaultMessage: 'Lýsing á húsnæðinu og því sem með fylgir',
    description: 'Property description label',
  },
  PropertySpecialProvisionsLabel: {
    id: 'ra.application:summary.PropertySpecialProvisionsLabel',
    defaultMessage: 'Sérákvæði eða húsreglur',
    description: 'Special conditions label',
  },
  propertyConditionInspectorLabel: {
    id: 'ra.application:summary.propertyConditionInspectorLabel',
    defaultMessage: 'Ástandsskoðun',
    description: 'Property condition inspector label',
  },
  propertyConditionDescriptionLabel: {
    id: 'ra.application:summary.propertyConditionDescriptionLabel',
    defaultMessage: 'Ástandsúttekt',
    description: 'Property condition description label',
  },
  fileUploadLabel: {
    id: 'ra.application:summary.fileUploadLabel',
    defaultMessage: 'Upphlaðin gögn',
    description: 'File upload label',
  },
  fireProtectionsSmokeDetectorsLabel: {
    id: 'ra.application:summary.fireProtectionsSmokeDetectorsLabel',
    defaultMessage: 'Reykskynjari',
    description: 'Smoke detectors label',
  },
  fireProtectionsFireExtinguisherLabel: {
    id: 'ra.application:summary.fireProtectionsFireExtinguisherLabel',
    defaultMessage: 'Slökkvitæki',
    description: 'Fire extinguisher label',
  },
  fireProtectionsExitsLabel: {
    id: 'ra.application:summary.fireProtectionsExitsLabel',
    defaultMessage: 'Flóttaleiðir',
    description: 'Exits label',
  },
  fireProtectionsFireBlanketLabel: {
    id: 'ra.application:summary.fireProtectionsFireBlanketLabel',
    defaultMessage: 'Eldvarnarteppi',
    description: 'Fire blanket label',
  },

  // Tenants and landlords information
  tenantsHeader: {
    id: 'ra.application:summary.tenantsHeader',
    defaultMessage: 'Leigjendur',
    description: 'Tenants header',
  },
  tenantsRepresentativeLabel: {
    id: 'ra.application:summary.tenantsRepresentativeLabel',
    defaultMessage: 'Umboðsaðili leigjanda',
    description: 'Delegator label',
  },
  landlordsHeader: {
    id: 'ra.application:summary.landlordsHeader',
    defaultMessage: 'Leigusalar',
    description: 'Landlords header',
  },
  landlordsRepresentativeLabel: {
    id: 'ra.application:summary.landlordsRepresentativeLabel',
    defaultMessage: 'Umboðsaðili leigusala',
    description: 'Delegator label',
  },
  nationalIdLabel: {
    id: 'ra.application:summary.nationalIdLabel',
    defaultMessage: 'Kennitala: ',
    description: 'National ID label',
  },
  phoneNumberLabel: {
    id: 'ra.application:summary.phoneNumberLabel',
    defaultMessage: 'Símanúmer',
    description: 'Phone number label',
  },
  emailLabel: {
    id: 'ra.application:summary.emailLabel',
    defaultMessage: 'Netfang',
    description: 'Email label',
  },

  // Share link
  shareLinkLabel: {
    id: 'ra.application:summary.shareLinkLabel',
    defaultMessage: 'Deila samningsdrögum',
    description: 'Share link label',
  },
  shareLinkTooltip: {
    id: 'ra.application:summary.shareLinkTooltip',
    defaultMessage:
      'Hér getur þú deilt samningsdrögum með öðrum aðilum smnings til að fá álit þeirra.',
    description: 'Share link tooltip',
  },
  shareLinkbuttonLabel: {
    id: 'ra.application:summary.shareLinkbuttonLabel',
    defaultMessage: 'Afrita hlekk',
    description: 'Share link copy button label',
  },
})
