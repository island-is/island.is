import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // navigation
  rootName: {
    id: 'sp.document-provider:title',
    defaultMessage: 'Skjalaveita',
  },
  documentProviders: {
    id: 'service.portal:document-provider-document-providers',
    defaultMessage: 'Skjalaveitendur',
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

  //DocumentProviders
  documentProvidersTitle: {
    id: 'sp.document-provider:document-providers-title',
    defaultMessage: 'Skjalaveitendur',
  },
  documentProvidersDescription: {
    id: 'sp.document-provider:document-providers-description',
    defaultMessage:
      'Einungis fyrir starfsmenn island.is. Á þessari síðu sérð þú yfirlit yfir alla skjalaveitendur',
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
    id: 'service.portal:email',
    defaultMessage: 'Netfang',
  },
  EditInstitutionTagTwo: {
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
    id: 'service.portal:email',
    defaultMessage: 'Netfang',
  },
  EditResponsibleContactTagTwo: {
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
    id: 'service.portal:email',
    defaultMessage: 'Netfang',
  },
  EditTechnicalContactTagTwo: {
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
    id: 'service.portal:email',
    defaultMessage: 'Netfang',
  },
  EditEndPointsTagTwo: {
    id: 'service.portal:tel',
    defaultMessage: 'Símanúmer',
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
    id: 'sp.document-provider:settings-edit-institution-Name',
    defaultMessage: 'Nafn á stofnun',
  },
  SettingsEditInstitutionNationalId: {
    id: 'sp.document-provider:settings-edit-institution-nationalId',
    defaultMessage: 'Kennitala',
  },
  SettingsEditInstitutionAddress: {
    id: 'sp.document-provider:settings-edit-institution-address',
    defaultMessage: 'Heimilisfang',
  },
  SettingsEditInstitutionEmail: {
    id: 'sp.document-provider:settings-edit-institution-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditInstitutionTel: {
    id: 'sp.document-provider:settings-edit-institution-tel',
    defaultMessage: 'Símanúmer',
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
  SettingsEditResponsibleContactEmail: {
    id: 'sp.document-provider:settings-edit-responsible-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditResponsibleContactTel: {
    id: 'sp.document-provider:settings-edit-responsible-contact-tel',
    defaultMessage: 'Símanúmer',
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
  SettingsEditTechnicalContactEmail: {
    id: 'sp.document-provider:settings-edit-technical-contact-email',
    defaultMessage: 'Netfang',
  },
  SettingsEditTechnicalContactTel: {
    id: 'sp.document-provider:settings-edit-technical-contact-tel',
    defaultMessage: 'Símanúmer',
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
  SettingsEditUserHelpContactName: {
    id: 'sp.document-provider:settings-edit-user-help-contact-name',
    defaultMessage: 'Nafn',
  },
  SettingsEditUserHelpContactEmail: {
    id: 'sp.document-provider:settings-edit-user-help-contact-email',
    defaultMessage: 'Netfang',
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

  //TechnicalInformation
  TechnicalInformationTitle: {
    id: 'sp.document-provider:technical-information-title',
    defaultMessage: 'Tæknilegar upplýsingar',
  },
  TechnicalInformationDescription: {
    id: 'sp.document-provider:technical-information-description',
    defaultMessage: 'Á þessari síðu sérð þú upplýsingar um tæknileg atriði',
  },
})
