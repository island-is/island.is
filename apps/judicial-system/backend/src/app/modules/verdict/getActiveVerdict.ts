import { Verdict } from '../repository'

export const getActiveVerdict = <
  T extends Pick<Partial<Verdict>, 'created' | 'isActive'>,
>(
  verdicts: T[] | undefined,
): T | undefined => {
  if (!verdicts || verdicts.length === 0) {
    return undefined
  }

  const activeVerdict = verdicts.find((verdict) => verdict.isActive === true)
  if (activeVerdict) {
    return activeVerdict
  }

  // Active-only includes usually leave a single row without isActive in attributes.
  if (verdicts.length === 1) {
    return verdicts[0]
  }

  return undefined
}
