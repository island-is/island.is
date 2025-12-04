import { getIndictmentAppealDeadline } from './dates'

export type VerdictInfo = {
  canAppealVerdict: boolean //indicating whether the defendant can appeal the verdict
  serviceDate?: Date //indicating when the defendant viewed the verdict. Undefined if the defendant has not viewed the verdict
}

type VerdictAppealDeadlineStatus = {
  isVerdictViewedByAllRequiredDefendants: boolean //all defendants who need to see the verdict have seen it
  hasVerdictAppealDeadlineExpiredForAll: boolean //all defendant appeal deadlines have expired
}

export const getIndictmentVerdictAppealDeadlineStatus = (
  verdictInfo?: VerdictInfo[],
  isFine?: boolean,
): VerdictAppealDeadlineStatus => {
  if (
    !verdictInfo ||
    verdictInfo.length === 0 ||
    verdictInfo.every(({ canAppealVerdict }) => !canAppealVerdict)
  ) {
    return {
      isVerdictViewedByAllRequiredDefendants: true,
      hasVerdictAppealDeadlineExpiredForAll: true,
    }
  }

  if (
    verdictInfo.some(
      ({ canAppealVerdict, serviceDate }) => canAppealVerdict && !serviceDate,
    )
  ) {
    return {
      isVerdictViewedByAllRequiredDefendants: false,
      hasVerdictAppealDeadlineExpiredForAll: false,
    }
  }

  const newestViewDate = verdictInfo.reduce(
    (newest, { serviceDate: currentServiceDate }) =>
      currentServiceDate && currentServiceDate > newest
        ? currentServiceDate
        : newest,
    new Date(0),
  )
  const { isDeadlineExpired } = getIndictmentAppealDeadline({
    baseDate: newestViewDate,
    isFine,
  })

  return {
    isVerdictViewedByAllRequiredDefendants: true,
    hasVerdictAppealDeadlineExpiredForAll: isDeadlineExpired,
  }
}
