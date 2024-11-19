import {
  CaseAppealDecision,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'

export const cases = [
  {
    id: 'test_id_1',
    created: '2020-09-16T19:50:08.033Z',
    state: CaseState.DRAFT,
    policeCaseNumbers: ['string'],
    defendants: [{ id: '', nationalId: 'string', name: 'Jon Harring Sr.' }],
    validToDate: null,
    parentCaseId: '1337',
  },
  {
    id: 'test_id_2',
    created: '2020-12-16T19:50:08.033Z',
    state: CaseState.DRAFT,
    policeCaseNumbers: ['string'],
    defendants: [{ id: '', nationalId: 'string', name: 'Jon Harring' }],
    validToDate: null,
  },
  {
    id: 'test_id_3',
    created: '2020-05-16T19:50:08.033Z',
    state: CaseState.ACCEPTED,
    policeCaseNumbers: ['008-2020-X'],
    defendants: [
      {
        id: '',
        nationalId: '012345-6789',
        name: 'Mikki Refur',
      },
    ],
    validToDate: '2020-11-11T12:31:00.000Z',
    accusedAppealDecision: CaseAppealDecision.APPEAL,
    rulingSignatureDate: '2020-09-16T19:51:39.466Z',
  },
  {
    id: 'test_id_4',
    created: '2020-08-16T19:50:08.033Z',
    state: CaseState.NEW,
    policeCaseNumbers: ['008-2020-X'],
    defendants: [
      {
        id: '',
        nationalId: '012345-6789',
        name: 'Erlingur L Kristinsson',
      },
    ],
    validToDate: '2020-11-11T12:31:00.000Z',
  },
  {
    id: 'test_id_6',
    created: '2021-01-16T19:50:08.033Z',
    state: CaseState.RECEIVED,
    policeCaseNumbers: ['008-2020-X'],
    defendants: [{ id: '', nationalId: '012345-6789', name: 'D. M. Kil' }],
    validToDate: '2020-11-11T12:31:00.000Z',
  },
  {
    id: 'test_id_7',
    created: '2021-02-16T19:50:08.033Z',
    state: CaseState.SUBMITTED,
    policeCaseNumbers: ['008-2020-X'],
    defendants: [{ id: '', nationalId: '012345-6789', name: 'Moe' }],
    validToDate: '2020-11-11T12:31:00.000Z',
  },
]
