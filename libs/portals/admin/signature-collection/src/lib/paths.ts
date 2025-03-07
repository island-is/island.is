export enum SignatureCollectionPaths {
  // Presidential
  PresidentialLists = '/medmaelasofnun',
  PresidentialList = '/medmaelasofnun/:listId',

  // Parliamentary
  ParliamentaryRoot = '/althingiskosningar',
  ParliamentaryConstituency = '/althingiskosningar/:constituencyName',
  ParliamentaryConstituencyList = '/althingiskosningar/:constituencyName/:listId',

  // Municipal
  LandAreaHofudborgarsvaedi = '/sveitastjornarkosningar/hofudborgarsvaedi', //root
  LandAreaSudurnes = '/sveitastjornarkosningar/sudurnes',
  LandAreaVesturland = '/sveitastjornarkosningar/vesturland',
  LandAreaVestfirdir = '/sveitastjornarkosningar/vestfirdir',
  LandAreaNordurlandVestra = '/sveitastjornarkosningar/nordurlandVestra',
  LandAreaNordurlandEystra = '/sveitastjornarkosningar/nordurlandEystra',
  LandAreaAusturland = '/sveitastjornarkosningar/austurland',
  LandAreaSudurland = '/sveitastjornarkosningar/sudurland',

  MunicipalRoot = '/sveitastjornarkosningar/:landAreaName',
  LandAreaSingleMunicipality = '/sveitastjornarkosningar/:landAreaName/:municipalityName',
  MunicipalList = '/sveitastjornarkosningar/:landAreaName/:municipalityName/:listId',
}
