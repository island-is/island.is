import { useEffect, useState } from 'react'
import { GroupedDraftImpactForms } from '../state/types'

export const useIsBrowserSide = () => {
  const [isBrowser, setIsBrowser] = useState<true | undefined>(undefined)
  useEffect(() => {
    setIsBrowser(true)
  }, [])
  return isBrowser
}

export const useGetMinDates = (draftImpactForms: GroupedDraftImpactForms) => {
  const [impactMinDates, setImpactMinDates] = useState<
    Array<{ name: string; minDate: Date }>
  >([])

  const arr = impactMinDates

  Object.keys(draftImpactForms).map((draftImpacts) => {
    draftImpactForms[draftImpacts].map((impact) => {
      const temp = arr?.find((x) => x.name === impact.name)
      const impactDate = impact?.date?.value
      if (
        temp &&
        impactDate &&
        impactDate.getTime() > temp.minDate?.getTime()
      ) {
        temp['minDate'] = impactDate
      } else if (!temp) {
        impactDate && arr?.push({ name: impact.name, minDate: impactDate })
      }
    })
  })
  if (arr !== impactMinDates) {
    setImpactMinDates(arr)
  }

  return impactMinDates
}
