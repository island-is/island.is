'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  validateAction,
  type SdfComponentData,
} from '../lib/graphql'

const DEBOUNCE_MS = 300

const hasServerComputedDisplayFields = (
  components: SdfComponentData[],
): boolean =>
  components.some(
    (c) => c.__typename === 'SdfDisplayField' && !c.clientValueExpression,
  )

const getCurrentPageAnswerSnapshot = (
  components: SdfComponentData[],
  answers: Record<string, unknown>,
): Record<string, unknown> => {
  const snapshot: Record<string, unknown> = {}
  for (const component of components) {
    if (
      component.__typename !== 'SdfDisplayField' &&
      typeof component.id === 'string' &&
      component.id in answers
    ) {
      snapshot[component.id] = answers[component.id]
    }
  }
  return snapshot
}

/**
 * Reactively recomputes `SdfDisplayField` values by calling the dedicated
 * `applicationSdfValidate` mutation with the current page's answers. The
 * backend invokes the template-defined `value(answers, externalData)` closure
 * without persisting data, so it is safe to call on every (debounced)
 * keystroke. See plan §2d.
 *
 * Returns an overlay map (`{ [fieldId]: computedString }`) that is merged into
 * the renderer, taking precedence over the stale `component.value` produced at
 * screen-fetch time.
 */
export const useDisplayRecompute = (
  applicationId: string,
  components: SdfComponentData[],
  answers: Record<string, unknown>,
  locale: string,
  pageIndex?: number,
): Record<string, string> => {
  const [overlay, setOverlay] = useState<Record<string, string>>({})
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestCounterRef = useRef(0)

  const shouldRecompute = useMemo(
    () => hasServerComputedDisplayFields(components),
    [components],
  )

  const serializedCurrentPageAnswers = useMemo(
    () => JSON.stringify(getCurrentPageAnswerSnapshot(components, answers)),
    [answers, components],
  )

  useEffect(() => {
    if (!shouldRecompute) {
      setOverlay({})
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    const requestId = ++requestCounterRef.current
    timerRef.current = setTimeout(async () => {
      try {
        const result = await validateAction(
          applicationId,
          answers,
          [],
          locale,
          pageIndex,
        )
        if (requestId !== requestCounterRef.current) return
        setOverlay(result.displayValues ?? {})
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('SDF display recompute failed', error)
        }
        // Best-effort reactive update; errors here must not break the form.
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [serializedCurrentPageAnswers, applicationId, locale, pageIndex, shouldRecompute])

  return overlay
}
