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
  MunicipalArea1 = '/sveitastjornarkosningar/areaName1',
  MunicipalArea2 = '/sveitastjornarkosningar/areaName2',
  MunicipalAreaList = '/sveitastjornarkosningar/areaName1/:listId',
  MunicipalAreaList2 = '/sveitastjornarkosningar/areaName2/:listId',
}
