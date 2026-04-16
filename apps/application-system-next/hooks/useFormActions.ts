'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { executeAction as gqlExecuteAction, SdfScreen } from '../lib/graphql'

export function useFormActions(
  applicationId: string,
  initialScreen: SdfScreen,
) {
  const [screen, setScreen] = useState<SdfScreen>(initialScreen)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const answersRef = useRef<Record<string, unknown>>(
    initialScreen.answers ?? {},
  )
  const pageIndexRef = useRef(initialScreen.page.index)
  const [, forceRender] = useState(0)

  useEffect(() => {
    if (screen.answers) {
      const merged = { ...screen.answers, ...answersRef.current }
      answersRef.current = merged
      forceRender((n) => n + 1)
    }
  }, [screen.page.index])

  const setAnswer = useCallback((fieldId: string, value: unknown) => {
    answersRef.current = { ...answersRef.current, [fieldId]: value }
    forceRender((n) => n + 1)
  }, [])

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
          const pageChanged = result.page.index !== pageIndexRef.current
          pageIndexRef.current = result.page.index
          setScreen(result)
          if (pageChanged) {
            answersRef.current = result.answers ?? {}
            forceRender((n) => n + 1)
          }
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
