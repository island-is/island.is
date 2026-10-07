import { Verdict } from '../repository'

export const getLatestVerdict = <T extends Pick<Partial<Verdict>, 'created'>>(
  verdicts: T[] | undefined,
): T | undefined => {
  if (!verdicts || verdicts.length === 0) {
    return undefined
  }

  return verdicts.reduce((latest, verdict) => {
    const latestCreated = latest.created?.getTime() ?? 0
    const verdictCreated = verdict.created?.getTime() ?? 0

    return verdictCreated > latestCreated ? verdict : latest
  }, verdicts[0])
}
