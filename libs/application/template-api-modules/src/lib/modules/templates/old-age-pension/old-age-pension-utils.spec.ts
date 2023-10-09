import {
  getMonthNumber,
  getTaxLevel,
  initChildrens,
} from './old-age-pension-utils'

describe('Old age pesion utils', () => {
  it('should return 3 for March', () => {
    expect(getMonthNumber('March')).toBe(3)
  })

  it('should return 1 for firstLevel', () => {
    expect(getTaxLevel('firstLevel')).toBe(1)
  })

  it('should return 3 children', () => {
    const childPensionSelectedCustodyKids = {
      '0': '2222222229',
      '1': '5555555559',
    }
    const childPension = [
      {
        name: 'Added Children 1',
        nationalIdOrBirthDate: '2023-09-27',
        childDoesNotHaveNationalId9: true,
      },
    ]

    const childrens = initChildrens(
      childPensionSelectedCustodyKids,
      childPension,
    )

    expect(childrens).toHaveLength(3)
  })
})
