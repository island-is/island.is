const DAYS_TO_MILLISECONDS = 24 * 60 * 60 * 1000
export const VERDICT_APPEAL_WINDOW_DAYS = 28
const MILLISECONDS_TO_EXPIRY = VERDICT_APPEAL_WINDOW_DAYS * DAYS_TO_MILLISECONDS

/*
  This function takes an array of verdict info tuples:
  - The first element of the tuple is a boolean indicating whether the defendant can appeal the verdict.
  - The second element of the tuple is a Date object indicating when the defendant viewed the verdict. Undefined if the defendant has not viewed the verdict.
  The function returns a tuple of two booleans:
  - The first boolean indicates whether all defendants who need to see the verdict have seen it.
  - The second boolean indicates whether all defenant appeal deadlines have expired.
*/
export const getIndictmentVerdictAppealDeadlineStatus = (
  verdictInfo?: [boolean, Date | undefined][],
): [boolean, boolean] => {
  if (
    !verdictInfo ||
    verdictInfo.length === 0 ||
    verdictInfo.every(([canBeAppealed]) => !canBeAppealed)
  ) {
    return [true, true]
  }

  if (
    verdictInfo.some(
      ([canBeAppealed, viewedDate]) => canBeAppealed && !viewedDate,
    )
  ) {
    return [false, false]
  }

  const newestViewDate = verdictInfo.reduce(
    (newest, [_, current]) => (current && current > newest ? current : newest),
    new Date(0),
  )

  return [true, Date.now() > newestViewDate.getTime() + MILLISECONDS_TO_EXPIRY]
}
