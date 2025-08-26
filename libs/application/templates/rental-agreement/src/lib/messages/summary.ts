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
  changeSectionButtonLabel: {
    id: 'ra.application:summary.changeSectionButtonLabel',
    defaultMessage: 'Breyta',
    description: 'Change section button label',
  },
  submitButtonLabel: {
    id: 'ra.application:summary.submitButtonLabel',
    defaultMessage: 'Áfram í undirritun',
    description: 'Submit button label',
  },
  editButtonLabel: {
    id: 'ra.application:summary.editButtonLabel',
    defaultMessage: 'Uppfæra umsókn',
    description: 'Edit button label',
  },

  // Property address
  rentalPropertyIdPrefix: {
    id: 'ra.application:summary.rentalPropertyIdPrefix',
    defaultMessage: 'Fasteignanúmer: ',
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
  securityDepositNotRequired: {
    id: 'ra.application:summary.securityDepositNotRequired',
    defaultMessage: 'Ekki krafist',
    description: 'Security deposit not required',
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
  paymentDateOptionsLabel: {
    id: 'ra.application:summary.paymentDateOptionsLabel',
    defaultMessage: 'Gjalddagi leigu',
    description: 'Payment date options label',
  },
  indexRateLabel: {
    id: 'ra.application:summary.indexRateLabel',
    defaultMessage: 'Vísitölugildi',
    description: 'Indexation rate label',
  },

  // Rent transaction details
  paymentMethodTypeLabel: {
    id: 'ra.application:summary.paymentMethodTypeLabel',
    defaultMessage: 'Greiðslufyrirkomulag',
    description: 'Payment method type label',
  },
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
  houseFundAmountLabel: {
    id: 'ra.application:summary.houseFundAmountLabel',
    defaultMessage: 'Upphæð hússjóðs',
    description: 'House fund amount label',
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
  otherCostsAmountLabel: {
    id: 'ra.application:summary.otherCostsAmountLabel',
    defaultMessage: 'Upphæð',
    description: 'Other costs amount label',
  },
  otherCostsLabel: {
    id: 'ra.application:summary.otherCostsLabel',
    defaultMessage: 'Annar kostnaður',
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
  propertyConditionInspectorLabel: {
    id: 'ra.application:summary.propertyConditionInspectorLabel',
    defaultMessage: 'Ástandsskoðun',
    description: 'Property condition inspector label',
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
  shareLinkDescription: {
    id: 'ra.application:summary.shareLinkDescription',
    defaultMessage:
      'Þú getur deilt samningsdrögum með öðrum aðilum samnings til að fá álit þeirra.',
    description: 'Share link tooltip',
  },
  shareLinkbuttonLabel: {
    id: 'ra.application:summary.shareLinkbuttonLabel',
    defaultMessage: 'Afrita hlekk',
    description: 'Share link copy button label',
  },

  // Alert message for missing information
  alertMissingInfoTitle: {
    id: 'ra.application:summary.alertMissingInfoTitle',
    defaultMessage:
      'Ekki er hægt að halda áfram í undirritun fyrr en eftirfarandi upplýsingar hafa verið fylltar út:',
    description: 'Missing information alert title',
  },
  alertMissingInfoFireProtections: {
    id: 'ra.application:summary.alertMissingInfoFireProtections',
    defaultMessage: 'Staða brunavarna í húsnæðinu',
    description: 'Missing information alert fire protections',
  },
  alertMissingInfoCondition: {
    id: 'ra.application:summary.alertMissingInfoCondition',
    defaultMessage: 'Ástand húsnæðis',
    description: 'Missing information alert condition',
  },
  alertMissingInfoOtherFees: {
    id: 'ra.application:summary.alertMissingInfoOtherFees',
    defaultMessage: 'Önnur gjöld',
    description: 'Missing information alert other fees',
  },
  uniqueApplicantsError: {
    id: 'ra.application:tenantDetails.uniqueApplicantsError',
    defaultMessage:
      'Sami aðili má ekki vera skráður oftar en einu sinni á leigusamning.',
    description: 'Applicant already exists on application error',
  },
})
