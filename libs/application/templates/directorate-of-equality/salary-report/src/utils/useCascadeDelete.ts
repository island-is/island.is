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

  const persist = async (deletedKey: string, filter: (items: T[]) => T[]) => {
    if (!deletedKey) return
    const current = (getValues(targetField) as T[] | undefined) ?? []
    if (current.length === 0) return
    const filtered = filter(current)
    setValue(targetField, filtered)
    try {
      await updateApplication({
        variables: {
          input: {
            id: application.id,
            answers: { [targetField]: filtered },
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
