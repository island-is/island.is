//enum til að nota í controllerum svo urls séu consistent á milli kerfa
//Endilega breyta því sem þér finnst þurfa, en reynum að halda einhverri reglu.

export enum Urls {
  SuperAdminOverview = 'admin/applications/super/overview/:page/:count',
  SuperAdminApplicationTypes = 'admin/applications/super/application-types',
  SuperAdminInstitutions = 'admin/applications/super/institutions',
  SuperAdminStatistics = 'admin/applications/super/statistics',

  InstitutionApplicationTypes = 'admin/applications/institution/application-types/:nationalId/',
  InstitutionAdminOverview = 'admin/applications/institution/:page/:count',
  InstitutionAdminStatistics = 'admin/applications/institution/statistics',
}
