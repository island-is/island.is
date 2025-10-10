import { defineMessages } from 'react-intl'

export const m = defineMessages({
  documentProvidersNoData: {
    id: 'portals-admin.document-provider:document-providers-no-data',
    defaultMessage: 'Engin gögn...',
  },
  statisticsBoxBenefit: {
    id: 'portals-admin.document-provider:statistics-box-benefit',
    defaultMessage: 'Ávinningur',
  },
  statisticsBoxBenefitInCrowns: {
    id: 'portals-admin.document-provider:statistics-box-benefit-in-crowns',
    defaultMessage: 'Ávinningur í krónum',
  },
  // navigation
  rootName: {
    id: 'portals-admin.document-provider:title',
    defaultMessage: 'Skjalaveita',
  },
  overview: {
    id: 'portals-admin.document-provider:overview',
    defaultMessage: 'Yfirlit',
  },
  documentProviders: {
    id: 'portals-admin.document-provider:document-providers',
    defaultMessage: 'Skjalaveitur',
  },
  documentProviderSingle: {
    id: 'portals-admin.document-provider:document-provider-single',
    defaultMessage: 'Skjalaveitandi',
  },
  paper: {
    id: 'portals-admin.document-provider:paper',
    defaultMessage: 'Pappír',
  },
  MyCategories: {
    id: 'portals-admin.document-provider:my-categories',
    defaultMessage: 'Mínir flokkar',
  },
  Settings: {
    id: 'portals-admin.document-provider:settings',
    defaultMessage: 'Stillingar',
  },
  TechnicalInformation: {
    id: 'portals-admin.document-provider:technical-information',
    defaultMessage: 'Tæknileg útfærsla',
  },
  Statistics: {
    id: 'portals-admin.document-provider:statistics',
    defaultMessage: 'Tölfræði',
  },

  //Screens
  //DashBoard
  DashBoardTitle: {
    id: 'portals-admin.document-provider:dashboard-title',
    defaultMessage: 'Skjalaveita',
  },
  DashBoardDescription: {
    id: 'portals-admin.document-provider:dashboard-description',
    defaultMessage: 'Á þessari síðu getur þú skoðað tölfræði yfir send skjöl.',
  },
  DashBoardStatisticsFileName: {
    id: 'portals-admin.document-provider:dashboard-statistics-file-name',
    defaultMessage: 'Leitaðu eftir skjalaheiti',
  },
  DashBoardStatisticsCategory: {
    id: 'portals-admin.document-provider:dashboard-statistics-category',
    defaultMessage: 'Flokkur',
  },
  DashBoardStatisticsCategoryPlaceHolder: {
    id: 'portals-admin.document-provider:dashboard-statistics-category-placeholder',
    defaultMessage: 'Veldu flokk',
  },
  DashBoardStatisticsType: {
    id: 'portals-admin.document-provider:dashboard-statistics-type',
    defaultMessage: 'Tegund',
  },
  DashBoardStatisticsTypePlaceHolder: {
    id: 'portals-admin.document-provider:dashboard-statistics-type-placeholder',
    defaultMessage: 'Veldu tegund',
  },
  DashBoardStatisticsDateFrom: {
    id: 'portals-admin.document-provider:dashboard-statistics-date-from',
    defaultMessage: 'Dagsetning frá',
  },
  DashBoardStatisticsDateFromPlaceHolder: {
    id: 'portals-admin.document-provider:dashboard-statistics-date-from-placeholder',
    defaultMessage: 'Veldu dagsetningu',
  },
  DashBoardStatisticsDateTo: {
    id: 'portals-admin.document-provider:dashboard-statistics-date-to',
    defaultMessage: 'Dagsetning til',
  },
  DashBoardStatisticsDateToPlaceHolder: {
    id: 'portals-admin.document-provider:dashboard-statistics-date-to-placeholder',
    defaultMessage: 'Veldu dagsetningu',
  },
  DashBoardStatisticsSearchButton: {
    id: 'portals-admin.document-provider:dashboard-statistics-search-button',
    defaultMessage: 'Skoða tölfræði',
  },

  //Charts
  sentFilesAndErrors: {
    id: 'portals-admin.document-provider:sent-files-and-errors',
    defaultMessage: 'Skjöl afhend og villur',
  },
  sentErrors: {
    id: 'portals-admin.document-provider:sent-errors',
    defaultMessage: 'Villur',
  },

  //DocumentProviders
  documentProvidersTitle: {
    id: 'portals-admin.document-provider:document-providers-title',
    defaultMessage: 'Skjalaveitur',
  },
  documentProvidersDescription: {
    id: 'portals-admin.document-provider:document-providers-description',
    defaultMessage: 'Ítarlegar upplýsingar um skjalaveitur',
  },
  documentProvidersSearchPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-search-placeholder',
    defaultMessage: 'Leitaðu að skjalaveitu',
  },
  documentProvidersNumberOfSearchResultsFoundMessage: {
    id: 'portals-admin.document-provider:document-providers-number-of-search-results-found-message',
    defaultMessage: 'Skjalaveitur fundust',
  },
  documentProvidersSearchResultsActionCardLabel: {
    id: 'portals-admin.document-provider:document-providers-search-results-action-card-label',
    defaultMessage: 'Skoða nánar',
  },
  documentProvidersDateFromLabel: {
    id: 'portals-admin.document-provider:document-providers-datefrom-label',
    defaultMessage: 'Dagsetning frá',
  },
  documentProvidersDateFromPlaceholderText: {
    id: 'portals-admin.document-provider:document-providers-datefrom-placeholder-text',
    defaultMessage: 'Veldu dagsetningu',
  },
  documentProvidersDateToLabel: {
    id: 'portals-admin.document-provider:document-providers-dateto-label',
    defaultMessage: 'Dagsetning til',
  },
  documentProvidersDateToPlaceholderText: {
    id: 'portals-admin.document-provider:document-providers-dateto-placeholder-text',
    defaultMessage: 'Veldu dagsetningu',
  },
  documentProvidersDateToErrorMessage: {
    id: 'portals-admin.document-provider:document-providers-dateto-error-message',
    defaultMessage: 'Dagsetning til þarf að vera stærri en dagsetning frá',
  },

  //DocumentProvidersSingle
  //DocumentProvidersSingleInstitution
  SingleProviderDescription: {
    id: 'portals-admin.document-provider:document-providers-single-description',
    defaultMessage: 'Ýtarlegar upplýsingar um skjalaveitu',
  },
  SingleProviderOrganisationNameNotFoundMessage: {
    id: 'portals-admin.document-provider:single-provider-organistion-name-not-found-message',
    defaultMessage: 'Heiti stofnunar fannst ekki',
  },
  SingleProviderInstitutionHeading: {
    id: 'portals-admin.document-provider:document-providers-single-institution-name',
    defaultMessage: 'Stofnun',
  },
  SingleProviderInstitutionNameLabel: {
    id: 'portals-admin.document-provider:document-providers-single-institution-name-label',
    defaultMessage: 'Nafn á stofnun',
  },
  SingleProviderInstitutionNamePlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-institution-name-placeholder',
    defaultMessage: 'Nafn á stofnun',
  },
  SingleProviderInstitutionNameError: {
    id: 'portals-admin.document-provider:document-providers-single-institution-name-error',
    defaultMessage: 'Nafn á stofnun er skilyrt',
  },
  SingleProviderInstitutionNationalIdLabel: {
    id: 'portals-admin.document-provider:document-providers-single-institution-nationalid-label',
    defaultMessage: 'Kennitala',
  },
  SingleProviderInstitutionNationalIdPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-institution-nationalid-placeholder',
    defaultMessage: 'Kennitala',
  },
  SingleProviderInstitutionNationalIdError: {
    id: 'portals-admin.document-provider:document-providers-single-institution-nationalid-error',
    defaultMessage: 'Kennitala er skilyrt',
  },
  SingleProviderInstitutionNationalIdFormatError: {
    id: 'portals-admin.document-provider:document-providers-single-institution-nationalid-format-error',
    defaultMessage: 'Kennitala verður að vera á réttu sniði',
  },
  SingleProviderInstitutionEmailLabel: {
    id: 'portals-admin.document-provider:document-providers-single-institution-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderInstitutionEmailPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-institution-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderInstitutionEmailError: {
    id: 'portals-admin.document-provider:document-providers-single-institution-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderInstitutionEmailFormatError: {
    id: 'portals-admin.document-provider:document-providers-single-institution-email-format-error',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderInstitutionPhonenumberLabel: {
    id: 'portals-admin.document-provider:document-providers-single-institution-phonenumber-label',
    defaultMessage: 'Símanúmer',
  },

  SingleProviderInstitutionPhonenumberPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-institution-phonenumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderInstitutionPhonenumberError: {
    id: 'portals-admin.document-provider:document-providers-single-institution-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderInstitutionPhonenumberErrorOnlyNumbers: {
    id: 'portals-admin.document-provider:document-providers-single-institution-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderInstitutionPhonenumberErrorLength: {
    id: 'portals-admin.document-provider:document-providers-single-institution-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },
  SingleProviderInstitutionAddressLabel: {
    id: 'portals-admin.document-provider:document-providers-single-institution-address-label',
    defaultMessage: 'Heimilisfang',
  },
  SingleProviderInstitutionAddressPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-institution-address-placeholder',
    defaultMessage: 'Heimilisfang',
  },
  SingleProviderInstitutionAddressError: {
    id: 'portals-admin.document-provider:document-providers-single-institution-address-error',
    defaultMessage: 'Heimilisfang er skilyrt',
  },
  SingleProviderInstitutionZendeskIdLabel: {
    id: 'portals-admin.document-provider:document-providers-single-institution-zendeskid-label',
    defaultMessage: 'Zendesk ID',
  },
  SingleProviderInstitutionZendeskIdPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-institution-zendeskid-placeholder',
    defaultMessage: 'Zendesk ID',
  },
  SingleProviderUpdateInformationError: {
    id: 'portals-admin.document-provider:document-providers-single-update-information-error',
    defaultMessage: 'Ekki tókst að uppfæra upplýsingar',
  },
  SingleProviderUpdateInformationSuccess: {
    id: 'portals-admin.document-provider:document-providers-single-update-information-success',
    defaultMessage: 'Upplýsingar uppfærðar!',
  },
  //DocumentProvidersSingleResponsibleContact
  SingleProviderResponsibleContactHeading: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-heading',
    defaultMessage: 'Ábyrgðarmaður',
  },
  SingleProviderResponsibleContactNameLabel: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-name-label',
    defaultMessage: 'Nafn',
  },
  SingleProviderResponsibleContactNamePlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-name-placeholder',
    defaultMessage: 'Nafn',
  },
  SingleProviderResponsibleContactNameError: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-name-error',
    defaultMessage: 'Nafn er skilyrt',
  },
  SingleProviderResponsibleContactEmailLabel: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderResponsibleContactEmailPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderResponsibleContactEmailError: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderResponsibleContactEmailFormatError: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-email-format-error',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderResponsibleContactPhoneNumberLabel: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-phoneNumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderResponsibleContactPhoneNumberPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-phoneNumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderResponsibleContactPhonenumberError: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderResponsibleContactPhonenumberErrorOnlyNumbers: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderResponsibleContactPhonenumberErrorLength: {
    id: 'portals-admin.document-provider:document-providers-single-responsible-contact-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },
  SingleProviderGetOrganisationError: {
    id: 'portals-admin.document-provider:document-providers-single-get-organisation-error',
    defaultMessage: 'Ekki tókst að sækja upplýsingar um stofnun með kt.',
  },

  //DocumentProvidersSingleTechnicalContact
  SingleProviderTechnicalContactHeading: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-heading',
    defaultMessage: 'Tæknilegur tengiliður',
  },
  SingleProviderTechnicalContactNameLabel: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-name-label',
    defaultMessage: 'Nafn',
  },
  SingleProviderTechnicalContactNamePlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-name-placeholder',
    defaultMessage: 'Nafn',
  },
  SingleProviderTechnicalContactNameError: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-name-error',
    defaultMessage: 'Nafn er skilyrt',
  },
  SingleProviderTechnicalContactEmailLabel: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderTechnicalContactEmailPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderTechnicalContactEmailError: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderTechnicalContactEmailErrorFormat: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-email-error-format',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderTechnicalContactPhoneNumberLabel: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-phoneNumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderTechnicalContactPhoneNumberPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-phoneNumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderTechnicalContactPhonenumberError: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderTechnicalContactPhonenumberErrorOnlyNumbers: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderTechnicalContactPhonenumberErrorLength: {
    id: 'portals-admin.document-provider:document-providers-single-technical-contact-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },

  //DocumentProvidersSingleUserHelpContact
  SingleProviderUserHelpContactHeading: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-heading',
    defaultMessage: 'Notendaaðstoð',
  },
  SingleProviderUserHelpContactEmailLabel: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-email-label',
    defaultMessage: 'Netfang',
  },
  SingleProviderUserHelpEmailError: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-email-error',
    defaultMessage: 'Netfang er skilyrt',
  },
  SingleProviderUserHelpEmailErrorFormat: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-email-error-format',
    defaultMessage: 'Netfang verður að vera á réttu sniði',
  },
  SingleProviderUserHelpContactEmailPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-email-placeholder',
    defaultMessage: 'Netfang',
  },
  SingleProviderUserHelpContactPhoneNumberLabel: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-phoneNumber-label',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderUserHelpContactPhoneNumberPlaceholder: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-phoneNumber-placeholder',
    defaultMessage: 'Símanúmer',
  },
  SingleProviderUserHelpPhonenumberError: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-phonenumber-error',
    defaultMessage: 'Símanúmer er skilyrt',
  },
  SingleProviderUserHelpPhonenumberErrorOnlyNumbers: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-phonenumber-error-only-numbers',
    defaultMessage: 'Eingöngu tölustafir eru leyfðir',
  },
  SingleProviderUserHelpPhonenumberErrorLength: {
    id: 'portals-admin.document-provider:document-providers-single-user-help-contact-phonenumber-error-length',
    defaultMessage: 'Símanúmer þarf að vera 7 tölustafir á lengd',
  },

  //DocumentProvidersSingleButtons
  SingleProviderBackButton: {
    id: 'portals-admin.document-provider:document-providers-single-back-button',
    defaultMessage: 'Til baka',
  },
  SingleProviderSaveButton: {
    id: 'portals-admin.document-provider:document-providers-single-save-button',
    defaultMessage: 'Vista breytingar',
  },

  //MyCategories
  myCategoriesTitle: {
    id: 'portals-admin.document-provider:my-categories-title',
    defaultMessage: 'Mínir flokkar',
  },
  myCategoriesDescription: {
    id: 'portals-admin.document-provider:my-categories-description',
    defaultMessage:
      'Einungis fyrir skjalaveitendur. Á þessari síðu getur þú bætt/breytt/eytt flokkum... TODO LAST',
  },

  //Settings
  SettingsTitle: {
    id: 'portals-admin.document-provider:document-provider-settings-title',
    defaultMessage: 'Stillingar',
  },
  //Stofnun
  EditInstitution: {
    id: 'portals-admin.document-provider:edit-institution',
    defaultMessage: 'Breyta stofnun',
  },
  EditInstitutionDescription: {
    id: 'portals-admin.document-provider:edit-institution-description',
    defaultMessage: 'Hér getur þú breytt grunnupplýsingum fyrir stofnun',
  },

  //Ábyrgðarmaður
  EditResponsibleContact: {
    id: 'portals-admin.document-provider:edit-responsible-contact',
    defaultMessage: 'Breyta ábyrgðarmanni',
  },
  EditResponsibleContactDescription: {
    id: 'portals-admin.document-provider:edit-responsible-contact-description',
    defaultMessage: 'Hér getur þú breytt upplýsingum um ábyrgðarmann',
  },

  //Tæknilegur tengiliður
  EditTechnicalContact: {
    id: 'portals-admin.document-provider:edit-technical-contact',
    defaultMessage: 'Breyta tæknilegum tengilið',
  },
  EditTechnicalContactDescription: {
    id: 'portals-admin.document-provider:edit-technical-contact-description',
    defaultMessage: 'Hér getur þú breytt upplýsingum um tæknilegan tengilið',
  },

  //Notendaaðstoð
  EditUserHelpContact: {
    id: 'portals-admin.document-provider:edit-user-help-contact',
    defaultMessage: 'Breyta notendaaðstoð',
  },
  EditUserHelpContactDescription: {
    id: 'portals-admin.document-provider:edit-user-help-contact:description',
    defaultMessage: 'Hér getur þú breytt upplýsingum um notendaaðstoð',
  },

  //Endapunktur
  EditEndPoints: {
    id: 'portals-admin.document-provider:edit-endpoints',
    defaultMessage: 'Breyta endapunkt',
  },
  EditEndPointsDescription: {
    id: 'portals-admin.document-provider:edit-endpoints:description',
    defaultMessage: 'Hér getur þú breytt endpunkt',
  },

  //EditInstitution
  SettingsEditInstitutionTitle: {
    id: 'portals-admin.document-provider:settings-edit-institution-title',
    defaultMessage: 'Breyta stofnun',
  },
  SettingsEditInstitutionDescription: {
    id: 'portals-admin.document-provider:settings-edit-institution-description',
    defaultMessage: 'Hér kemur form fyrir stofnun TODO',
  },
  SettingsEditInstitutionName: {
    id: 'portals-admin.document-provider:settings-edit-institution-name',
    defaultMessage: 'Nafn á stofnun',
  },
  SettingsEditInstitutionNameRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-institution-name-required-message',
    defaultMessage: 'Skylda er að fylla út nafn stofnunar',
  },
  SettingsEditInstitutionNationalId: {
    id: 'portals-admin.document-provider:settings-edit-institution-nationalId',
    defaultMessage: 'Kennitala',
  },
  SettingsEditInstitutionNationalIdRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-institution-nationalId-required-message',
    defaultMessage: 'Skylda er að fylla út kennitölu',
  },
  SettingsEditInstitutionNationalIdWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-institution-nationalId-wrong-format-message',
    defaultMessage: 'Kennitalan er ekki á réttu formi',
  },
  SettingsEditInstitutionAddress: {
    id: 'portals-admin.document-provider:settings-edit-institution-address',
    defaultMessage: 'Heimilisfang',
  },
  SettingsEditInstitutionAddressRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-institution-address-required-message',
    defaultMessage: 'Skylda er að fylla út heimilisfang',
  },
  SettingsEditInstitutionEmail: {
    id: 'portals-admin.document-provider:settings-edit-institution-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditInstitutionEmailRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-institution-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },
  SettingsEditInstitutionEmailWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-institution-email-wrong-format-message',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  },
  SettingsEditInstitutionTel: {
    id: 'portals-admin.document-provider:settings-edit-institution-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditInstitutionTelRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-institution-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditInstitutionTelWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-institution-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er ekki á réttu formi',
  },
  SettingsEditInstitutionSaveButton: {
    id: 'portals-admin.document-provider:settings-edit-institution-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditInstitutionBackButton: {
    id: 'portals-admin.document-provider:settings-edit-institution-back-button',
    defaultMessage: 'Til baka',
  },

  //EditResponsibleContact
  SettingsEditResponsibleContactTitle: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-title',
    defaultMessage: 'Breyta ábyrgðarmanni',
  },
  SettingsEditResponsibleContactDescription: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-description',
    defaultMessage: 'Hér kemur form fyrir ábyrgðarmann TODO',
  },
  SettingsEditResponsibleContactName: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-name',
    defaultMessage: 'Nafn',
  },
  SettingsEditResponsibleContactNameRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-name-required-message',
    defaultMessage: 'Skylda er að fylla út nafn',
  },
  SettingsEditResponsibleContactEmail: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditResponsibleContactEmailRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },
  SettingsEditResponsibleContactEmailWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-email-wrong-format-message',
    defaultMessage: 'Netfangið er á vitlausu formi',
  },
  SettingsEditResponsibleContactTel: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditResponsibleContactTelRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditResponsibleContactTelWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er á vitlausu formi',
  },
  SettingsEditResponsibleContactSaveButton: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditResponsibleContactBackButton: {
    id: 'portals-admin.document-provider:settings-edit-responsible-contact-back-button',
    defaultMessage: 'Til baka',
  },

  //EditTechnicalContact
  SettingsEditTechnicalContactTitle: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-title',
    defaultMessage: 'Breyta tæknilegum tengilið',
  },
  SettingsEditTechnicalContactDescription: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-description',
    defaultMessage: 'Hér kemur form fyrir tæknilegan tengilið TODO',
  },
  SettingsEditTechnicalContactName: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-name',
    defaultMessage: 'Nafn',
  },
  SettingsEditTechnicalContactNameRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-name-required-message',
    defaultMessage: 'Skylda er að fylla út nafn',
  },
  SettingsEditTechnicalContactEmail: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditTechnicalContactEmailRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },

  SettingsEditTechnicalContactEmailWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-email-wrong-format-message',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  },
  SettingsEditTechnicalContactTel: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditTechnicalContactTelRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditTechnicalContactTelWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er ekki á réttu formi',
  },
  SettingsEditTechnicalContactSaveButton: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditTechnicalContactBackButton: {
    id: 'portals-admin.document-provider:settings-edit-technical-contact-back-button',
    defaultMessage: 'Til baka',
  },

  //EditUserHelpContact
  SettingsEditUserHelpContactTitle: {
    id: 'portals-admin.document-provider:settings-edit-user-help-contact-title',
    defaultMessage: 'Breyta notendaaðstoð',
  },
  SettingsEditUserHelpContactDescription: {
    id: 'portals-admin.document-provider:settings-edit-user-help-contact-description',
    defaultMessage: 'Hér kemur form fyrir notendaaðstoð TODO',
  },

  SettingsEditUserHelpContactEmail: {
    id: 'portals-admin.document-provider:settings-edit-user-help-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditUserHelpContactEmailRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-user-help-contact-email-required-message',
    defaultMessage: 'Skylda er að fylla út netfang',
  },
  SettingsEditUserHelpContactEmailWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-user-help-contact-email-wrong-format-message',
    defaultMessage: 'Netfangið er ekki á réttu formi',
  },
  SettingsEditUserHelpContactTel: {
    id: 'portals-admin.document-provider:settings-edit-user-help-contact-tel',
    defaultMessage: 'Símanúmer',
  },
  SettingsEditUserHelpContactTelRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-user-help-contact-tel-required-message',
    defaultMessage: 'Skylda er að fylla út símanúmer',
  },
  SettingsEditUserHelpContactTelWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-user-help-contact-tel-wrong-format-message',
    defaultMessage: 'Símanúmerið er ekki á réttu formi',
  },
  SettingsEditHelpContactSaveButton: {
    id: 'portals-admin.document-provider:settings-edit-help-contact-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditHelpContactBackButton: {
    id: 'portals-admin.document-provider:settings-edit-help-contact-back-button',
    defaultMessage: 'Til baka',
  },

  //EditEndPoints
  SettingsEditEndPointsTitle: {
    id: 'portals-admin.document-provider:settings-edit-endpoints-title',
    defaultMessage: 'Breyta endapunkt',
  },
  SettingsEditEndPointsDescription: {
    id: 'portals-admin.document-provider:settings-edit-endpoints-description',
    defaultMessage: 'Hér kemur form fyrir endapunkta TODO',
  },
  SettingsEditEndPointsUrl: {
    id: 'portals-admin.document-provider:settings-edit-endpoints-url',
    defaultMessage: 'Endapunktur',
  },
  SettingsEditEndPointsUrlRequiredMessage: {
    id: 'portals-admin.document-provider:settings-edit-endpoints-url-required-message',
    defaultMessage: 'Skylda er að fylla út endapunkt',
  },
  SettingsEditEndPointsUrlWrongFormatMessage: {
    id: 'portals-admin.document-provider:settings-edit-endpoints-url-wrong-format-message',
    defaultMessage: 'Endapunkturinn er ekki á réttu formi',
  },
  SettingsEditEndPointsSaveButton: {
    id: 'portals-admin.document-provider:settings-edit-endpoints-save-button',
    defaultMessage: 'Vista breytingar',
  },
  SettingsEditEndPointsBackButton: {
    id: 'portals-admin.document-provider:settings-edit-endpoints-back-button',
    defaultMessage: 'Til baka',
  },

  //TechnicalInformation
  TechnicalInformationTitle: {
    id: 'portals-admin.document-provider:technical-information-title',
    defaultMessage: 'Tæknilegar upplýsingar',
  },
  TechnicalInformationDescription: {
    id: 'portals-admin.document-provider:technical-information-description',
    defaultMessage: 'Á þessari síðu sérð þú upplýsingar um tæknileg atriði',
  },

  //Statistics
  StatisticsTitle: {
    id: 'portals-admin.document-provider:statistics-information-title',
    defaultMessage: 'Tölfræði',
  },
  StatisticsDescription: {
    id: 'portals-admin.document-provider:statistics-information-description',
    defaultMessage: 'Hér er tölfræði yfir rafrænar skjalasendingar ',
  },
  StatisticsSearchPlaceholder: {
    id: 'portals-admin.document-provider:statistics-search-placeholder',
    defaultMessage: 'Leitaðu eftir skjalaveitanda',
  },
  statisticsDescription6months: {
    id: 'portals-admin.document-provider:statistics-description-6-months',
    defaultMessage: 'Hér er tölfræði síðustu 6 mánuða',
  },

  //Statistics boxes
  statisticsBoxOrganisationsCount: {
    id: 'portals-admin.document-provider:statistics-box-organisations-count',
    defaultMessage: 'Fjöldi skjalaveitna',
  },
  statisticsBoxPublishedDocuments: {
    id: 'portals-admin.document-provider:statistics-box-published-documents',
    defaultMessage: 'Send skjöl',
  },
  statisticsBoxOpenedDocuments: {
    id: 'portals-admin.document-provider:statistics-box-opened-documents',
    defaultMessage: 'Opnuð skjöl',
  },
  statisticsBoxUnopenedDocuments: {
    id: 'portals-admin.document-provider:statistics-box-unopened-documents',
    defaultMessage: 'Óopnuð skjöl',
  },
  openedDocuments: {
    id: 'portals-admin.document-provider:opened-documents',
    defaultMessage: 'Opnuð skjöl',
  },
  documentProvidersList: {
    id: 'portals-admin.document-provider:document-providers-list',
    defaultMessage: 'Skjalaveitendur',
  },
  links: {
    id: 'portals-admin.document-provider:links',
    defaultMessage: 'Links',
  },
  statisticsBoxNotifications: {
    id: 'portals-admin.document-provider:statistics-box-notifications',
    defaultMessage: 'Hnipp',
  },
  statisticsBoxMillions: {
    id: 'portals-admin.document-provider:statistics-box-millions',
    defaultMessage: 'milljón',
  },
  statisticsBoxThousands: {
    id: 'portals-admin.document-provider:statistics-box-thousands',
    defaultMessage: 'þúsund',
  },
  statisticsBoxNetworkError: {
    id: 'portals-admin.document-provider:statistics-box-network-error',
    defaultMessage: 'Ekki tókst að sækja tölfræði',
  },
  statisticsBoxFailures: {
    id: 'portals-admin.document-provider:failures',
    defaultMessage: 'Mistök við afhendingu',
  },

  // Paper
  paperTitle: {
    id: 'portals-admin.document-provider:paper-title',
    defaultMessage: 'Pappírslistinn',
  },
  paperDescription: {
    id: 'portals-admin.document-provider:paper-description',
    defaultMessage:
      'Listi yfir einstaklinga og fyrirtæki sem vilja fá send skjöl á pappír.',
  },
  paperOrigin: {
    id: 'portals-admin.document-provider:paper-origin',
    defaultMessage: 'Uppruni',
  },
  paperBooleanTitle: {
    id: 'portals-admin.document-provider:paper-boolean-title',
    defaultMessage: 'Pappír',
  },
  paperUpdated: {
    id: 'portals-admin.document-provider:paper-updated',
    defaultMessage: 'Uppfært',
  },
  active: {
    id: 'portals-admin.document-provider:paper-active',
    defaultMessage: 'Virkur',
  },
  inactive: {
    id: 'portals-admin.document-provider:paper-inactive',
    defaultMessage: 'Óvirkur',
  },
  yes: {
    id: 'portals-admin.document-provider:paper-yes',
    defaultMessage: 'Já',
  },
  no: {
    id: 'portals-admin.document-provider:paper-no',
    defaultMessage: 'Nei',
  },

  // Categories
  catAndTypeName: {
    id: 'portals-admin.document-provider:category-types-name',
    defaultMessage: 'Flokkar og Tegundir',
  },
  providersList: {
    id: 'portals-admin.document-provider:providers-list',
    defaultMessage: 'Skjalaveitendur',
  },
  catAndTypeTitle: {
    id: 'portals-admin.document-provider:category-types-title',
    defaultMessage: 'Flokkar og tegundir erinda',
  },
  catAndTypeDescription: {
    id: 'portals-admin.document-provider:category-types-description',
    defaultMessage: 'Flokkar og tegundir erinda í pósthólfi á Ísland.is',
  },
  change: {
    id: 'portals-admin.document-provider:change',
    defaultMessage: 'Breyta',
  },

  categories: {
    id: 'portals-admin.document-provider:categories',
    defaultMessage: 'Flokkar',
  },
  categoryP: {
    id: 'portals-admin.document-provider:category-participle',
    defaultMessage: 'flokki',
  },
  types: {
    id: 'portals-admin.document-provider:types',
    defaultMessage: 'Tegundir',
  },
  typeP: {
    id: 'portals-admin.document-provider:type-participle',
    defaultMessage: 'tegund',
  },
  add: {
    id: 'portals-admin.document-provider:add-new',
    defaultMessage: 'Bæta við {add}',
  },

  close: {
    id: 'portals-admin.document-provider:close',
    defaultMessage: 'Loka',
  },
  cancel: {
    id: 'portals-admin.document-provider:cancel',
    defaultMessage: 'Hætta við',
  },
  save: {
    id: 'portals-admin.document-provider:save',
    defaultMessage: 'Vista',
  },
  modalTitleType: {
    id: 'portals-admin.document-provider:modal-title-type',
    defaultMessage: 'Bæta við nýrri tegund',
  },
  modalTitleCategory: {
    id: 'portals-admin.document-provider:modal-title-category',
    defaultMessage: 'Bæta við nýjum flokki',
  },
  modalTitleTypeChange: {
    id: 'portals-admin.document-provider:modal-title-type-change',
    defaultMessage: 'Breyta tegund',
  },
  modalTitleCategoryChange: {
    id: 'portals-admin.document-provider:modal-title-category-change',
    defaultMessage: 'Breyta flokki',
  },
  name: {
    id: 'portals-admin.document-provider:name',
    defaultMessage: 'Nafn',
  },

  saved: {
    id: 'portals-admin.document-provider:save-success',
    defaultMessage: 'Vistað',
  },

  error: {
    id: 'portals-admin.document-provider:save-error',
    defaultMessage: 'Villa',
  },
})
