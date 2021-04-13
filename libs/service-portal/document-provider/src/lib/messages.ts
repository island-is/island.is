import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // navigation
  rootName: {
    id: 'sp.document-provider:title',
    defaultMessage: 'Skjalaveita',
  },
  documentProviders: {
    id: 'service.portal:document-provider-document-providers',
    defaultMessage: 'Skjalaveitur',
  },
  documentProviderSingle: {
    id: 'service.portal:document-provider-document-provider-single',
    defaultMessage: 'Skjalaveitandi',
  },
  MyCategories: {
    id: 'service.portal:document-provider-my-categories',
    defaultMessage: 'Mínir flokkar',
  },
  Settings: {
    id: 'service.portal:document-provider-settings',
    defaultMessage: 'Stillingar',
  },
  TechnicalInformation: {
    id: 'service.portal:document-provider-technical-information',
    defaultMessage: 'Tæknileg útfærsla',
  },
  Statistics: {
    id: 'service.portal:document-provider-statistics',
    defaultMessage: 'Tölfræði',
  },

  //Screens
  //DashBoard
  DashBoardTitle: {
    id: 'sp.document-provider:dashboard-title',
    defaultMessage: 'Skjalaveita',
  },
  DashBoardDescription: {
    id: 'sp.document-provider:dashboard-description',
    defaultMessage: 'Á þessari síðu getur þú skoðað tölfræði yfir send skjöl.',
  },
  DashBoardStatisticsFileName: {
    id: 'service.portal:document-provider-dashboard-statistics-file-name',
    defaultMessage: 'Leitaðu eftir skjalaheiti',
  },
  DashBoardStatisticsCategory: {
    id: 'service.portal:document-provider-dashboard-statistics-category',
    defaultMessage: 'Flokkur',
  },
  DashBoardStatisticsCategoryPlaceHolder: {
    id:
      'service.portal:document-provider-dashboard-statistics-category-placeholder',
    defaultMessage: 'Veldu flokk',
  },
  DashBoardStatisticsType: {
    id: 'service.portal:document-provider-dashboard-statistics-type',
    defaultMessage: 'Tegund',
  },
  DashBoardStatisticsTypePlaceHolder: {
    id:
      'service.portal:document-provider-dashboard-statistics-type-placeholder',
    defaultMessage: 'Veldu tegund',
  },
  DashBoardStatisticsDateFrom: {
    id: 'service.portal:document-provider-dashboard-statistics-date-from',
    defaultMessage: 'Dagsetning frá',
  },
  DashBoardStatisticsDateFromPlaceHolder: {
    id:
      'service.portal:document-provider-dashboard-statistics-date-from-placeholder',
    defaultMessage: 'Veldu dagsetningu',
  },
  DashBoardStatisticsDateTo: {
    id: 'service.portal:document-provider-dashboard-statistics-date-to',
    defaultMessage: 'Dagsetning til',
  },
  DashBoardStatisticsDateToPlaceHolder: {
    id:
      'service.portal:document-provider-dashboard-statistics-date-to-placeholder',
    defaultMessage: 'Veldu dagsetningu',
  },
  DashBoardStatisticsSearchButton: {
    id: 'service.portal:document-provider-dashboard-statistics-search-button',
    defaultMessage: 'Skoða tölfræði',
  },

  //DocumentProviders
  documentProvidersTitle: {
    id: 'sp.document-provider:document-providers-title',
    defaultMessage: 'Skjalaveitur',
  },
  documentProvidersDescription: {
    id: 'sp.document-provider:document-providers-description',
    defaultMessage:
      'Hér getur þú fundið alla þá skjalaveitur sem nota pósthólf á island.is',
  },
  documentProvidersSearchPlaceholder: {
    id: 'sp.document-provider:document-providers-search-placeholder',
    defaultMessage: 'Leitaðu að skjalaveitu',
  },
  documentProvidersNumberOfSearchResultsFoundMessage: {
    id:
      'sp.document-provider:document-providers-number-of-search-results-found-message',
    defaultMessage: 'Skjalaveitur fundust',
  },
  documentProvidersSearchResultsActionCardLabel: {
    id:
      'sp.document-provider:document-providers-search-results-action-card-label',
    defaultMessage: 'Skoða nánar',
  },
  documentProvidersDateFromLabel: {
    id: 'sp.document-provider:document-providers-datefrom-label',
    defaultMessage: 'Dagsetning frá',
  },
  documentProvidersDateFromPlaceholderText: {
    id: 'sp.document-provider:document-providers-datefrom-placeholder-text',
    defaultMessage: 'Veldu dagsetningu',
  },
  documentProvidersDateToLabel: {
    id: 'sp.document-provider:document-providers-datefrom-label',
    defaultMessage: 'Dagsetning til',
  },
  documentProvidersDateToPlaceholderText: {
    id: 'sp.document-provider:document-providers-dateto-placeholder-text',
    defaultMessage: 'Veldu dagsetningu',
  },
  documentProvidersDateToErrorMessage: {
    id: 'sp.document-provider:document-providers-dateto-error-message',
    defaultMessage: 'Dagsetning til þarf að vera stærri en dagsetning frá',
  },

  //DocumentProvidersSingle
  //DocumentProvidersSingleInstitution
  SingleProviderDescription: {
    id: 'sp.document-provider:document-providers-single-description',
    defaultMessage: 'Ýtarlegar upplýsingar um skjalaveitu',
  },
  SingleProviderOrganisationNameNotFoundMessage: {
    id:
      'sp.document-provider:single-provider-organistion-name-not-found-message',
    defaultMessage: 'Heiti stofnunar fannst ekki',
  },
  SingleProviderInstitutionHeading: {
    id: 'sp.document-provider:document-providers-single-institution-name',
    defaultMessage: 'Stofnun',
  },
  SingleProviderInstitutionNameLabel: {
    id: 'sp.document-provider:document-providers-single-institution-name-label',
    defaultMessage: 'Nafn á stofnun',
  },
  SingleProviderInstitutionNamePlaceholder: {
    id:
      'sp.document-provider:document-providers-single-institution-name-placeholder',
    defaultMessage: 'Nafn á stofnun',
  },
  SingleProviderInstitutionNameError: {
    id: 'sp.document-provider:document-providers-single-institution-name-error',
    defaultMessage: 'Nafn á stofnun er skilyrt',
  },
  SingleProviderInstitutionNationalIdLabel: {
    id:
      'sp.document-provider:document-providers-single-institution-nationalid-label',
    defaultMessage: 'Kennitala',
  },
  SingleProviderInstitutionNationalIdPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-institution-nationalid-placeholder',
    defaultMessage: 'Kennitala',
  },
  SingleProviderInstitutionNationalIdError: {
    id:
      'sp.document-provider:document-providers-single-institution-nationalid-error',
    defaultMessage: 'Kennitala er skilyrt',
  },
  SingleProviderInstitutionNationalIdFormatError: {
    id:
      'sp.document-provider:document-providers-single-institution-nationalid-format-error',
    defaultMessage: 'Kennitala verður að vera á réttu sniði',
  },
  SingleProviderInstitutionEmailLabel: {
    id:
      'sp.document-provider:document-providers-single-institution-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderInstitutionEmailPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-institution-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderInstitutionEmailError: {
    id:
      'sp.document-provider:document-providers-single-institution-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderInstitutionEmailFormatError: {
    id:
      'sp.document-provider:document-providers-single-institution-email-format-error',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderInstitutionPhonenumberLabel: {
    id:
      'sp.document-provider:document-providers-single-institution-phonenumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderInstitutionPhonenumberPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-institution-phonenumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderInstitutionPhonenumberError: {
    id:
      'sp.document-provider:document-providers-single-institution-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderInstitutionPhonenumberErrorOnlyNumbers: {
    id:
      'sp.document-provider:document-providers-single-institution-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderInstitutionPhonenumberErrorLength: {
    id:
      'sp.document-provider:document-providers-single-institution-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },
  SingleProviderInstitutionAddressLabel: {
    id:
      'sp.document-provider:document-providers-single-institution-address-label',
    defaultMessage: 'Heimilisfang',
  },
  SingleProviderInstitutionAddressPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-institution-address-placeholder',
    defaultMessage: 'Heimilisfang',
  },
  SingleProviderInstitutionAddressError: {
    id:
      'sp.document-provider:document-providers-single-institution-address-error',
    defaultMessage: 'Heimilisfang er skilyrt',
  },
  SingleProviderUpdateInformationError: {
    id:
      'sp.document-provider:document-providers-single-update-information-error',
    defaultMessage: 'Ekki tókst að uppfæra upplýsingar',
  },
  SingleProviderUpdateInformationSuccess: {
    id:
      'sp.document-provider:document-providers-single-update-information-success',
    defaultMessage: 'Upplýsingar uppfærðar!',
  },

  //DocumentProvidersSingleResponsibleContact
  SingleProviderResponsibleContactHeading: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-heading',
    defaultMessage: 'Ábyrgðarmaður',
  },
  SingleProviderResponsibleContactNameLabel: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-name-label',
    defaultMessage: 'Nafn',
  },
  SingleProviderResponsibleContactNamePlaceholder: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-name-placeholder',
    defaultMessage: 'Nafn',
  },
  SingleProviderResponsibleContactNameError: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-name-error',
    defaultMessage: 'Nafn er skilyrt',
  },
  SingleProviderResponsibleContactEmailLabel: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderResponsibleContactEmailPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderResponsibleContactEmailError: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderResponsibleContactEmailFormatError: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-email-format-error',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderResponsibleContactPhoneNumberLabel: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-phoneNumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderResponsibleContactPhoneNumberPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-phoneNumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderResponsibleContactPhonenumberError: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderResponsibleContactPhonenumberErrorOnlyNumbers: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderResponsibleContactPhonenumberErrorLength: {
    id:
      'sp.document-provider:document-providers-single-responsible-contact-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },
  SingleProviderGetOrganisationError: {
    id: 'sp.document-provider:document-providers-single-get-organisation-error',
    defaultMessage: 'Ekki tókst að sækja upplýsingar um stofnun með kt.',
  },

  //DocumentProvidersSingleTechnicalContact
  SingleProviderTechnicalContactHeading: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-heading',
    defaultMessage: 'Tæknilegur tengiliður',
  },
  SingleProviderTechnicalContactNameLabel: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-name-label',
    defaultMessage: 'Nafn',
  },
  SingleProviderTechnicalContactNamePlaceholder: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-name-placeholder',
    defaultMessage: 'Nafn',
  },
  SingleProviderTechnicalContactNameError: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-name-error',
    defaultMessage: 'Nafn er skilyrt',
  },
  SingleProviderTechnicalContactEmailLabel: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderTechnicalContactEmailPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderTechnicalContactEmailError: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderTechnicalContactEmailErrorFormat: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-email-error-format',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderTechnicalContactPhoneNumberLabel: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-phoneNumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderTechnicalContactPhoneNumberPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-phoneNumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderTechnicalContactPhonenumberError: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderTechnicalContactPhonenumberErrorOnlyNumbers: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderTechnicalContactPhonenumberErrorLength: {
    id:
      'sp.document-provider:document-providers-single-technical-contact-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },

  //DocumentProvidersSingleUserHelpContact
  SingleProviderUserHelpContactHeading: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-heading',
    defaultMessage: 'Notendaaðstoð',
  },
  SingleProviderUserHelpContactEmailLabel: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderUserHelpEmailError: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderUserHelpEmailErrorFormat: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-email-error-format',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderUserHelpContactEmailPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderUserHelpContactPhoneNumberLabel: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-phoneNumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderUserHelpContactPhoneNumberPlaceholder: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-phoneNumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderUserHelpPhonenumberError: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderUserHelpPhonenumberErrorOnlyNumbers: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderUserHelpPhonenumberErrorLength: {
    id:
      'sp.document-provider:document-providers-single-user-help-contact-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },

  //DocumentProvidersSingleButtons
  SingleProviderBackButton: {
    id: 'sp.document-provider:document-providers-single-back-button',
    defaultMessage: 'Til baka',
  },
  SingleProviderSaveButton: {
    id: 'sp.document-provider:document-providers-single-save-button',
    defaultMessage: 'Vista breytingar',
  },

  //MyCategories
  myCategoriesTitle: {
    id: 'sp.document-provider:my-categories-title',
    defaultMessage: 'Mínir flokkar',
  },
  myCategoriesDescription: {
    id: 'sp.document-provider:my-categories-description',
    defaultMessage:
      'Einungis fyrir skjalaveitendur. Á þessari síðu getur þú bætt/breytt/eytt flokkum... TODO LAST',
  },

  //Settings
  SettingsTitle: {
    id: 'service.portal:document-provider-settings-title',
    defaultMessage: 'Stillingar',
  },
  //Stofnun
  EditInstitution: {
    id: 'sp.document-provider:edit-institution',
    defaultMessage: 'Breyta stofnun',
  },
  EditInstitutionDescription: {
    id: 'sp.document-provider:edit-institution-description',
    defaultMessage: 'Hér getur þú breytt grunnupplýsingum fyrir stofnun',
  },
  EditInstitutionTagOne: {
    id: 'service.portal:name',
    defaultMessage: 'Nafn',
  },
  EditInstitutionTagTwo: {
    id: 'service.portal:nationalId',
    defaultMessage: 'Kennitala',
  },
  EditInstitutionTagThree: {
    id: 'service.portal:address',
    defaultMessage: 'Heimilisfang',
  },
  EditInstitutionTagFour: {
    id: 'service.portal:email',
    defaultMessage: 'Netfang',
  },
  EditInstitutionTagFive: {
    id: 'service.portal:tel',
    defaultMessage: 'Símanúmer',
  },

  //Ábyrgðarmaður
  EditResponsibleContact: {
    id: 'sp.document-provider:edit-responsible-contact',
    defaultMessage: 'Breyta ábyrgðarmanni',
  },
  EditResponsibleContactDescription: {
    id: 'sp.document-provider:edit-responsible-contact-description',
    defaultMessage: 'Hér getur þú breytt upplýsingum um ábyrgðarmann',
  },
  EditResponsibleContactTagOne: {
    id: 'service.portal:name',
    defaultMessage: 'Nafn',
  },
  EditResponsibleContactTagTwo: {
    id: 'service.portal:email',
    defaultMessage: 'Netfang',
  },
  EditResponsibleContactTagThree: {
    id: 'service.portal:tel',
    defaultMessage: 'Símanúmer',
  },

  //Tæknilegur tengiliður
  EditTechnicalContact: {
    id: 'sp.document-provider:edit-technical-contact',
    defaultMessage: 'Breyta tæknilegum tengilið',
  },
  EditTechnicalContactDescription: {
    id: 'sp.document-provider:edit-technical-contact-description',
    defaultMessage: 'Hér getur þú breytt upplýsingum um tæknilegan tengilið',
  },
  EditTechnicalContactTagOne: {
    id: 'service.portal:nafn',
    defaultMessage: 'Nafn',
  },
  EditTechnicalContactTagTwo: {
    id: 'service.portal:email',
    defaultMessage: 'Netfang',
  },
  EditTechnicalContactTagThree: {
    id: 'service.portal:tel',
    defaultMessage: 'Símanúmer',
  },

  //Notendaaðstoð
  EditUserHelpContact: {
    id: 'sp.document-provider:edit-user-help-contact',
    defaultMessage: 'Breyta notendaaðstoð',
  },
  EditUserHelpContactDescription: {
    id: 'sp.document-provider:edit-user-help-contact',
    defaultMessage: 'Hér getur þú breytt upplýsingum um notendaaðstoð',
  },
  EditUserHelpContactTagOne: {
    id: 'service.portal:email',
    defaultMessage: 'Netfang',
  },
  EditUserHelpContactTagTwo: {
    id: 'service.portal:tel',
    defaultMessage: 'Símanúmer',
  },

  //Endapunktur
  EditEndPoints: {
    id: 'sp.document-provider:edit-endpoints',
    defaultMessage: 'Breyta endapunkt',
  },
  EditEndPointsDescription: {
    id: 'sp.document-provider:edit-endpoints',
    defaultMessage: 'Hér getur þú breytt endpunkt',
  },
  EditEndPointsTagOne: {
    id: 'service.portal:endpoint',
    defaultMessage: 'Endapunktur',
  },

  //EditInstitution
  SettingsEditInstitutionTitle: {
    id: 'sp.document-provider:settings-edit-institution-title',
    defaultMessage: 'Breyta stofnun',
  },
  SettingsEditInstitutionDescription: {
    id: 'sp.document-provider:settings-edit-institution-description',
    defaultMessage: 'Hér kemur form fyrir stofnun TODO',
  },
  SettingsEditInstitutionName: {
    id: 'sp.document-provider:settings-edit-institution-name',
    defaultMessage: 'Nafn á stofnun',
  },
  SettingsEditInstitutionNameRequiredMessage: {
    id: 'sp.document-provider:settings-edit-institution-name-required-message',
    defaultMessage: 'Skylda er að fylla út nafn stofnunar',
  },
  SettingsEditInstitutionNationalId: {
    id: 'sp.document-provider:settings-edit-institution-nationalId',
    defaultMessage: 'Kennitala',
  },
  SettingsEditInstitutionNationalIdRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-institution-nationalId-required-message',
    defaultMessage: 'Skylda er að fylla út kennitölu',
  },
  SettingsEditInstitutionNationalIdWrongFormatMessage: {
    id:
      'sp.document-provider:settings-edit-institution-nationalId-wrong-format-message',
    defaultMessage: 'Kennitalan er ekki á réttu formi',
  },
  SettingsEditInstitutionAddress: {
    id: 'sp.document-provider:settings-edit-institution-address',
    defaultMessage: 'Heimilisfang',
  },
  SettingsEditInstitutionAddressRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-institution-address-required-message',
    defaultMessage: 'Skylda er að fylla út heimilisfang',
  },
  SettingsEditInstitutionEmail: {
    id: 'sp.document-provider:settings-edit-institution-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditInstitutionEmailRequiredMessage: {
    id: 'sp.document-provider:settings-edit-institution-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },
  SettingsEditInstitutionEmailWrongFormatMessage: {
    id:
      'sp.document-provider:settings-edit-institution-email-wrong-format-message',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  },
  SettingsEditInstitutionTel: {
    id: 'sp.document-provider:settings-edit-institution-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditInstitutionTelRequiredMessage: {
    id: 'sp.document-provider:settings-edit-institution-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditInstitutionTelWrongFormatMessage: {
    id:
      'sp.document-provider:settings-edit-institution-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er ekki á réttu formi',
  },
  SettingsEditInstitutionSaveButton: {
    id: 'sp.document-provider:settings-edit-institution-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditInstitutionBackButton: {
    id: 'sp.document-provider:settings-edit-institution-back-button',
    defaultMessage: 'Til baka',
  },

  //EditResponsibleContact
  SettingsEditResponsibleContactTitle: {
    id: 'sp.document-provider:settings-edit-responsible-contact-title',
    defaultMessage: 'Breyta ábyrgðarmanni',
  },
  SettingsEditResponsibleContactDescription: {
    id: 'sp.document-provider:settings-edit-responsible-contact-description',
    defaultMessage: 'Hér kemur form fyrir ábyrgðarmann TODO',
  },
  SettingsEditResponsibleContactName: {
    id: 'sp.document-provider:settings-edit-responsible-contact-name',
    defaultMessage: 'Nafn',
  },
  SettingsEditResponsibleContactNameRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-responsible-contact-name-required-message',
    defaultMessage: 'Skylda er að fylla út nafn',
  },
  SettingsEditResponsibleContactEmail: {
    id: 'sp.document-provider:settings-edit-responsible-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditResponsibleContactEmailRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-responsible-contact-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },
  SettingsEditResponsibleContactEmailWrongFormatMessage: {
    id:
      'sp.document-provider:settings-edit-responsible-contact-email-wrong-format-message',
    defaultMessage: 'Netfangið er á vitlausu formi',
  },
  SettingsEditResponsibleContactTel: {
    id: 'sp.document-provider:settings-edit-responsible-contact-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditResponsibleContactTelRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-responsible-contact-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditResponsibleContactTelWrongFormatMessage: {
    id:
      'sp.document-provider:settings-edit-responsible-contact-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er á vitlausu formi',
  },
  SettingsEditResponsibleContactSaveButton: {
    id: 'sp.document-provider:settings-edit-responsible-contact-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditResponsibleContactBackButton: {
    id: 'sp.document-provider:settings-edit-responsible-contact-back-button',
    defaultMessage: 'Til baka',
  },

  //EditTechnicalContact
  SettingsEditTechnicalContactTitle: {
    id: 'sp.document-provider:settings-edit-technical-contact-title',
    defaultMessage: 'Breyta tæknilegum tengilið',
  },
  SettingsEditTechnicalContactDescription: {
    id: 'sp.document-provider:settings-edit-technical-contact-description',
    defaultMessage: 'Hér kemur form fyrir tæknilegan tengilið TODO',
  },
  SettingsEditTechnicalContactName: {
    id: 'sp.document-provider:settings-edit-technical-contact-name',
    defaultMessage: 'Nafn',
  },
  SettingsEditTechnicalContactNameRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-technical-contact-name-required-message',
    defaultMessage: 'Skylda er að fylla út nafn',
  },
  SettingsEditTechnicalContactEmail: {
    id: 'sp.document-provider:settings-edit-technical-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditTechnicalContactEmailRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-technical-contact-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },

  SettingsEditTechnicalContactEmailWrongFormatMessage: {
    id:
      'sp.document-provider:settings-edit-technical-contact-email-wrong-format-message',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  },
  SettingsEditTechnicalContactTel: {
    id: 'sp.document-provider:settings-edit-technical-contact-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditTechnicalContactTelRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-technical-contact-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditTechnicalContactTelWrongFormatMessage: {
    id:
      'sp.document-provider:settings-edit-technical-contact-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er ekki á réttu formi',
  },
  SettingsEditTechnicalContactSaveButton: {
    id: 'sp.document-provider:settings-edit-technical-contact-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditTechnicalContactBackButton: {
    id: 'sp.document-provider:settings-edit-technical-contact-back-button',
    defaultMessage: 'Til baka',
  },

  //EditUserHelpContact
  SettingsEditUserHelpContactTitle: {
    id: 'sp.document-provider:settings-edit-user-help-contact-title',
    defaultMessage: 'Breyta notendaaðstoð',
  },
  SettingsEditUserHelpContactDescription: {
    id: 'sp.document-provider:settings-edit-user-help-contact-description',
    defaultMessage: 'Hér kemur form fyrir notendaaðstoð TODO',
  },

  SettingsEditUserHelpContactEmail: {
    id: 'sp.document-provider:settings-edit-user-help-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditUserHelpContactEmailRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-user-help-contact-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },
  SettingsEditUserHelpContactEmailWrongFormatMessage: {
    id: 'sp.document-provider:settings-edit-user-help-contact-email',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  },
  SettingsEditUserHelpContactTel: {
    id: 'sp.document-provider:settings-edit-user-help-contact-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditUserHelpContactTelRequiredMessage: {
    id:
      'sp.document-provider:settings-edit-user-help-contact-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditUserHelpContactTelWrongFormatMessage: {
    id:
      'sp.document-provider:settings-edit-user-help-contact-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er ekki á réttu formi',
  },
  SettingsEditHelpContactSaveButton: {
    id: 'sp.document-provider:settings-edit-help-contact-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditHelpContactBackButton: {
    id: 'sp.document-provider:settings-edit-help-contact-back-button',
    defaultMessage: 'Til baka',
  },

  //EditEndPoints
  SettingsEditEndPointsTitle: {
    id: 'sp.document-provider:settings-edit-endpoints-title',
    defaultMessage: 'Breyta endapunkt',
  },
  SettingsEditEndPointsDescription: {
    id: 'sp.document-provider:settings-edit-endpoints-description',
    defaultMessage: 'Hér kemur form fyrir endapunkta TODO',
  },
  SettingsEditEndPointsUrl: {
    id: 'sp.document-provider:settings-edit-endpoints-url',
    defaultMessage: 'Endapunktur',
  },
  SettingsEditEndPointsUrlRequiredMessage: {
    id: 'sp.document-provider:settings-edit-endpoints-url-required-message',
    defaultMessage: 'Skylda er að fylla út endapunkt',
  },
  SettingsEditEndPointsUrlWrongFormatMessage: {
    id: 'sp.document-provider:settings-edit-endpoints-url-wrong-format-message',
    defaultMessage: 'Endapunkturinn er ekki á réttu formi',
  },
  SettingsEditEndPointsSaveButton: {
    id: 'sp.document-provider:settings-edit-endpoints-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditEndPointsBackButton: {
    id: 'sp.document-provider:settings-edit-endpoints-back-button',
    defaultMessage: 'Til baka',
  },

  //TechnicalInformation
  TechnicalInformationTitle: {
    id: 'sp.document-provider:technical-information-title',
    defaultMessage: 'Tæknilegar upplýsingar',
  },
  TechnicalInformationDescription: {
    id: 'sp.document-provider:technical-information-description',
    defaultMessage: 'Á þessari síðu sérð þú upplýsingar um tæknileg atriði',
  },

  //Statistics
  StatisticsTitle: {
    id: 'sp.document-provider:statistics-information-title',
    defaultMessage: 'Tölfræði',
  },
  StatisticsDescription: {
    id: 'sp.document-provider:statistics-information-description',
    defaultMessage: 'Hér er tölfræði yfir rafrænar skjalasendingar ',
  },
  StatisticsSearchPlaceholder: {
    id: 'sp.document-provider:statistics-search-placeholder',
    defaultMessage: 'Leitaðu eftir skjalaveitanda',
  },

  //Statistics boxes
  statisticsBoxOrganisationsCount: {
    id: 'sp.document-provider:statistics-box-organisations-count',
    defaultMessage: 'Fjöldi skjalaveitna',
  },
  statisticsBoxPublishedDocuments: {
    id: 'sp.document-provider:statistics-box-published-documents',
    defaultMessage: 'Send skjöl',
  },
  statisticsBoxOpenedDocuments: {
    id: 'sp.document-provider:statistics-box-opened-documents',
    defaultMessage: 'Opnuð skjöl',
  },
  statisticsBoxNotifications: {
    id: 'sp.document-provider:statistics-box-notifications',
    defaultMessage: 'Hnipp',
  },
  statisticsBoxMillions: {
    id: 'sp.document-provider:statistics-box-millions',
    defaultMessage: 'milljón',
  },
  statisticsBoxThousands: {
    id: 'sp.document-provider:statistics-box-thousands',
    defaultMessage: 'þúsund',
  },
  statisticsBoxNetworkError: {
    id: 'sp.document-provider:statistics-box-network-error',
    defaultMessage: 'Ekki tókst að sækja tölfræði',
  },
})
