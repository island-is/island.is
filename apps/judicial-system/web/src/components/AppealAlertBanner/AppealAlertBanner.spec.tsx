import { CaseAppealDecision } from '@island.is/judicial-system/types'
import { CaseAppealState, UserRole } from '../../graphql/schema'
import { TempCase } from '../../types'
import { getAppealInfo } from './AppealAlertBanner'

describe('getAppealInfo', () => {
  test('should return that case can be appealed and the correct appeal deadline', () => {
    const workingCase = {
      courtEndTime: '2022-06-15T19:50:08.033Z',
      isAppealDeadlineExpired: false,
      prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
    } as TempCase

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual({
      canBeAppealed: true,
      appealDeadline: '18. júní 2022 kl. 19:50',
      hasBeenAppealed: false,
    })
  })

  test('should return that case has been appealed by the prosecutor, and return the correct appeal date', () => {
    const workingCase = {
      appealState: CaseAppealState.Appealed,
      prosecutorPostponedAppealDate: '2022-06-15T19:50:08.033Z',
    } as TempCase

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual({
      canBeAppealed: false,
      appealedByRole: UserRole.Prosecutor,
      appealedDate: '2022-06-15T19:50:08.033Z',
      hasBeenAppealed: true,
    })
  })

  test('should return that case has been appealed by the defender', () => {
    const workingCase = {
      appealState: CaseAppealState.Appealed,
      accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
    } as TempCase

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual({
      canBeAppealed: false,
      appealedByRole: UserRole.Defender,
      appealedDate: '2022-06-15T19:50:08.033Z',
      hasBeenAppealed: true,
    })
  })

  test('should return that case has not and cannot be appealed if appeal deadline has expired', () => {
    const workingCase = {
      courtEndTime: '2022-06-15T19:50:08.033Z',
      isAppealDeadlineExpired: true,
      prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
    } as TempCase

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual({
      appealDeadline: '18. júní 2022 kl. 19:50',
      canBeAppealed: false,
      hasBeenAppealed: false,
    })
  })

  test('should return that the case cannot be appealed if neither party has postponed the appeal', () => {
    const workingCase = {
      courtEndTime: '2022-06-15T19:50:08.033Z',
      isAppealDeadlineExpired: false,
      prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
      accusedAppealDecision: CaseAppealDecision.NOT_APPLICABLE,
    } as TempCase

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual({
      appealDeadline: '18. júní 2022 kl. 19:50',
      canBeAppealed: false,
      hasBeenAppealed: false,
    })
  })
})
