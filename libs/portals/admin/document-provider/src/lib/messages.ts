import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // navigation
  rootName: {
    id: 'ap.document-provider:title',
    defaultMessage: 'Skjalaveita',
  },
  documentProviders: {
    id: 'ap.document-provider:document-providers',
    defaultMessage: 'Skjalaveitur',
  },
  documentProviderSingle: {
    id: 'ap.document-provider:document-provider-single',
    defaultMessage: 'Skjalaveitandi',
  },
  MyCategories: {
    id: 'ap.document-provider:my-categories',
    defaultMessage: 'Mínir flokkar',
  },
  Settings: {
    id: 'ap.document-provider:settings',
    defaultMessage: 'Stillingar',
  },
  TechnicalInformation: {
    id: 'ap.document-provider:technical-information',
    defaultMessage: 'Tæknileg útfærsla',
  },
  Statistics: {
    id: 'ap.document-provider:statistics',
    defaultMessage: 'Tölfræði',
  },

  //Screens
  //DashBoard
  DashBoardTitle: {
    id: 'ap.document-provider:dashboard-title',
    defaultMessage: 'Skjalaveita',
  },
  DashBoardDescription: {
    id: 'ap.document-provider:dashboard-description',
    defaultMessage: 'Á þessari síðu getur þú skoðað tölfræði yfir send skjöl.',
  },
  DashBoardStatisticsFileName: {
    id: 'ap.document-provider:dashboard-statistics-file-name',
    defaultMessage: 'Leitaðu eftir skjalaheiti',
  },
  DashBoardStatisticsCategory: {
    id: 'ap.document-provider:dashboard-statistics-category',
    defaultMessage: 'Flokkur',
  },
  DashBoardStatisticsCategoryPlaceHolder: {
    id: 'ap.document-provider:dashboard-statistics-category-placeholder',
    defaultMessage: 'Veldu flokk',
  },
  DashBoardStatisticsType: {
    id: 'ap.document-provider:dashboard-statistics-type',
    defaultMessage: 'Tegund',
  },
  DashBoardStatisticsTypePlaceHolder: {
    id: 'ap.document-provider:dashboard-statistics-type-placeholder',
    defaultMessage: 'Veldu tegund',
  },
  DashBoardStatisticsDateFrom: {
    id: 'ap.document-provider:dashboard-statistics-date-from',
    defaultMessage: 'Dagsetning frá',
  },
  DashBoardStatisticsDateFromPlaceHolder: {
    id: 'ap.document-provider:dashboard-statistics-date-from-placeholder',
    defaultMessage: 'Veldu dagsetningu',
  },
  DashBoardStatisticsDateTo: {
    id: 'ap.document-provider:dashboard-statistics-date-to',
    defaultMessage: 'Dagsetning til',
  },
  DashBoardStatisticsDateToPlaceHolder: {
    id: 'ap.document-provider:dashboard-statistics-date-to-placeholder',
    defaultMessage: 'Veldu dagsetningu',
  },
  DashBoardStatisticsSearchButton: {
    id: 'ap.document-provider:dashboard-statistics-search-button',
    defaultMessage: 'Skoða tölfræði',
  },

  //DocumentProviders
  documentProvidersTitle: {
    id: 'ap.document-provider:document-providers-title',
    defaultMessage: 'Skjalaveitur',
  },
  documentProvidersDescription: {
    id: 'ap.document-provider:document-providers-description',
    defaultMessage:
      'Hér getur þú fundið alla þá skjalaveitur sem nota pósthólf á island.is',
  },
  documentProvidersSearchPlaceholder: {
    id: 'ap.document-provider:document-providers-search-placeholder',
    defaultMessage: 'Leitaðu að skjalaveitu',
  },
  documentProvidersNumberOfSearchResultsFoundMessage: {
    id:
      'ap.document-provider:document-providers-number-of-search-results-found-message',
    defaultMessage: 'Skjalaveitur fundust',
  },
  documentProvidersSearchResultsActionCardLabel: {
    id:
      'ap.document-provider:document-providers-search-results-action-card-label',
    defaultMessage: 'Skoða nánar',
  },
  documentProvidersDateFromLabel: {
    id: 'ap.document-provider:document-providers-datefrom-label',
    defaultMessage: 'Dagsetning frá',
  },
  documentProvidersDateFromPlaceholderText: {
    id: 'ap.document-provider:document-providers-datefrom-placeholder-text',
    defaultMessage: 'Veldu dagsetningu',
  },
  documentProvidersDateToLabel: {
    id: 'ap.document-provider:document-providers-datefrom-label',
    defaultMessage: 'Dagsetning til',
  },
  documentProvidersDateToPlaceholderText: {
    id: 'ap.document-provider:document-providers-dateto-placeholder-text',
    defaultMessage: 'Veldu dagsetningu',
  },
  documentProvidersDateToErrorMessage: {
    id: 'ap.document-provider:document-providers-dateto-error-message',
    defaultMessage: 'Dagsetning til þarf að vera stærri en dagsetning frá',
  },

  //DocumentProvidersSingle
  //DocumentProvidersSingleInstitution
  SingleProviderDescription: {
    id: 'ap.document-provider:document-providers-single-description',
    defaultMessage: 'Ýtarlegar upplýsingar um skjalaveitu',
  },
  SingleProviderOrganisationNameNotFoundMessage: {
    id:
      'ap.document-provider:single-provider-organistion-name-not-found-message',
    defaultMessage: 'Heiti stofnunar fannst ekki',
  },
  SingleProviderInstitutionHeading: {
    id: 'ap.document-provider:document-providers-single-institution-name',
    defaultMessage: 'Stofnun',
  },
  SingleProviderInstitutionNameLabel: {
    id: 'ap.document-provider:document-providers-single-institution-name-label',
    defaultMessage: 'Nafn á stofnun',
  },
  SingleProviderInstitutionNamePlaceholder: {
    id:
      'ap.document-provider:document-providers-single-institution-name-placeholder',
    defaultMessage: 'Nafn á stofnun',
  },
  SingleProviderInstitutionNameError: {
    id: 'ap.document-provider:document-providers-single-institution-name-error',
    defaultMessage: 'Nafn á stofnun er skilyrt',
  },
  SingleProviderInstitutionNationalIdLabel: {
    id:
      'ap.document-provider:document-providers-single-institution-nationalid-label',
    defaultMessage: 'Kennitala',
  },
  SingleProviderInstitutionNationalIdPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-institution-nationalid-placeholder',
    defaultMessage: 'Kennitala',
  },
  SingleProviderInstitutionNationalIdError: {
    id:
      'ap.document-provider:document-providers-single-institution-nationalid-error',
    defaultMessage: 'Kennitala er skilyrt',
  },
  SingleProviderInstitutionNationalIdFormatError: {
    id:
      'ap.document-provider:document-providers-single-institution-nationalid-format-error',
    defaultMessage: 'Kennitala verður að vera á réttu sniði',
  },
  SingleProviderInstitutionEmailLabel: {
    id:
      'ap.document-provider:document-providers-single-institution-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderInstitutionEmailPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-institution-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderInstitutionEmailError: {
    id:
      'ap.document-provider:document-providers-single-institution-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderInstitutionEmailFormatError: {
    id:
      'ap.document-provider:document-providers-single-institution-email-format-error',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderInstitutionPhonenumberLabel: {
    id:
      'ap.document-provider:document-providers-single-institution-phonenumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderInstitutionPhonenumberPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-institution-phonenumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderInstitutionPhonenumberError: {
    id:
      'ap.document-provider:document-providers-single-institution-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderInstitutionPhonenumberErrorOnlyNumbers: {
    id:
      'ap.document-provider:document-providers-single-institution-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderInstitutionPhonenumberErrorLength: {
    id:
      'ap.document-provider:document-providers-single-institution-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },
  SingleProviderInstitutionAddressLabel: {
    id:
      'ap.document-provider:document-providers-single-institution-address-label',
    defaultMessage: 'Heimilisfang',
  },
  SingleProviderInstitutionAddressPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-institution-address-placeholder',
    defaultMessage: 'Heimilisfang',
  },
  SingleProviderInstitutionAddressError: {
    id:
      'ap.document-provider:document-providers-single-institution-address-error',
    defaultMessage: 'Heimilisfang er skilyrt',
  },
  SingleProviderUpdateInformationError: {
    id:
      'ap.document-provider:document-providers-single-update-information-error',
    defaultMessage: 'Ekki tókst að uppfæra upplýsingar',
  },
  SingleProviderUpdateInformationSuccess: {
    id:
      'ap.document-provider:document-providers-single-update-information-success',
    defaultMessage: 'Upplýsingar uppfærðar!',
  },

  //DocumentProvidersSingleResponsibleContact
  SingleProviderResponsibleContactHeading: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-heading',
    defaultMessage: 'Ábyrgðarmaður',
  },
  SingleProviderResponsibleContactNameLabel: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-name-label',
    defaultMessage: 'Nafn',
  },
  SingleProviderResponsibleContactNamePlaceholder: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-name-placeholder',
    defaultMessage: 'Nafn',
  },
  SingleProviderResponsibleContactNameError: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-name-error',
    defaultMessage: 'Nafn er skilyrt',
  },
  SingleProviderResponsibleContactEmailLabel: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderResponsibleContactEmailPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderResponsibleContactEmailError: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderResponsibleContactEmailFormatError: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-email-format-error',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderResponsibleContactPhoneNumberLabel: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-phoneNumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderResponsibleContactPhoneNumberPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-phoneNumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderResponsibleContactPhonenumberError: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderResponsibleContactPhonenumberErrorOnlyNumbers: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderResponsibleContactPhonenumberErrorLength: {
    id:
      'ap.document-provider:document-providers-single-responsible-contact-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },
  SingleProviderGetOrganisationError: {
    id: 'ap.document-provider:document-providers-single-get-organisation-error',
    defaultMessage: 'Ekki tókst að sækja upplýsingar um stofnun með kt.',
  },

  //DocumentProvidersSingleTechnicalContact
  SingleProviderTechnicalContactHeading: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-heading',
    defaultMessage: 'Tæknilegur tengiliður',
  },
  SingleProviderTechnicalContactNameLabel: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-name-label',
    defaultMessage: 'Nafn',
  },
  SingleProviderTechnicalContactNamePlaceholder: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-name-placeholder',
    defaultMessage: 'Nafn',
  },
  SingleProviderTechnicalContactNameError: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-name-error',
    defaultMessage: 'Nafn er skilyrt',
  },
  SingleProviderTechnicalContactEmailLabel: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderTechnicalContactEmailPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderTechnicalContactEmailError: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderTechnicalContactEmailErrorFormat: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-email-error-format',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderTechnicalContactPhoneNumberLabel: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-phoneNumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderTechnicalContactPhoneNumberPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-phoneNumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderTechnicalContactPhonenumberError: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderTechnicalContactPhonenumberErrorOnlyNumbers: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderTechnicalContactPhonenumberErrorLength: {
    id:
      'ap.document-provider:document-providers-single-technical-contact-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },

  //DocumentProvidersSingleUserHelpContact
  SingleProviderUserHelpContactHeading: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-heading',
    defaultMessage: 'Notendaaðstoð',
  },
  SingleProviderUserHelpContactEmailLabel: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderUserHelpEmailError: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderUserHelpEmailErrorFormat: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-email-error-format',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderUserHelpContactEmailPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderUserHelpContactPhoneNumberLabel: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-phoneNumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderUserHelpContactPhoneNumberPlaceholder: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-phoneNumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderUserHelpPhonenumberError: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderUserHelpPhonenumberErrorOnlyNumbers: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderUserHelpPhonenumberErrorLength: {
    id:
      'ap.document-provider:document-providers-single-user-help-contact-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },

  //DocumentProvidersSingleButtons
  SingleProviderBackButton: {
    id: 'ap.document-provider:document-providers-single-back-button',
    defaultMessage: 'Til baka',
  },
  SingleProviderSaveButton: {
    id: 'ap.document-provider:document-providers-single-save-button',
    defaultMessage: 'Vista breytingar',
  },

  //MyCategories
  myCategoriesTitle: {
    id: 'ap.document-provider:my-categories-title',
    defaultMessage: 'Mínir flokkar',
  },
  myCategoriesDescription: {
    id: 'ap.document-provider:my-categories-description',
    defaultMessage:
      'Einungis fyrir skjalaveitendur. Á þessari síðu getur þú bætt/breytt/eytt flokkum... TODO LAST',
  },

  //Settings
  SettingsTitle: {
    id: 'ap.document-provider:document-provider-settings-title',
    defaultMessage: 'Stillingar',
  },
  //Stofnun
  EditInstitution: {
    id: 'ap.document-provider:edit-institution',
    defaultMessage: 'Breyta stofnun',
  },
  EditInstitutionDescription: {
    id: 'ap.document-provider:edit-institution-description',
    defaultMessage: 'Hér getur þú breytt grunnupplýsingum fyrir stofnun',
  },

  //Ábyrgðarmaður
  EditResponsibleContact: {
    id: 'ap.document-provider:edit-responsible-contact',
    defaultMessage: 'Breyta ábyrgðarmanni',
  },
  EditResponsibleContactDescription: {
    id: 'ap.document-provider:edit-responsible-contact-description',
    defaultMessage: 'Hér getur þú breytt upplýsingum um ábyrgðarmann',
  },

  //Tæknilegur tengiliður
  EditTechnicalContact: {
    id: 'ap.document-provider:edit-technical-contact',
    defaultMessage: 'Breyta tæknilegum tengilið',
  },
  EditTechnicalContactDescription: {
    id: 'ap.document-provider:edit-technical-contact-description',
    defaultMessage: 'Hér getur þú breytt upplýsingum um tæknilegan tengilið',
  },

  //Notendaaðstoð
  EditUserHelpContact: {
    id: 'ap.document-provider:edit-user-help-contact',
    defaultMessage: 'Breyta notendaaðstoð',
  },
  EditUserHelpContactDescription: {
    id: 'ap.document-provider:edit-user-help-contact',
    defaultMessage: 'Hér getur þú breytt upplýsingum um notendaaðstoð',
  },

  //Endapunktur
  EditEndPoints: {
    id: 'ap.document-provider:edit-endpoints',
    defaultMessage: 'Breyta endapunkt',
  },
  EditEndPointsDescription: {
    id: 'ap.document-provider:edit-endpoints',
    defaultMessage: 'Hér getur þú breytt endpunkt',
  },

  //EditInstitution
  SettingsEditInstitutionTitle: {
    id: 'ap.document-provider:settings-edit-institution-title',
    defaultMessage: 'Breyta stofnun',
  },
  SettingsEditInstitutionDescription: {
    id: 'ap.document-provider:settings-edit-institution-description',
    defaultMessage: 'Hér kemur form fyrir stofnun TODO',
  },
  SettingsEditInstitutionName: {
    id: 'ap.document-provider:settings-edit-institution-name',
    defaultMessage: 'Nafn á stofnun',
  },
  SettingsEditInstitutionNameRequiredMessage: {
    id: 'ap.document-provider:settings-edit-institution-name-required-message',
    defaultMessage: 'Skylda er að fylla út nafn stofnunar',
  },
  SettingsEditInstitutionNationalId: {
    id: 'ap.document-provider:settings-edit-institution-nationalId',
    defaultMessage: 'Kennitala',
  },
  SettingsEditInstitutionNationalIdRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-institution-nationalId-required-message',
    defaultMessage: 'Skylda er að fylla út kennitölu',
  },
  SettingsEditInstitutionNationalIdWrongFormatMessage: {
    id:
      'ap.document-provider:settings-edit-institution-nationalId-wrong-format-message',
    defaultMessage: 'Kennitalan er ekki á réttu formi',
  },
  SettingsEditInstitutionAddress: {
    id: 'ap.document-provider:settings-edit-institution-address',
    defaultMessage: 'Heimilisfang',
  },
  SettingsEditInstitutionAddressRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-institution-address-required-message',
    defaultMessage: 'Skylda er að fylla út heimilisfang',
  },
  SettingsEditInstitutionEmail: {
    id: 'ap.document-provider:settings-edit-institution-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditInstitutionEmailRequiredMessage: {
    id: 'ap.document-provider:settings-edit-institution-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },
  SettingsEditInstitutionEmailWrongFormatMessage: {
    id:
      'ap.document-provider:settings-edit-institution-email-wrong-format-message',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  },
  SettingsEditInstitutionTel: {
    id: 'ap.document-provider:settings-edit-institution-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditInstitutionTelRequiredMessage: {
    id: 'ap.document-provider:settings-edit-institution-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditInstitutionTelWrongFormatMessage: {
    id:
      'ap.document-provider:settings-edit-institution-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er ekki á réttu formi',
  },
  SettingsEditInstitutionSaveButton: {
    id: 'ap.document-provider:settings-edit-institution-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditInstitutionBackButton: {
    id: 'ap.document-provider:settings-edit-institution-back-button',
    defaultMessage: 'Til baka',
  },

  //EditResponsibleContact
  SettingsEditResponsibleContactTitle: {
    id: 'ap.document-provider:settings-edit-responsible-contact-title',
    defaultMessage: 'Breyta ábyrgðarmanni',
  },
  SettingsEditResponsibleContactDescription: {
    id: 'ap.document-provider:settings-edit-responsible-contact-description',
    defaultMessage: 'Hér kemur form fyrir ábyrgðarmann TODO',
  },
  SettingsEditResponsibleContactName: {
    id: 'ap.document-provider:settings-edit-responsible-contact-name',
    defaultMessage: 'Nafn',
  },
  SettingsEditResponsibleContactNameRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-responsible-contact-name-required-message',
    defaultMessage: 'Skylda er að fylla út nafn',
  },
  SettingsEditResponsibleContactEmail: {
    id: 'ap.document-provider:settings-edit-responsible-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditResponsibleContactEmailRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-responsible-contact-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },
  SettingsEditResponsibleContactEmailWrongFormatMessage: {
    id:
      'ap.document-provider:settings-edit-responsible-contact-email-wrong-format-message',
    defaultMessage: 'Netfangið er á vitlausu formi',
  },
  SettingsEditResponsibleContactTel: {
    id: 'ap.document-provider:settings-edit-responsible-contact-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditResponsibleContactTelRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-responsible-contact-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditResponsibleContactTelWrongFormatMessage: {
    id:
      'ap.document-provider:settings-edit-responsible-contact-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er á vitlausu formi',
  },
  SettingsEditResponsibleContactSaveButton: {
    id: 'ap.document-provider:settings-edit-responsible-contact-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditResponsibleContactBackButton: {
    id: 'ap.document-provider:settings-edit-responsible-contact-back-button',
    defaultMessage: 'Til baka',
  },

  //EditTechnicalContact
  SettingsEditTechnicalContactTitle: {
    id: 'ap.document-provider:settings-edit-technical-contact-title',
    defaultMessage: 'Breyta tæknilegum tengilið',
  },
  SettingsEditTechnicalContactDescription: {
    id: 'ap.document-provider:settings-edit-technical-contact-description',
    defaultMessage: 'Hér kemur form fyrir tæknilegan tengilið TODO',
  },
  SettingsEditTechnicalContactName: {
    id: 'ap.document-provider:settings-edit-technical-contact-name',
    defaultMessage: 'Nafn',
  },
  SettingsEditTechnicalContactNameRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-technical-contact-name-required-message',
    defaultMessage: 'Skylda er að fylla út nafn',
  },
  SettingsEditTechnicalContactEmail: {
    id: 'ap.document-provider:settings-edit-technical-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditTechnicalContactEmailRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-technical-contact-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },

  SettingsEditTechnicalContactEmailWrongFormatMessage: {
    id:
      'ap.document-provider:settings-edit-technical-contact-email-wrong-format-message',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  },
  SettingsEditTechnicalContactTel: {
    id: 'ap.document-provider:settings-edit-technical-contact-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditTechnicalContactTelRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-technical-contact-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditTechnicalContactTelWrongFormatMessage: {
    id:
      'ap.document-provider:settings-edit-technical-contact-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er ekki á réttu formi',
  },
  SettingsEditTechnicalContactSaveButton: {
    id: 'ap.document-provider:settings-edit-technical-contact-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditTechnicalContactBackButton: {
    id: 'ap.document-provider:settings-edit-technical-contact-back-button',
    defaultMessage: 'Til baka',
  },

  //EditUserHelpContact
  SettingsEditUserHelpContactTitle: {
    id: 'ap.document-provider:settings-edit-user-help-contact-title',
    defaultMessage: 'Breyta notendaaðstoð',
  },
  SettingsEditUserHelpContactDescription: {
    id: 'ap.document-provider:settings-edit-user-help-contact-description',
    defaultMessage: 'Hér kemur form fyrir notendaaðstoð TODO',
  },

  SettingsEditUserHelpContactEmail: {
    id: 'ap.document-provider:settings-edit-user-help-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditUserHelpContactEmailRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-user-help-contact-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },
  SettingsEditUserHelpContactEmailWrongFormatMessage: {
    id: 'ap.document-provider:settings-edit-user-help-contact-email',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  },
  SettingsEditUserHelpContactTel: {
    id: 'ap.document-provider:settings-edit-user-help-contact-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditUserHelpContactTelRequiredMessage: {
    id:
      'ap.document-provider:settings-edit-user-help-contact-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditUserHelpContactTelWrongFormatMessage: {
    id:
      'ap.document-provider:settings-edit-user-help-contact-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er ekki á réttu formi',
  },
  SettingsEditHelpContactSaveButton: {
    id: 'ap.document-provider:settings-edit-help-contact-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditHelpContactBackButton: {
    id: 'ap.document-provider:settings-edit-help-contact-back-button',
    defaultMessage: 'Til baka',
  },

  //EditEndPoints
  SettingsEditEndPointsTitle: {
    id: 'ap.document-provider:settings-edit-endpoints-title',
    defaultMessage: 'Breyta endapunkt',
  },
  SettingsEditEndPointsDescription: {
    id: 'ap.document-provider:settings-edit-endpoints-description',
    defaultMessage: 'Hér kemur form fyrir endapunkta TODO',
  },
  SettingsEditEndPointsUrl: {
    id: 'ap.document-provider:settings-edit-endpoints-url',
    defaultMessage: 'Endapunktur',
  },
  SettingsEditEndPointsUrlRequiredMessage: {
    id: 'ap.document-provider:settings-edit-endpoints-url-required-message',
    defaultMessage: 'Skylda er að fylla út endapunkt',
  },
  SettingsEditEndPointsUrlWrongFormatMessage: {
    id: 'ap.document-provider:settings-edit-endpoints-url-wrong-format-message',
    defaultMessage: 'Endapunkturinn er ekki á réttu formi',
  },
  SettingsEditEndPointsSaveButton: {
    id: 'ap.document-provider:settings-edit-endpoints-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditEndPointsBackButton: {
    id: 'ap.document-provider:settings-edit-endpoints-back-button',
    defaultMessage: 'Til baka',
  },

  //TechnicalInformation
  TechnicalInformationTitle: {
    id: 'ap.document-provider:technical-information-title',
    defaultMessage: 'Tæknilegar upplýsingar',
  },
  TechnicalInformationDescription: {
    id: 'ap.document-provider:technical-information-description',
    defaultMessage: 'Á þessari síðu sérð þú upplýsingar um tæknileg atriði',
  },

  //Statistics
  StatisticsTitle: {
    id: 'ap.document-provider:statistics-information-title',
    defaultMessage: 'Tölfræði',
  },
  StatisticsDescription: {
    id: 'ap.document-provider:statistics-information-description',
    defaultMessage: 'Hér er tölfræði yfir rafrænar skjalasendingar ',
  },
  StatisticsSearchPlaceholder: {
    id: 'ap.document-provider:statistics-search-placeholder',
    defaultMessage: 'Leitaðu eftir skjalaveitanda',
  },

  //Statistics boxes
  statisticsBoxOrganisationsCount: {
    id: 'ap.document-provider:statistics-box-organisations-count',
    defaultMessage: 'Fjöldi skjalaveitna',
  },
  statisticsBoxPublishedDocuments: {
    id: 'ap.document-provider:statistics-box-published-documents',
    defaultMessage: 'Send skjöl',
  },
  statisticsBoxOpenedDocuments: {
    id: 'ap.document-provider:statistics-box-opened-documents',
    defaultMessage: 'Opnuð skjöl',
  },
  statisticsBoxNotifications: {
    id: 'ap.document-provider:statistics-box-notifications',
    defaultMessage: 'Hnipp',
  },
  statisticsBoxMillions: {
    id: 'ap.document-provider:statistics-box-millions',
    defaultMessage: 'milljón',
  },
  statisticsBoxThousands: {
    id: 'ap.document-provider:statistics-box-thousands',
    defaultMessage: 'þúsund',
  },
  statisticsBoxNetworkError: {
    id: 'ap.document-provider:statistics-box-network-error',
    defaultMessage: 'Ekki tókst að sækja tölfræði',
  },
})
