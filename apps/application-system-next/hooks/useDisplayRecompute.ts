'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  validateAction,
  type SdfComponentData,
} from '../lib/graphql'

const DEBOUNCE_MS = 300

const hasDisplayFields = (components: SdfComponentData[]): boolean =>
  components.some((c) => c.__typename === 'SdfDisplayField')

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
): Record<string, string> => {
  const [overlay, setOverlay] = useState<Record<string, string>>({})
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestCounterRef = useRef(0)

  const shouldRecompute = useMemo(
    () => hasDisplayFields(components),
    [components],
  )

  const serializedAnswers = useMemo(
    () => JSON.stringify(answers),
    [answers],
  )

  useEffect(() => {
    if (!shouldRecompute) return

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      const requestId = ++requestCounterRef.current
      try {
        const result = await validateAction(
          applicationId,
          answers,
          [],
          locale,
        )
        if (requestId !== requestCounterRef.current) return
        setOverlay(result.displayValues ?? {})
      } catch {
        // Best-effort reactive update; errors here must not break the form.
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [serializedAnswers, applicationId, locale, shouldRecompute])

  return overlay
}
