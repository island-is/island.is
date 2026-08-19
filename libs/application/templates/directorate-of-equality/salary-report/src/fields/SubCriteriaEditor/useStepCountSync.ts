import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import type { SubCriterionStep } from '../../utils/types'

// Keeps `${fieldName}.steps` in sync with the step-count input: growing adds
// fresh blank steps, shrinking trims from the end.
export const useStepCountSync = (fieldName: string) => {
  const { setValue, getValues } = useFormContext()
  const stepCountStr: string =
    useWatch({ name: `${fieldName}.stepCount` }) ?? '2'

  useEffect(() => {
    const count = Math.min(8, Math.max(2, Number(stepCountStr) || 2))
    const currentSteps: SubCriterionStep[] =
      getValues(`${fieldName}.steps`) ?? []
    if (count === currentSteps.length) return

    if (count > currentSteps.length) {
      const extra = Array.from({ length: count - currentSteps.length }, () => ({
        id: crypto.randomUUID(),
        description: '',
      }))
      setValue(`${fieldName}.steps`, [...currentSteps, ...extra])
    } else {
      setValue(`${fieldName}.steps`, currentSteps.slice(0, count))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepCountStr])
}
