export enum SignatureCollectionPaths {
  // Presidential
  PresidentialLists = '/medmaelasofnun',
  PresidentialList = '/medmaelasofnun/:listId',

  // Parliamentary
  ParliamentaryRoot = '/althingiskosningar',
  ParliamentaryConstituency = '/althingiskosningar/:constituencyName',
  ParliamentaryConstituencyList = '/althingiskosningar/:constituencyName/:listId',

  // Municipal
  MunicipalAreaHofudborgarsvaedi = '/sveitastjornarkosningar/hofudborgarsvaedi',
  MunicipalAreaSudurnes = '/sveitastjornarkosningar/sudurnes',
  MunicipalAreaVesturland = '/sveitastjornarkosningar/vesturland',
  MunicipalAreaVestfirdir = '/sveitastjornarkosningar/vestfirdir',
  MunicipalAreaNordurlandVestra = '/sveitastjornarkosningar/nordurlandVestra',
  MunicipalAreaNordurlandEystra = '/sveitastjornarkosningar/nordurlandEystra',
  MunicipalAreaAusturland = '/sveitastjornarkosningar/austurland',
  MunicipalAreaSudurland = '/sveitastjornarkosningar/sudurland',
}
