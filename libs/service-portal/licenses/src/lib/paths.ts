export enum LicensePaths {
  LicensesRoot = '/skirteini',

  // Pattern should be : /skirteini/provider/licensetype
  DrivingLicensesDetail = '/skirteini/rikislogreglustjori/okurettindi',
  ADRLicensesDetail = '/skirteini/umhverfisstofnun/adrrettindi',
  FirearmLicensesDetail = '/skirteini/rikislogreglustjori/skotvopnaleyfi',
  MachineLicensesDetail = '/skirteini/vinnueftirlitid/vinnuvelarettindi',
  DisabilityLicense = '/skirteini/tryggingastofnun/ororkuskirteini',
  PCardDetail = '/skirteini/syslumenn/pkort',
  EhicDetail = '/skirteini/sjukratryggingar/ehic',

  LicensesPassportDetail = '/skirteini/tjodskra/vegabref/:id',
  LicensesDetail = '/skirteini/:provider/:type/:id',
}
