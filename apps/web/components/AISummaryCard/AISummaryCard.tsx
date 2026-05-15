import React, { useEffect, useRef, useState } from 'react'

import {
  Box,
  Inline,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'

interface AISummaryCardProps {
  query: string
  locale: 'is' | 'en'
}

type FetchState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; summary: string }
  | { kind: 'error' }

const COPY = {
  is: {
    title: 'Svar frá Claude',
    badge: 'Gervigreind',
    error: 'Tókst ekki að sækja samantekt.',
    disclaimer:
      'Sjálfvirkt myndað svar. Getur verið ónákvæmt — staðfestu á opinberum þjónustusíðum.',
  },
  en: {
    title: 'Claude’s response',
    badge: 'AI',
    error: 'Could not fetch summary.',
    disclaimer:
      'Automatically generated. May be inaccurate — verify on the official service pages.',
  },
} as const

export const AISummaryCard: React.FC<AISummaryCardProps> = ({
  query,
  locale,
}) => {
  const [state, setState] = useState<FetchState>({ kind: 'idle' })
  // Guard against duplicate fetches when React StrictMode double-invokes effects.
  const lastFetchedRef = useRef<string | null>(null)

  useEffect(() => {
    const q = (query ?? '').trim()
    if (!q) {
      setState({ kind: 'idle' })
      return
    }
    const key = `${locale}::${q}`
    if (lastFetchedRef.current === key) return
    lastFetchedRef.current = key

    const controller = new AbortController()
    setState({ kind: 'loading' })

    fetch('/api/ai-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, locale }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return (await res.json()) as { summary: string }
      })
      .then((data) => setState({ kind: 'success', summary: data.summary }))
      .catch((err) => {
        if (controller.signal.aborted) return
        // eslint-disable-next-line no-console
        console.warn('[AISummaryCard] fetch failed', err)
        setState({ kind: 'error' })
      })

    return () => controller.abort()
  }, [query, locale])

  if (state.kind === 'idle') return null

  const copy = COPY[locale]
  const paragraphs =
    state.kind === 'success'
      ? state.summary
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean)
      : []

  return (
    <Box
      background="blue100"
      padding={[3, 3, 4]}
      borderRadius="large"
      dataTestId="ai-summary-card"
    >
      <Stack space={2}>
        <Inline space={2} alignY="center">
          <Text variant="eyebrow" color="blue400">
            {copy.title}
          </Text>
          <Box
            background="blue200"
            paddingX={1}
            borderRadius="standard"
            display="inlineBlock"
          >
            <Text variant="eyebrow" color="blue600">
              {copy.badge}
            </Text>
          </Box>
        </Inline>

        {state.kind === 'loading' && (
          <SkeletonLoader repeat={3} height={18} space={1} />
        )}

        {state.kind === 'success' && (
          <Stack space={2}>
            {paragraphs.map((p, i) => (
              <Text key={i} variant="default">
                {p}
              </Text>
            ))}
            <Text variant="small" color="dark300">
              {copy.disclaimer}
            </Text>
          </Stack>
        )}

        {state.kind === 'error' && (
          <Text variant="default" color="red600">
            {copy.error}
          </Text>
        )}
      </Stack>
    </Box>
  )
}

export default AISummaryCard
