export enum LawAndOrderPaths {
  Root = '/log-og-reglur',
  OverviewRedirect = '/log-og-reglur/yfirlit',
  CourtCases = '/log-og-reglur/domsmal',
  CourtCaseDetail = '/log-og-reglur/domsmal/:id',
  SubpoenaDetail = '/log-og-reglur/domsmal/:id/fyrirkall',
  SubpoenaPopUp = '/log-og-reglur/domsmal/:id/fyrirkall/pop-up',
  PoliceCases = '/log-og-reglur/logreglumal',
  PoliceCasesDetail = '/log-og-reglur/logreglumal/:id',
  VerdictDetail = '/log-og-reglur/domsmal/:id/nidurstada',
  DriversPoints = '/log-og-reglur/okustig',
  DriversDeprivations = '/log-og-reglur/svipting-okuretts',
}
