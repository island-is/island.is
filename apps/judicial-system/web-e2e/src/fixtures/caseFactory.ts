import {
  Case,
  CaseGender,
  CaseState,
  CaseType,
  Institution,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

export const makeCase = (): Case => {
  return {
    id: 'test_id',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:51:39.466Z',
    state: CaseState.DRAFT,
    type: CaseType.CUSTODY,
    policeCaseNumber: '007-2021-202000',
    accusedNationalId: '000000-0000',
    accusedName: 'Donald Duck',
    accusedGender: CaseGender.MALE,
  }
}

export const makeProsecutor = (): User => {
  return {
    id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    name: 'Áki Ákærandi',
    nationalId: '000000-0000',
    mobileNumber: '000-0000',
    email: 'prosecutor@law.is',
    role: UserRole.PROSECUTOR,
    active: true,
    title: 'aðstoðarsaksóknari',
    institution: {
      id: '',
      created: '',
      modified: '',
      type: InstitutionType.PROSECUTORS_OFFICE,
      name: 'Lögreglan á Höfuðborgarsvæðinu',
    },
  }
}

export const makeCourt = (): Institution => {
  return {
    id: 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf',
    created: '2020-09-16T19:50:08.033Z',
    modified: '2020-09-16T19:50:08.033Z',
    type: InstitutionType.COURT,
    name: 'Héraðsdómur Reykjavíkur',
  }
}
