export enum LawAndOrderPaths {
  Root = '/log-og-reglur',
  Overview = '/log-og-reglur/yfirlit',
  CourtCases = '/log-og-reglur/domsmal',
  CourtCaseDetail = '/log-og-reglur/domsmal/:id',
  SubpoenaDetail = '/log-og-reglur/domsmal/:id/fyrirkall',
  SubpoenaPopUp = '/log-og-reglur/domsmal/:id/fyrirkall/pop-up',
  VerdictDetail = '/log-og-reglur/domsmal/:id/nidurstada',
}
