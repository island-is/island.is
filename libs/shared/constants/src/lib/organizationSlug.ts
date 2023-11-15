/**
 * Organization slug is used in the enhanced fetch middleware to identify the API.
 * The slug matches the icelandic slug in the organization content type in Contentful.
 *
 * @note Be sure to keep sync between this type and the english slug in the organization content type in Contentful.
 */
export type OrganizationSlugType =
  | 'haskoli-islands'
  | 'vinnueftirlitid'
  | 'thjodskra'
  | 'stafraent-island'
  | 'samgongustofa'
  | 'husnaedis-og-mannvirkjastofnun'
  | 'fjarsysla-rikisins'
  | 'stjornarrad-islands'
  | 'rikislogreglustjori'
  | 'personuvernd'
  | 'tryggingastofnun'
  | 'sjukratryggingar'
  | 'thjodskra-islands'
  | 'fiskistofa'
  | 'domstolasyslan'
  | 'samband-islenskra-sveitafelaga'
  | 'skatturinn'
  | 'syslumenn'
  | 'domsmalaraduneytid'
  | 'utlendingastofnun'
