import { isDefined } from '@island.is/shared/utils'

export type TimelineItem = {
  date: Date
  message: string
}

export const orderTimelineData = (
  data: Array<{ date: string | undefined; message: string }>,
): Array<TimelineItem> => {
  return data
    .map((d) => {
      if (!d.date) {
        return null
      }
      return {
        date: new Date(d.date),
        message: d.message,
      }
    })
    .filter(isDefined)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}
