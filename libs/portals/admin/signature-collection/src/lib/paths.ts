export enum SignatureCollectionPaths {
  // Presidential
  PresidentialLists = '/medmaelasofnun',
  PresidentialList = '/medmaelasofnun/:listId',

  // Parliamentary
  ParliamentaryRoot = '/althingiskosningar',
  ParliamentaryConstituency = '/althingiskosningar/:constituencyName',
  ParliamentaryConstituencyList = '/althingiskosningar/:constituencyName/:listId',

  // Municipal
  MunicipalRoot = '/sveitastjornarkosningar',
  LandAreaSingleMunicipality = '/sveitastjornarkosningar/:municipality',
  MunicipalList = '/sveitastjornarkosningar/:municipality/:listId',
}
