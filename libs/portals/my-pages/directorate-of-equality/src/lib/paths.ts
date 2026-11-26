export enum DirectorateOfEqualityPaths {
  Root = '/jafnretti',
  Status = '/jafnretti/min-stada',
  Plans = '/jafnretti/jafnrettisaaetlanir',
  PlanDetail = '/jafnretti/jafnrettisaaetlanir/:id',
  Reports = '/jafnretti/skyrslur',
  ReportDetail = '/jafnretti/skyrslur/:id',
  ServiceProviders = '/jafnretti/heimildir',
  ServiceProviderDetail = '/jafnretti/heimildir/:id',
  GrantServiceProvider = '/jafnretti/heimildir/ny',
  ApiKeys = '/jafnretti/adgangslyklar',
  ApiKeyDetail = '/jafnretti/adgangslyklar/:id',
  CreateApiKey = '/jafnretti/adgangslyklar/nyr',
}

export enum LegacyDirectorateOfEqualityPaths {
  Submissions = '/jafnretti/innsendingar',
  Plans = '/jafnretti/innsendingar/jafnrettisaaetlanir',
  PlanDetail = '/jafnretti/innsendingar/jafnrettisaaetlanir/:id',
  Reports = '/jafnretti/innsendingar/skyrslur',
  ReportDetail = '/jafnretti/innsendingar/skyrslur/:id',
}
