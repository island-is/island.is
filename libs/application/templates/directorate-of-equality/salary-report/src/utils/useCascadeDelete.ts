import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import type { Application } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

// Several delete flows in this template (deleting a criterion, or one of its
// sub-criteria) must cascade-clean the matching entries out of `employees`/
// `roles` — but the screen that triggers the delete never itself saves those
// answer keys (its own "Continue" only persists its own screen's key), so a
// plain setValue would leave the correction stuck in local form state until
// some later, unrelated screen happens to be submitted. Persisting
// immediately here closes that window; a reload right after deleting won't
// resurrect the stale assignment.
export const useCascadeDelete = <T>(
  application: Application,
  targetField: string,
) => {
  const { lang: locale } = useLocale()
  const { getValues, setValue } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  // Holds the key (title) of the item whose cascade-delete failed to persist,
  // so the caller's retry button can rebuild the same filter and try again.
  const [saveError, setSaveError] = useState<string | null>(null)

  // `alsoPersist` lists further top-level answer keys the caller has already
  // corrected in local form state and that the triggering screen doesn't save
  // either. They're read back from form state rather than passed by value, so
  // a retry re-sends whatever is current instead of re-applying an edit that
  // isn't safe to run twice (an index-based splice, say). Sent in the same
  // mutation as the cascade itself, so a delete lands as one update.
  const persist = async (
    deletedKey: string,
    filter: (items: T[]) => T[],
    alsoPersist: string[] = [],
  ) => {
    const answers: Record<string, unknown> = {}

    const current = (getValues(targetField) as T[] | undefined) ?? []
    if (deletedKey && current.length > 0) {
      const filtered = filter(current)
      setValue(targetField, filtered)
      answers[targetField] = filtered
    }

    for (const key of alsoPersist) {
      const value = getValues(key)
      if (value !== undefined) {
        answers[key] = value
      }
    }

    if (Object.keys(answers).length === 0) return

    try {
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers,
          },
          locale,
        },
      })
      setSaveError(null)
    } catch {
      setSaveError(deletedKey)
    }
  }

  return { persist, saveError }
}
