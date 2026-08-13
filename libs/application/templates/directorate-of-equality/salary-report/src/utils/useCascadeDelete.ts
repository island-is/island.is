import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import type { Application, RecordObject } from '@island.is/application/types'
import { useLocale } from '@island.is/localization'

// Several delete flows in this template (deleting a criterion, or one of its
// sub-criteria) must cascade-clean the matching entries out of other answer
// keys — `employees`, `roles`, `subCriteria`. The screen that triggers the
// delete never itself saves those keys (its own "Continue" only persists its
// own screen's key), so a plain setValue would leave the correction stuck in
// local form state until some later, unrelated screen happens to be
// submitted. Persisting immediately here closes that window; a reload right
// after deleting won't resurrect the stale assignment.
export const useCascadeDelete = (application: Application) => {
  const { lang: locale } = useLocale()
  const { setValue } = useFormContext()
  const [updateApplication] = useMutation(UPDATE_APPLICATION)
  // Holds the failed cascade's payload alongside the deleted item's title, so
  // the caller's retry button replays the exact same answers rather than
  // recomputing them. Recomputing would double-apply any non-idempotent step
  // — the splice that keeps `subCriteria.personalFactors` aligned with
  // `criteria.personalFactors` would eat a second, innocent slot on retry.
  const [failed, setFailed] = useState<{
    title: string
    answers: RecordObject
  } | null>(null)

  const send = async (title: string, answers: RecordObject) => {
    try {
      await updateApplication({
        variables: { input: { id: application.id, answers }, locale },
      })
      setFailed(null)
    } catch {
      setFailed({ title, answers })
    }
  }

  // `answers` must be keyed by TOP-LEVEL answer key: updateApplication merges
  // answers one level deep, so a nested path like
  // 'subCriteria.personalFactors' would land as a bogus flat answer instead
  // of updating the nested value. Every key passed in one call goes out in a
  // single mutation, so a cascade spanning several keys can't half-apply.
  const persist = async (deletedTitle: string, answers: RecordObject) => {
    if (!deletedTitle) return
    Object.entries(answers).forEach(([key, value]) => setValue(key, value))
    await send(deletedTitle, answers)
  }

  const retry = async () => {
    if (!failed) return
    await send(failed.title, failed.answers)
  }

  return { persist, retry, saveError: failed?.title ?? null }
}
