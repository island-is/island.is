import type { NextApiRequest, NextApiResponse } from 'next'
import Anthropic from '@anthropic-ai/sdk'

// Claude model. Haiku 4.5 is the fastest and cheapest Claude 4.x model —
// well-suited to short search-summary responses.
const MODEL = 'claude-haiku-4-5'

// Cap output. A 2–4 short-paragraph summary fits in <600 tokens easily.
const MAX_TOKENS = 600

// Reject pathologically long queries up front.
const MAX_QUERY_LENGTH = 200

type SuccessResponse = { summary: string }
type ErrorResponse = { error: string }

const buildSystemPrompt = (locale: 'is' | 'en'): string => {
  const respondIn = locale === 'is' ? 'Icelandic' : 'English'
  return `You are an assistant integrated into Ísland.is — Iceland's official portal for digital public services. Users search the site for help with government procedures: ID documents, driving licences, residence permits, taxes, social benefits, healthcare, family matters, education, courts, business registration, and similar civic affairs.

Your job: given the user's search query, write a short, useful orientation summary that helps them understand what the site likely offers on the topic and what to look for in the results below. Treat keyword-style queries as questions.

Response rules:
- Respond in ${respondIn}. The user is reading the site in this language.
- Length: 2 to 4 short paragraphs separated by blank lines. Plain text only. No markdown, no headings, no bullets, no asterisks.
- Be concrete and helpful. Never invent specific URLs, phone numbers, opening hours, fees, deadlines, or office addresses. When precise figures matter, say so generically and direct the user to check the official service page for current details.
- If the query is ambiguous, briefly note the most likely interpretations.
- If the topic is clearly outside the scope of public services (weather, opinion, entertainment), say so politely in one short paragraph rather than guessing.
- Do not include greetings, sign-offs, or meta-commentary about being an AI. Do not start with "Here is a summary" or "Based on your query" — start with the substance.`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const body = (req.body ?? {}) as { q?: unknown; locale?: unknown }
  const q = typeof body.q === 'string' ? body.q.trim() : ''
  if (!q) {
    res.status(400).json({ error: 'Missing or empty `q`.' })
    return
  }
  if (q.length > MAX_QUERY_LENGTH) {
    res
      .status(400)
      .json({ error: `Query is too long (max ${MAX_QUERY_LENGTH} chars).` })
    return
  }
  const locale: 'is' | 'en' = body.locale === 'en' ? 'en' : 'is'

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ error: 'AI search is not configured on this server.' })
    return
  }

  const client = new Anthropic()

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      // Mark the system prompt for ephemeral prompt caching. The cache key is
      // a prefix match; since the system prompt is identical across requests
      // (only the per-request user message varies), every request after the
      // first becomes a cache read at ~0.1× input cost.
      //
      // Caveat: Haiku 4.5's minimum cacheable prefix is 4096 tokens. The
      // current system prompt is well below that, so the marker is silently
      // a no-op today (response.usage.cache_read_input_tokens stays 0). The
      // marker is placed correctly so caching activates automatically once
      // the prompt is expanded above the threshold.
      system: [
        {
          type: 'text',
          text: buildSystemPrompt(locale),
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: q }],
    })

    const summary = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n\n')
      .trim()

    if (!summary) {
      res.status(502).json({ error: 'Empty response from model.' })
      return
    }

    if (process.env.NODE_ENV !== 'production') {
      // Surface usage + cache activity in dev logs so we can see when caching kicks in.
      // eslint-disable-next-line no-console
      console.log('[ai-search] usage', {
        q,
        locale,
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
        cache_creation_input_tokens: message.usage.cache_creation_input_tokens,
        cache_read_input_tokens: message.usage.cache_read_input_tokens,
      })
    }

    // Cheap browser-side cache: same (q, locale) within 60s reuses the response.
    res.setHeader('Cache-Control', 'private, max-age=60')
    res.status(200).json({ summary })
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      res.setHeader('Retry-After', '30')
      res.status(429).json({ error: 'Rate limited. Try again shortly.' })
      return
    }
    if (err instanceof Anthropic.APIError) {
      res
        .status(err.status ?? 502)
        .json({ error: err.message ?? 'Upstream model error.' })
      return
    }
    // eslint-disable-next-line no-console
    console.error('[ai-search] unexpected error', err)
    res.status(500).json({ error: 'Internal error.' })
  }
}
