export enum SignatureCollectionPaths {
  // Presidential
  PresidentialLists = '/medmaelasofnun',
  PresidentialList = '/medmaelasofnun/:listId',

  // Parliamentary
  ParliamentaryRoot = '/althingiskosningar',
  ParliamentaryConstituency = '/althingiskosningar/:constituencyName',
  ParliamentaryConstituencyList = '/althingiskosningar/:constituencyName/:listId',

  // Parliamentary Constituencies for sidebar navigation
  ParliamentaryNordvesturkjordaemi = '/althingiskosningar/Nordvesturkjordaemi',
  ParliamentaryNordausturkjordaemi = '/althingiskosningar/Nordausturkjordaemi',
  ParliamentarySudurkjordaemi = '/althingiskosningar/Sudurkjordaemi',
  ParliamentarySudvesturkjordaemi = '/althingiskosningar/Sudvesturkjordaemi',
  ParliamentaryReykjavikurkjordaemiSudur = '/althingiskosningar/Reykjavikurkjordaemi-sudur',
  ParliamentaryReykjavikurkjordaemiNordur = '/althingiskosningar/Reykjavikurkjordaemi-nordur',
}
