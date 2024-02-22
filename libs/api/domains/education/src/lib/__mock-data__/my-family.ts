import {
  EinstaklingurDTOAllt,
  EinstaklingurDTOGrunn,
  EinstaklingurDTOLogForeldriItem,
} from '@island.is/clients/national-registry-v3'
import { Student } from '../education.type'

// Note: this family is generated from a real family, but the names and
// national IDs have been changed to protect the identity of said family.
// Extra note: it would be nice to have more family cases to test.

export const ADULT_STUDENT1: Student = {
  nationalId: 'a1',
  name: 'Arfón Heyrir Sogurðsson',
}
export const CHILD_STUDENT1: Student = {
  name: 'Glóa Arfónsdóttir',
  nationalId: 'c1',
}
export const CHILD_STUDENT2: Student = {
  name: 'Salbör Arfónsdóttir',
  nationalId: 'c2',
}

export const ADULT1: EinstaklingurDTOGrunn = {
  kennitala: ADULT_STUDENT1.nationalId,
  nafn: ADULT_STUDENT1.name,
}

export const PARENT1: EinstaklingurDTOLogForeldriItem = {
  logForeldriFaedingardagur: new Date('1981-10-09'),
  logForeldriNafn: 'Arfón Heyrir Sogurðsson',
  logForeldriKennitala: 'a1',
}

export const PARENT2: EinstaklingurDTOLogForeldriItem = {
  logForeldriFaedingardagur: new Date('1954-10-09'),
  logForeldriNafn: 'Helfa Hreiðursdóttir',
  logForeldriKennitala: 'a2',
}

export const CHILD1: EinstaklingurDTOLogForeldriItem = {
  barnKennitala: CHILD_STUDENT1.nationalId,
  barnNafn: CHILD_STUDENT1.name,
  logForeldriNafn: 'Arfón Heyrir Sogurðsson',
  logForeldriKennitala: 'a1',
  logForeldriFaedingardagur: new Date('1981-10-09'),
}

export const CHILD2: EinstaklingurDTOLogForeldriItem = {
  barnKennitala: CHILD_STUDENT2.nationalId,
  barnNafn: CHILD_STUDENT2.name,
  logForeldriNafn: 'Arfón Heyrir Sogurðsson',
  logForeldriKennitala: 'a1',
  logForeldriFaedingardagur: new Date('1981-10-09'),
}

export const MyChildrenMock: EinstaklingurDTOAllt = {
  ...ADULT1,
  logforeldrar: {
    born: [CHILD2, CHILD1],
  },
}

export const MyParentsMock: EinstaklingurDTOAllt = {
  nafn: CHILD1.barnNafn,
  kennitala: CHILD1.barnKennitala,
  logforeldrar: {
    logForeldrar: [PARENT1, PARENT2],
  },
}
