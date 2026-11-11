import { CitizenshipSchema } from './dataSchema'

const getIssuePaths = (answers: object) => {
  const result = CitizenshipSchema.partial().safeParse(answers)
  return result.success
    ? []
    : result.error.issues.map((issue) => issue.path.join('.'))
}

const attachment = [{ name: 'file.pdf', key: 'key' }]

const residence = (row: object) => ({
  countriesOfResidence: {
    hasLivedAbroad: 'yes',
    selectedAbroadCountries: [
      { countryId: '1', wasRemoved: 'false', dateFrom: '', dateTo: '' },
      row,
    ],
  },
})

const staysAbroad = (row: object) => ({
  staysAbroad: {
    hasStayedAbroad: 'yes',
    selectedAbroadCountries: [
      {
        countryId: '1',
        wasRemoved: 'false',
        dateFrom: '1990-01-01',
        dateTo: '2000-01-01',
        purpose: 'Nám',
      },
      row,
    ],
  },
})

const passport = (publishDate: string) => ({
  publishDate,
  expirationDate: '2030-01-01',
  passportNumber: '123',
  passportTypeId: '1',
  countryOfIssuerId: '1',
  attachment,
})

describe('CitizenshipSchema', () => {
  describe('dates before 1900', () => {
    it.each([
      [
        'country of residence',
        (date: string) =>
          residence({
            countryId: '2',
            wasRemoved: 'false',
            dateFrom: date,
            dateTo: '2000-01-01',
          }),
        'countriesOfResidence.selectedAbroadCountries.1.dateFrom',
      ],
      [
        'stay abroad',
        (date: string) =>
          staysAbroad({
            countryId: '2',
            wasRemoved: 'false',
            dateFrom: date,
            dateTo: '2000-01-01',
            purpose: 'Nám',
          }),
        'staysAbroad.selectedAbroadCountries.1.dateFrom',
      ],
      [
        'passport',
        (date: string) => ({ passport: passport(date) }),
        'passport.publishDate',
      ],
      [
        'child passport',
        (date: string) => ({
          childrenPassport: [{ nationalId: '1', ...passport(date) }],
        }),
        'childrenPassport.0.publishDate',
      ],
      [
        'marital status',
        (date: string) => ({
          maritalStatus: {
            nationalId: '1',
            name: 'Nafn',
            dateOfMaritalStatusStr: date,
          },
        }),
        'maritalStatus.dateOfMaritalStatusStr',
      ],
      [
        'other parent',
        (date: string) => ({
          selectedChildrenExtraData: [
            {
              nationalId: '1',
              otherParentName: 'Nafn',
              otherParentBirtDate: date,
            },
          ],
        }),
        'selectedChildrenExtraData.0.otherParentBirtDate',
      ],
    ])('rejects them for %s', (_, buildAnswers, path) => {
      expect(getIssuePaths(buildAnswers('0215-07-20'))).toEqual([path])
      expect(getIssuePaths(buildAnswers('1900-01-01'))).toEqual([])
    })
  })
})
