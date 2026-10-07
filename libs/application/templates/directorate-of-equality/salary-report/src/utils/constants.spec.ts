import { SALARY_COMPONENT_GROUPS, SALARY_COMPONENT_KEYS } from './constants'

// The order of these keys is not cosmetic. SALARY_COMPONENT_GROUPS drives the
// order of the pay inputs in EmployeeForm and of the detail rows in EmployeeRow,
// and it mirrors columns J-O of the Jafnréttisstofa 2.0 workbook the applicant
// filled in offline. Reordering them silently re-labels what the applicant reads,
// and filing fixed pay as incidental (or vice versa) changes reglulegt tímakaup
// without anything downstream flagging it — the exact failure DMR rejects 1.x
// workbooks to avoid.
describe('SALARY_COMPONENT_KEYS', () => {
  it('matches workbook columns J-O in order', () => {
    expect(SALARY_COMPONENT_KEYS).toEqual([
      'additionalFixedOvertime', // J
      'additionalFixedCarAllowance', // K
      'additionalFixedOther', // L
      'bonusOccasionalOvertime', // M
      'bonusOccasionalCarAllowance', // N
      'bonusOther', // O
    ])
  })

  // Row 4 of the workbook bands these as Fastar greiðslur (I-L) and Tilfallandi
  // greiðslur (M-O). Three each, and the split decides which side of the
  // fixed/incidental line a payment lands on — i.e. whether it counts toward
  // regluleg laun at all.
  it('splits three fixed against three incidental', () => {
    expect(SALARY_COMPONENT_GROUPS.map((group) => group.group)).toEqual([
      'additional',
      'bonus',
    ])
    expect(SALARY_COMPONENT_GROUPS[0].keys).toEqual([
      'additionalFixedOvertime',
      'additionalFixedCarAllowance',
      'additionalFixedOther',
    ])
    expect(SALARY_COMPONENT_GROUPS[1].keys).toEqual([
      'bonusOccasionalOvertime',
      'bonusOccasionalCarAllowance',
      'bonusOther',
    ])
  })
})
