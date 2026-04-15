'use client'

import { useCallback, useRef, useState, useTransition } from 'react'
import { executeAction as gqlExecuteAction, SdfScreen } from '../lib/graphql'

/**
 * Hook for dispatching SDF form actions (NEXT_PAGE, PREV_PAGE, SUBMIT,
 * REFETCH, VALIDATE).
 *
 * The backend tracks the current page index in the database. The frontend
 * simply sends actions and renders whatever screen the backend returns.
 * Custom components must use onAnswerChange to route answer changes through
 * executeAction rather than mutating local state directly (§8, Constraint 5).
 */
export function useFormActions(
  applicationId: string,
  initialScreen: SdfScreen,
) {
  const [screen, setScreen] = useState<SdfScreen>(initialScreen)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const answersRef = useRef<Record<string, unknown>>({})

  const setAnswer = useCallback((fieldId: string, value: unknown) => {
    answersRef.current = { ...answersRef.current, [fieldId]: value }
  }, [])

  /**
   * onAnswerChange is the ONLY way custom components are allowed to persist
   * answer changes. It queues the change locally and the next NEXT_PAGE
   * or SUBMIT sends all accumulated answers to the server for validation.
   *
   * This ensures no answer bypasses server-side Zod validation (§8, Constraint 5).
   */
  const onAnswerChange = useCallback(
    (fieldId: string, value: unknown) => {
      setAnswer(fieldId, value)
    },
    [setAnswer],
  )

  const dispatch = useCallback(
    async (
      actionType: string,
      extraAnswers?: Record<string, unknown>,
      fieldIds?: string[],
      event?: string,
    ) => {
      setError(null)
      const mergedAnswers = { ...answersRef.current, ...extraAnswers }

      startTransition(async () => {
        try {
          const result = await gqlExecuteAction(
            applicationId,
            actionType,
            Object.keys(mergedAnswers).length > 0 ? mergedAnswers : undefined,
            'is',
            fieldIds,
            event,
          )
          setScreen(result)
          answersRef.current = {}
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Action failed')
        }
      })
    },
    [applicationId],
  )

  const nextPage = useCallback(
    () => dispatch('NEXT_PAGE'),
    [dispatch],
  )

  const prevPage = useCallback(
    () => dispatch('PREV_PAGE'),
    [dispatch],
  )

  const submit = useCallback(
    (event?: string) => dispatch('SUBMIT', undefined, undefined, event),
    [dispatch],
  )

  const refetch = useCallback(
    () => dispatch('REFETCH'),
    [dispatch],
  )

  const validate = useCallback(
    (fieldIds: string[]) => dispatch('VALIDATE', undefined, fieldIds),
    [dispatch],
  )

  return {
    screen,
    isPending,
    error,
    answers: answersRef,
    setAnswer,
    onAnswerChange,
    nextPage,
    prevPage,
    submit,
    refetch,
    validate,
    dispatch,
  }
}
