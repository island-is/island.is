export enum SignatureCollectionPaths {
  // Presidential
  PresidentialListOfCandidates = '/medmaelasofnun',
  PresidentialCandidateLists = '/medmaelasofnun/:candidateId',
  PresidentialList = '/medmaelasofnun/:candidateId/:listId',

  // Parliamentary
  ParliamentaryRoot = '/althingiskosningar',
  ParliamentaryConstituency = '/althingiskosningar/:constituencyName',
  ParliamentaryConstituencyList = '/althingiskosningar/:constituencyName/:listId',

  // Municipal
  MunicipalRoot = '/sveitastjornarkosningar',
  SingleMunicipality = '/sveitastjornarkosningar/:municipality',
  MunicipalList = '/sveitastjornarkosningar/:municipality/:listId',
}
