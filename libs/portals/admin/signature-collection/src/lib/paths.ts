export enum SignatureCollectionPaths {
  // Presidential
  PresidentialLists = '/medmaelasofnun',
  PresidentialList = '/medmaelasofnun/:listId',

  // Parliamentary
  ParliamentaryRoot = '/althingiskosningar',
  ParliamentaryConstituency = '/althingiskosningar/:constituencyName',
  ParliamentaryConstituencyList = '/althingiskosningar/:constituencyName/:listId',
}
