export enum AdminPortalCorePaths {
  // Icelandic Names Registry
  IcelandicNamesRegistryRoot = '/mannanafnaskra',

  // DocumantProvider
  DocumentProviderRoot = '/skjalaveitur', // Breytt path
  DocumentProviderDocumentProvidersSingle = '/skjalaveitur/:nationalId',
  // DocumentProviderDocumentProviders = '/skjalaveita/skjalaveitendur',
  // DocumentProviderMyCategories = '/skjalaveita/minir-flokkar',
  // DocumentProviderSettingsRoot = '/skjalaveita/skjalaveita-stillingar',
  // DocumentProviderSettingsEditInstituion = '/skjalaveita/skjalaveita-stillingar/breyta-stofnun',
  // DocumentProviderSettingsEditResponsibleContact = '/skjalaveita/skjalaveita-stillingar/breyta-abyrgdarmanni',
  // DocumentProviderSettingsEditTechnicalContact = '/skjalaveita/skjalaveita-stillingar/breyta-taeknilegum-tengilid',
  // DocumentProviderSettingsEditUserHelpContact = '/skjalaveita/skjalaveita-stillingar/breyta-notendaadstod',
  // DocumentProviderSettingsEditEndpoints = '/skjalaveita/skjalaveita-stillingar/breyta-endapunkt',
  // DocumentProviderTechnicalInfo = '/skjalaveita/taeknilegar-upplysingar',
  // DocumentProviderStatistics = '/skjalaveita/tolfraedi',

  // Temporary change to the value of DocumentProviderRoot; skjalaveita -> skjalaveitur. In the first
  // release there will only be a limited number of features and this change creates a better UX in
  // that scenario.
}
