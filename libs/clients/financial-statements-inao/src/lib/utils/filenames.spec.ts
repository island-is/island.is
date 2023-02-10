import {
  getPersonalElectionFileName,
  getPoliticalPartyFileName,
  getCemeteryFileName,
} from './filenames'

describe('Financial Statements File names', () => {
  it('should return filename for personal election', () => {
    const res = getPersonalElectionFileName(
      '123456789',
      150000000,
      '2022-10-14T12:30:02.986Z',
      false,
    )

    expect(res).toBe('1-123456789-1-2022-10.pdf')
  })

  it('should return filename for personal election for no value statements', () => {
    const res = getPersonalElectionFileName(
      '123456789',
      150000000,
      '2022-10-14T12:30:02.986Z',
      true,
    )

    expect(res).toBe('1-123456789-1-2022-10-Y.pdf')
  })

  it('should return filename for political party', () => {
    const res = getPoliticalPartyFileName('123456789', '2022')

    expect(res).toBe('2-123456789-2022.pdf')
  })

  it('should return filename for cemetery', () => {
    const res = getCemeteryFileName('123456789', '2022')

    expect(res).toBe('3-123456789-2022.pdf')
  })
})
