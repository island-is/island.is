import { DateType, getLatestDateType } from './dateLog'

describe('getLatestDateType', () => {
  it('should return the latest date of a given two dateTypes', () => {
    const dateTypes = [DateType.COURT_DATE, DateType.POSTPONED_COURT_DATE]

    const result = getLatestDateType(dateTypes, [
      {
        created: '2021-01-01T12:00:00Z',
        caseId: '1',
        dateType: DateType.COURT_DATE,
        date: '2021-01-01T12:00:00Z',
      },
      {
        created: '2021-01-01T12:00:00Z',
        caseId: '1',
        dateType: DateType.POSTPONED_COURT_DATE,
        date: '2022-01-01T12:00:00Z',
      },
    ])

    expect(result).toEqual({
      caseId: '1',
      created: '2021-01-01T12:00:00Z',
      date: '2022-01-01T12:00:00Z',
      dateType: 'POSTPONED_COURT_DATE',
    })
  })
})
