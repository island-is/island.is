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
  const arr: Array<{ name: string; minDate: Date }> = []

  Object.keys(draftImpactForms).map((draftImpacts) => {
    draftImpactForms[draftImpacts].map((impact) => {
      const temp = arr?.find((x) => x.name === impact.name)
      const impactDate = impact?.date?.value
      if (impactDate) {
        if (temp && impactDate.getTime() > temp.minDate?.getTime()) {
          temp['minDate'] = impactDate
        } else if (!temp) {
          arr?.push({ name: impact.name, minDate: impactDate })
        }
      }
    })
  })
  return arr
}

export const useGetMinDateByName = (
  draftImpactForms: GroupedDraftImpactForms,
  name: string,
) => {
  const arr = useGetMinDates(draftImpactForms)
  return arr.find((x) => x.name === name)?.minDate
}
