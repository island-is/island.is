export enum LicensePaths {
  LicensesRoot = '/skirteini',

  // Pattern should be : /skirteini/provider/licensetype
  DrivingLicensesDetail = '/skirteini/rikislogreglustjori/okurettindi',
  ADRLicensesDetail = '/skirteini/vinnueftirlitid/adrrettindi',
  FirearmLicensesDetail = '/skirteini/rikislogreglustjori/skotvopnaleyfi',
  MachineLicensesDetail = '/skirteini/vinnueftirlitid/vinnuvelarettindi',
  DisabilityLicense = '/skirteini/tryggingastofnun/ororkuskirteini',
  HuntingLicense = '/skirteini/natturuverndarstofnun/veidikort',
  PCardDetail = '/skirteini/syslumenn/pkort',
  EhicDetail = '/skirteini/sjukratryggingar/ehic',
  LicensesPassportDetail = '/skirteini/tjodskra/vegabref/:id',

  LicensesDetailOld = '/skirteini/:provider/:type/:id',
  LicensesDetail = '/skirteini/:type/:id',
}
