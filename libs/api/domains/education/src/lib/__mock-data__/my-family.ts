import { ISLFjolskyldan } from '@island.is/clients/national-registry-v1'

// Note: this family is generated from a real family, but the names and
// national IDs have been changed to protect the identity of said family.
// Extra note: it would be nice to have more family cases to test.

export const ADULT1 = {
  attributes: {
    'diffgr:id': 'ISLFjolskyldan2',
    'msdata:rowOrder': '1',
    'diffgr:hasChanges': 'inserted',
  },
  Kennitala: 'a1',
  Nafn: 'Arfón Heyrir Sogurðsson',
  Fjolsknr: 'a2',
  Kyn: '1',
  Kynheiti: 'Karl',
  Faedingardagur: '9.10.1981 00:00:00',
  MakiBarn: '',
} as ISLFjolskyldan

export const CHILD2 = {
  attributes: {
    'diffgr:id': 'ISLFjolskyldan4',
    'msdata:rowOrder': '3',
    'diffgr:hasChanges': 'inserted',
  },
  Kennitala: 'c2',
  Nafn: 'Salbör Arfónsdóttir',
  Fjolsknr: 'a2',
  Kyn: '4',
  Kynheiti: 'Stúlka',
  Faedingardagur: '31.8.2016 00:00:00',
  MakiBarn: '',
} as ISLFjolskyldan

export const CHILD1 = {
  attributes: {
    'diffgr:id': 'ISLFjolskyldan3',
    'msdata:rowOrder': '2',
    'diffgr:hasChanges': 'inserted',
  },
  Kennitala: 'c1',
  Nafn: 'Glóa Arfónsdóttir',
  Fjolsknr: 'a2',
  Kyn: '4',
  Kynheiti: 'Stúlka',
  Faedingardagur: '24.7.2013 00:00:00',
  MakiBarn: '',
} as ISLFjolskyldan

export const ADULT2 = {
  attributes: {
    'diffgr:id': 'ISLFjolskyldan1',
    'msdata:rowOrder': '0',
    'diffgr:hasChanges': 'inserted',
  },
  Kennitala: 'a2',
  Nafn: 'Helfa Hreiðursdóttir',
  Fjolsknr: 'a2',
  Kyn: '2',
  Kynheiti: 'Kona',
  Faedingardagur: '18.9.1978 00:00:00',
  MakiBarn: '',
} as ISLFjolskyldan

export const MyFamilyMock = [ADULT1, CHILD2, CHILD1, ADULT2] as ISLFjolskyldan[]
