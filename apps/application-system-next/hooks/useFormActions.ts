'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { executeAction as gqlExecuteAction, SdfScreen } from '../lib/graphql'

export const useFormActions = (
  applicationId: string,
  initialScreen: SdfScreen,
) => {
  const [screen, setScreen] = useState<SdfScreen>(initialScreen)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const localeRef = useRef(initialScreen.locale ?? 'is')
  const answersRef = useRef<Record<string, unknown>>(
    initialScreen.answers ?? {},
  )
  const [answerSnapshot, setAnswerSnapshot] = useState<Record<string, unknown>>(
    initialScreen.answers ?? {},
  )
  const pageIndexRef = useRef(initialScreen.page.index)
  const pendingTargetCountsRef = useRef<Record<string, number>>({})
  const [pendingRefetchTargets, setPendingRefetchTargets] = useState<string[]>([])
  const [, forceRender] = useState(0)

  // When the page index changes, merge the server snapshot for that screen.
  // Server values must win over answersRef — ref can still hold stale choices from
  // before PREV_PAGE / NEXT_PAGE (e.g. needsWaterAccess) and would break
  // server-evaluated showWhen.
  useEffect(() => {
    if (screen.answers) {
      answersRef.current = { ...answersRef.current, ...screen.answers }
      setAnswerSnapshot(answersRef.current)
      forceRender((n) => n + 1)
    }
  }, [screen.page.index])

  const setAnswer = useCallback((fieldId: string, value: unknown) => {
    answersRef.current = { ...answersRef.current, [fieldId]: value }
    console.log('[SDF display debug] useFormActions setAnswer', {
      fieldId,
      value,
      answers: answersRef.current,
    })
    setAnswerSnapshot(answersRef.current)
    forceRender((n) => n + 1)
  }, [])

  const onAnswerChange = useCallback(
    (fieldId: string, value: unknown) => {
      setAnswer(fieldId, value)
    },
    [setAnswer],
  )

  const updatePendingRefetchTargets = useCallback(
    (targets: string[] | undefined, delta: 1 | -1) => {
      if (!targets?.length) {
        return
      }

      const nextCounts = { ...pendingTargetCountsRef.current }
      for (const target of targets) {
        const current = nextCounts[target] ?? 0
        const next = current + delta
        if (next > 0) {
          nextCounts[target] = next
        } else {
          delete nextCounts[target]
        }
      }
      pendingTargetCountsRef.current = nextCounts
      setPendingRefetchTargets(Object.keys(nextCounts))
    },
    [],
  )

  const dispatch = useCallback(
    async (
      actionType: string,
      extraAnswers?: Record<string, unknown>,
      fieldIds?: string[],
      event?: string,
      refetchTemplateApiActions?: string[],
      refetchTargets?: string[],
      lastKnownPageIndex?: number,
    ) => {
      setError(null)
      const mergedAnswers = { ...answersRef.current, ...extraAnswers }
      const targets =
        actionType === 'REFETCH' && refetchTargets?.length
          ? refetchTargets
          : undefined

      updatePendingRefetchTargets(targets, 1)

      startTransition(async () => {
        try {
          const result = await gqlExecuteAction(
            applicationId,
            actionType,
            Object.keys(mergedAnswers).length > 0 ? mergedAnswers : undefined,
            localeRef.current,
            fieldIds,
            event,
            refetchTemplateApiActions,
            lastKnownPageIndex,
          )
          pageIndexRef.current = result.page.index
          localeRef.current = result.locale ?? localeRef.current
          setScreen(result)
          // Always merge; never replace with result.answers alone — it only contains
          // fields present on the current page in the DB snapshot, and would drop keys
          // needed for client-side clientShowWhen on the page we navigate to.
          answersRef.current = {
            ...answersRef.current,
            ...(result.answers ?? {}),
          }
          setAnswerSnapshot(answersRef.current)
          forceRender((n) => n + 1)
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Action failed')
        } finally {
          updatePendingRefetchTargets(targets, -1)
        }
      })
    },
    [applicationId, updatePendingRefetchTargets],
  )

  const nextPage = useCallback(
    () =>
      dispatch(
        'NEXT_PAGE',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        screen.page.index,
      ),
    [dispatch, screen.page.index],
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
    pendingRefetchTargets,
    answers: answersRef,
    answerSnapshot,
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
