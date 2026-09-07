import { Verdict } from '../../repository'

export const getActiveVerdict = <
  T extends Pick<Verdict, 'created'> & { isActive?: boolean },
>(
  verdicts: T[] | undefined,
): T | undefined => {
  if (!verdicts || verdicts.length === 0) {
    return undefined
  }

  const activeVerdict = verdicts.find((verdict) => verdict.isActive)
  if (activeVerdict) {
    return activeVerdict
  }

  return [...verdicts].sort(
    (a, b) => b.created.getTime() - a.created.getTime(),
  )[0]
}
