import { defineMessages } from 'react-intl'

export const overview = defineMessages({
  pageTitle: {
    id: 'ra.application:summary.pageTitle',
    defaultMessage: 'Samantekt',
    description: 'Title of the summary page',
  },
  pageDescriptionFirstParagraph: {
    id: 'ra.application:summary.pageDescriptionFirstParagraph',
    defaultMessage:
      'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp. ',
    description: 'First paragraph description of the summary page',
  },
  pageDescriptionSecondparagraph: {
    id: 'ra.application:summary.pageDescriptionSecondParagraph#markdown',
    defaultMessage:
      'Aðilum leigusamnings ber að kynna sér hvað löglegur leigusamningur skuli innihalda. [Sjá nánar hér..](https://www.althingi.is/lagas/nuna/1994036.html)',
    description: 'Second paragraph description of the summary page',
  },

  // Property address
  rentalPropertyId: {
    id: 'ra.application:summary.rentalPropertyId',
    defaultMessage: 'Fasteignanúmer: {propertyId}',
    description: 'Property id prefix',
  },
  nationalIdPrefix: {
    id: 'ra.application:summary.nationalIdPrefix',
    defaultMessage: 'Kennitala: {nationalId}',
    description: 'National id prefix',
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

  // Rental amount
  rentalAmountTitle: {
    id: 'ra.application:summary.rentalAmountTitle',
    defaultMessage: 'Leiga',
    description: 'Rental amount title',
  },
  rentalAmountValue: {
    id: 'ra.application:summary.rentalAmountValue',
    defaultMessage: 'Upphæð leigu',
    description: 'Rental amount value',
  },
  rentalAmountIndexedLabel: {
    id: 'ra.application:summary.rentalAmountIndexedLabel',
    defaultMessage: 'Leiga fylgir vísitölu',
    description: 'Rental amount indexed label',
  },

  // Rental amount & security deposit
  rentalAmountLabel: {
    id: 'ra.application:summary.rentalAmountLabel',
    defaultMessage: 'Leiguupphæð',
    description: 'Rental amount label',
  },
  securityTypeLabel: {
    id: 'ra.application:summary.securityTypeLabel',
    defaultMessage: 'Tegund',
    description: 'Security type label',
  },
  securityTypeInstitutionLabel: {
    id: 'ra.application:summary.securityTypeInstitutionLabel',
    defaultMessage: 'Nafn stofnunar',
    description: 'Bank guarantee label',
  },
  securityTypeThirdPartyGuaranteeLabel: {
    id: 'ra.application:summary.securityTypeThirdPartyGuaranteeLabel',
    defaultMessage: 'Nafn ábyrgðaraðila',
    description: 'Insurance label',
  },
  securityTypeInsuranceLabel: {
    id: 'ra.application:summary.securityTypeInsuranceLabel',
    defaultMessage: 'Nafn tryggingarfélags',
    description: 'Insurance label',
  },
  securityTypeMutualFundLabel: {
    id: 'ra.application:summary.securityTypeMutualFundLabel',
    defaultMessage: 'Nafn samtryggingasjóðs',
    description: 'Mutual fund label',
  },
  securityTypeOtherLabel: {
    id: 'ra.application:summary.securityTypeOtherLabel',
    defaultMessage: 'Tegund Tryggingar',
    description: 'Other label',
  },

  // Payment & indexation
  indexRateLabel: {
    id: 'ra.application:summary.indexRateLabel',
    defaultMessage: 'Vísitölugildi',
    description: 'Indexation rate label',
  },

  // Rent transaction details
  paymentMethodAccountLabel: {
    id: 'ra.application:summary.paymentMethodAccountLabel',
    defaultMessage: 'Reikningsnúmer',
    description: 'Payment method account label',
  },
  paymentMethodNationalIdLabel: {
    id: 'ra.application:summary.paymentMethodNationalIdLabel',
    defaultMessage: 'Kennitala',
    description: 'Payment method national id label',
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
  electricityMeterNumberLabel: {
    id: 'ra.application:summary.electricityMeterNumberLabel',
    defaultMessage: 'Rafmagnsmælir',
    description: 'Electricity meter label',
  },
  heatingCostMeterNumberLabel: {
    id: 'ra.application:summary.heatingCostMeterNumberLabel',
    defaultMessage: 'Hitamælir',
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
  otherCostsLabel: {
    id: 'ra.application:summary.otherCostsLabel',
    defaultMessage: 'Annar kostnaður',
    description: 'Other costs amount label',
  },
  houseFundAmountLabel: {
    id: 'ra.application:summary.houseFundAmountLabel',
    defaultMessage: 'Upphæð hússjóðs',
    description: 'House fund amount label',
  },
  paymentDateOptionsLabel: {
    id: 'ra.application:summary.paymentDateOptionsLabel',
    defaultMessage: 'Gjalddagi leigu',
    description: 'Payment date options label',
  },
  paymentMethodTypeLabel: {
    id: 'ra.application:summary.paymentMethodTypeLabel',
    defaultMessage: 'Greiðslufyrirkomulag',
    description: 'Payment method type label',
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
  propertySizeLabel: {
    id: 'ra.application:summary.propertySizeLabel',
    defaultMessage: 'Fermetrar',
    description: 'Property size label',
  },
  propertyClassLabel: {
    id: 'ra.application:summary.propertyClassLabel',
    defaultMessage: 'Flokkun húsnæðis',
    description: 'Property classification label',
  },
  propertyClassGroupLabel: {
    id: 'ra.application:summary.propertyClassGroupLabel',
    defaultMessage: 'Hópur',
    description: 'Property classification group label',
  },
  propertyClassSpecialGroups: {
    id: 'ra.application:summary.propertyClassSpecialGroups',
    defaultMessage: 'Húsnæði fyrir sérstaka hópa',
    description: 'Property classification special group value',
  },
  propertyClassGeneralMarket: {
    id: 'ra.application:summary.propertyClassGeneralMarket',
    defaultMessage: 'Almennur markaður',
    description: 'Property classification general market value',
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
  propertyConditionTitle: {
    id: 'ra.application:summary.propertyConditionTitle',
    defaultMessage: 'Ástand húsnæðis',
    description: 'Property condition title',
  },
  propertyConditionInspectorLabel: {
    id: 'ra.application:summary.propertyConditionInspectorLabel',
    defaultMessage: 'Ástandsskoðun',
    description: 'Property condition inspector label',
  },
  propertyConditionInspectorValueIndependentParty: {
    id: 'ra.application:summary.propertyConditionInspectorValueIndependentParty',
    defaultMessage: 'Framkvæmd af {inspectorName}',
    description: 'Property condition inspector value independent party',
  },
  propertyConditionInspectorValueSelfPerformed: {
    id: 'ra.application:summary.propertyConditionInspectorValueSelfPerformed',
    defaultMessage: 'Framkvæmd af samningsaðilum',
    description: 'Property condition inspector value self performed',
  },
  propertyConditionInspectorValuePrefix: {
    id: 'ra.application:summary.propertyConditionInspectorValuePrefix',
    defaultMessage: 'Framkvæmd af ',
    description: 'Property condition inspector value prefix',
  },
  propertyConditionInspectorValueContractParties: {
    id: 'ra.application:summary.propertyConditionInspectorValueContractParties',
    defaultMessage: 'samningsaðilum',
    description: 'Property condition inspector value contract parties',
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
  fireProtectionsEmergencyExitsLabel: {
    id: 'ra.application:summary.fireProtectionsEmergencyExitsLabel',
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
    defaultMessage: 'Leigjandi',
    description: 'Tenants header',
  },
  tenantsHeaderPlural: {
    id: 'ra.application:summary.tenantsHeaderPlural',
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
    defaultMessage: 'Leigusali',
    description: 'Landlords header',
  },
  landlordsHeaderPlural: {
    id: 'ra.application:summary.landlordsHeaderPlural',
    defaultMessage: 'Leigusalar',
    description: 'Landlords header',
  },
  landlordsRepresentativeLabel: {
    id: 'ra.application:summary.landlordsRepresentativeLabel',
    defaultMessage: 'Umboðsaðili leigusala',
    description: 'Delegator label',
  },
  landlordsRepresentativeLabelPlural: {
    id: 'ra.application:summary.landlordsRepresentativeLabelPlural',
    defaultMessage: 'Umboðsaðilar leigusala',
    description: 'Delegator label',
  },
  nationalIdLabel: {
    id: 'ra.application:summary.nationalIdLabel',
    defaultMessage: 'Kennitala: ',
    description: 'National ID label',
  },
  emailLabel: {
    id: 'ra.application:summary.emailLabel',
    defaultMessage: 'Netfang',
    description: 'Email label',
  },
  fireProtectionsTitle: {
    id: 'ra.application:summary.fireProtectionsTitle',
    defaultMessage: 'Brunavarnir',
    description: 'Fire protections title',
  },
})
