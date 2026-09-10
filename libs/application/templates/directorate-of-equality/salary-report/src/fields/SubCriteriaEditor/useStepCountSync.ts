import { useCallback, useEffect, useRef } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import {
  MAX_SUB_CRITERION_STEPS,
  MIN_SUB_CRITERION_STEPS,
} from '../../utils/constants'
import type { SubCriterionStep } from '../../utils/types'

// The only step counts worth acting on: an in-range integer. Everything else —
// blank, mid-keystroke, out of range — leaves the step list exactly as it is.
export const parseStepCount = (raw: string): number | undefined => {
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  const count = Number(trimmed)
  if (!Number.isInteger(count)) return undefined
  if (count < MIN_SUB_CRITERION_STEPS || count > MAX_SUB_CRITERION_STEPS) {
    return undefined
  }
  return count
}

// A step's id is what a role's (or employee's) classification points at, and
// DMR deletes the assignment rows along with the step — removeStep destroys
// them eagerly, so nothing survives for a later read to repair. A REMOVE
// therefore loses that þrep's definition for good, and re-points every
// classification standing in it onto the nearest surviving þrep at or below it
// (for a reduction, the new top þrep). That makes this hook's job less "keep
// the array the right length" than "never drop a step id the applicant did not
// ask to lose".
//
// Two rules follow from that:
//
//  1. "Fjöldi þrepa" is a NumberFormat input that writes its raw string into the
//     form on every keystroke, so changing 5 to 4 goes through ''. Resizing on
//     an unparseable or out-of-range value is what used to collapse the list to
//     the minimum mid-edit and then re-grow it out of blank, freshly-minted
//     steps, throwing away every definition the applicant had written from þrep
//     3 upwards on a change they never made. Anything that is not an in-range
//     integer is a no-op. (Before DMR clamped, those blank steps also carried
//     new ids at the same orders, which reset every role and employee in þrep 3
//     and up to 1. þrep — the shape of the original bug report.)
//  2. Shrinking parks the trimmed tail instead of discarding it, so growing
//     back restores those exact steps — same ids, same definitions. Nothing has
//     been removed on DMR's side until "Halda áfram" flushes the screen, so
//     5 -> 4 -> 5 within a visit costs the draft nothing, rather than a
//     REMOVE/CREATE round trip that blanks a definition and re-points the
//     assignment rows behind it.
export const useStepCountSync = (fieldName: string) => {
  const { setValue, getValues } = useFormContext()
  const watched = useWatch({ name: `${fieldName}.stepCount` })
  const stepCountStr = watched == null ? '' : String(watched)

  // Steps cut off the end by a shrink, in step order, so a later grow can put
  // them back before minting anything new. Lives for this mount only: on the
  // next visit the draft is re-read and these ids are either back on it or
  // genuinely gone.
  const trimmedTail = useRef<SubCriterionStep[]>([])

  // The step count the screen loaded with — the state every existing role and
  // employee classification was made against. Latched on the first render
  // (SubCriterionItem only mounts once the parent has reset the form), so a
  // sub-criterion added during this visit starts from its own two steps.
  const loadedStepCount = useRef<number | undefined>(undefined)
  if (loadedStepCount.current === undefined) {
    const steps: SubCriterionStep[] = getValues(`${fieldName}.steps`) ?? []
    if (steps.length > 0) loadedStepCount.current = steps.length
  }

  // For the one other writer of `steps`: picking a catalog template replaces
  // the list wholesale, which makes the parked tail belong to definitions the
  // applicant has just discarded.
  const forgetTrimmedSteps = useCallback(() => {
    trimmedTail.current = []
  }, [])

  useEffect(() => {
    const count = parseStepCount(stepCountStr)
    if (count === undefined) return

    const currentSteps: SubCriterionStep[] =
      getValues(`${fieldName}.steps`) ?? []
    if (count === currentSteps.length) return

    if (count > currentSteps.length) {
      const needed = count - currentSteps.length
      const restored = trimmedTail.current.slice(0, needed)
      trimmedTail.current = trimmedTail.current.slice(restored.length)
      const fresh = Array.from({ length: needed - restored.length }, () => ({
        id: crypto.randomUUID(),
        description: '',
      }))
      setValue(`${fieldName}.steps`, [...currentSteps, ...restored, ...fresh])
    } else {
      // Newly cut steps sit in front of anything parked earlier: together they
      // are the tail beyond `count`, still in step order.
      trimmedTail.current = [
        ...currentSteps.slice(count),
        ...trimmedTail.current,
      ]
      setValue(`${fieldName}.steps`, currentSteps.slice(0, count))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepCountStr])

  return {
    loadedStepCount: loadedStepCount.current,
    // A blank field is someone part-way through typing, not a mistake to
    // colour red; anything else the hook declined to act on is worth saying
    // out loud, since the step list below it stayed where it was.
    isStepCountOutOfRange:
      stepCountStr.trim() !== '' && parseStepCount(stepCountStr) === undefined,
    forgetTrimmedSteps,
  }
}
