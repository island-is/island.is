'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useLocale } from '@island.is/localization'
import {
  executeAction as gqlExecuteAction,
  fetchScreen,
  SdfScreen,
} from '../lib/graphql'
import {
  getHistoryAction,
  HistoryAction,
  readScreenIdFromSearch,
  writeScreenHistory,
} from '../lib/screenNavigation'

// Actions that move the user to another screen. The others (REFETCH, ...) only
// refresh the screen the user is on.
const NAVIGATING_ACTIONS = new Set(['NEXT_PAGE', 'PREV_PAGE', 'SUBMIT'])

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
  // The screen the user is on. Sent with every action so the server can tell
  // which screen the answers belong to.
  const screenIdRef = useRef(initialScreen.page.id)
  // Orders screen requests so a slow response cannot replace the screen of a
  // later move. A request that moves the user takes a new turn and so
  // supersedes every request before it; one that only refreshes the current
  // screen keeps the current turn, so any move started after it supersedes it.
  const latestTurnRef = useRef(0)
  const takeTurn = useCallback(
    (isNavigation: boolean) =>
      isNavigation ? ++latestTurnRef.current : latestTurnRef.current,
    [],
  )
  const pendingTargetCountsRef = useRef<Record<string, number>>({})
  const [pendingRefetchTargets, setPendingRefetchTargets] = useState<string[]>(
    [],
  )
  const [, forceRender] = useState(0)

  // When the screen changes, merge the server snapshot for that screen.
  // Server values must win over answersRef — ref can still hold stale choices from
  // before PREV_PAGE / NEXT_PAGE (e.g. needsWaterAccess) and would break
  // server-evaluated showWhen.
  useEffect(() => {
    if (screen.answers) {
      answersRef.current = { ...answersRef.current, ...screen.answers }
      setAnswerSnapshot(answersRef.current)
      forceRender((n) => n + 1)
    }
  }, [screen.page.id])

  // Shows a screen the server returned and brings the address bar in line.
  const showScreen = useCallback(
    (result: SdfScreen, historyAction: HistoryAction) => {
      screenIdRef.current = result.page.id
      localeRef.current = result.locale ?? localeRef.current
      setScreen(result)
      if (historyAction !== 'none') {
        writeScreenHistory(historyAction, result.page.id)
      }
    },
    [],
  )

  // SDF screen text (labels, descriptions, button copy) is resolved
  // server-side per locale, so the IS/EN switcher cannot translate the form on
  // its own — it only flips the shared LocaleContext. When that locale changes,
  // refetch the current page in the new locale. We keep in-progress answers by
  // letting local answers win over the persisted snapshot, so the form looks
  // identical apart from the language.
  const { lang } = useLocale()
  useEffect(() => {
    if (lang === localeRef.current) {
      return
    }
    let isActive = true
    localeRef.current = lang
    const turn = takeTurn(false)
    startTransition(async () => {
      try {
        const requestedId = screenIdRef.current
        const result = await fetchScreen(applicationId, requestedId, lang)
        if (!isActive || turn !== latestTurnRef.current) {
          return
        }
        showScreen(
          result,
          getHistoryAction({
            source: 'url',
            requestedId,
            responseId: result.page.id,
          }),
        )
        answersRef.current = {
          ...(result.answers ?? {}),
          ...answersRef.current,
        }
        setAnswerSnapshot(answersRef.current)
        forceRender((n) => n + 1)
      } catch (e) {
        if (isActive) {
          setError(e instanceof Error ? e.message : 'Action failed')
        }
      }
    })
    return () => {
      isActive = false
    }
  }, [lang, applicationId, showScreen, takeTurn])

  const setAnswer = useCallback((fieldId: string, value: unknown) => {
    answersRef.current = { ...answersRef.current, [fieldId]: value }
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
    ) => {
      setError(null)
      const mergedAnswers = { ...answersRef.current, ...extraAnswers }
      const targets =
        actionType === 'REFETCH' && refetchTargets?.length
          ? refetchTargets
          : undefined
      const claimedScreenId = screenIdRef.current
      const turn = takeTurn(NAVIGATING_ACTIONS.has(actionType))

      updatePendingRefetchTargets(targets, 1)

      startTransition(async () => {
        try {
          const result = await gqlExecuteAction(
            applicationId,
            actionType,
            claimedScreenId,
            Object.keys(mergedAnswers).length > 0 ? mergedAnswers : undefined,
            localeRef.current,
            fieldIds,
            event,
            refetchTemplateApiActions,
          )
          if (turn !== latestTurnRef.current) {
            return
          }
          showScreen(
            result,
            getHistoryAction({
              source: 'navigation',
              currentId: claimedScreenId,
              responseId: result.page.id,
              hasNotice: !!result.notice,
            }),
          )
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
          if (turn === latestTurnRef.current) {
            setError(e instanceof Error ? e.message : 'Action failed')
          }
        } finally {
          updatePendingRefetchTargets(targets, -1)
        }
      })
    },
    [applicationId, updatePendingRefetchTargets, showScreen, takeTurn],
  )

  // Fetches a screen the address bar names (`requestedId`) or, for a link
  // inside the form, one the user chose (`source: 'navigation'`).
  const loadScreen = useCallback(
    (requestedId: string | undefined, source: 'url' | 'navigation') => {
      setError(null)
      const turn = takeTurn(true)
      startTransition(async () => {
        try {
          const currentId = screenIdRef.current
          const result = await fetchScreen(
            applicationId,
            requestedId,
            localeRef.current,
          )
          if (turn !== latestTurnRef.current) {
            return
          }
          showScreen(
            result,
            source === 'url'
              ? getHistoryAction({
                  source,
                  requestedId,
                  responseId: result.page.id,
                })
              : getHistoryAction({
                  source,
                  currentId,
                  responseId: result.page.id,
                  hasNotice: false,
                }),
          )
          answersRef.current = {
            ...answersRef.current,
            ...(result.answers ?? {}),
          }
          setAnswerSnapshot(answersRef.current)
          forceRender((n) => n + 1)
        } catch (e) {
          if (turn === latestTurnRef.current) {
            setError(e instanceof Error ? e.message : 'Action failed')
          }
        }
      })
    },
    [applicationId, showScreen, takeTurn],
  )

  // Back/forward changes the address bar without a page load, so show the
  // screen it now names.
  useEffect(() => {
    const onPopState = () => {
      const requestedId = readScreenIdFromSearch(window.location.search)
      if (requestedId !== screenIdRef.current) {
        loadScreen(requestedId, 'url')
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [loadScreen])

  const goToScreen = useCallback(
    (id: string) => loadScreen(id, 'navigation'),
    [loadScreen],
  )

  const nextPage = useCallback(() => dispatch('NEXT_PAGE'), [dispatch])

  const prevPage = useCallback(() => dispatch('PREV_PAGE'), [dispatch])

  const submit = useCallback(
    (event: string) => dispatch('SUBMIT', undefined, undefined, event),
    [dispatch],
  )

  const refetch = useCallback(() => dispatch('REFETCH'), [dispatch])

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
    goToScreen,
    dispatch,
  }
}
