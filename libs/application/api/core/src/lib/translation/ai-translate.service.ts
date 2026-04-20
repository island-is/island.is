import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

export interface AiTranslationResult {
  translations: Record<string, string>
}

@Injectable()
export class AiTranslateService {
  async translateStrings(
    sourceStrings: Record<string, string>,
    sourceLocale: string,
    targetLocale: string,
  ): Promise<AiTranslationResult> {
    const sourceLang = sourceLocale === 'is' ? 'Icelandic' : 'English'
    const targetLang = targetLocale === 'en' ? 'English' : 'Icelandic'

    const keys = Object.keys(sourceStrings)
    if (keys.length === 0) {
      return { translations: {} }
    }

    const stringsForPrompt = JSON.stringify(sourceStrings, null, 2)

    const prompt = `You are translating UI text for an Icelandic government digital service (island.is).

Translate the following strings from ${sourceLang} to ${targetLang}.

Important rules:
- Preserve any ICU message format syntax ({variableName}, {count, plural, ...}, etc.) exactly as-is
- Keep the same keys in the output
- Maintain the same tone and formality level
- Be concise and use standard ${targetLang} terminology for government/administrative context
- Return ONLY a valid JSON object mapping each key to its translation, no other text

Input strings:
${stringsForPrompt}`

    try {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        logger.warn(
          'OPENAI_API_KEY not configured, returning empty translations',
        )
        return { translations: {} }
      }

      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            response_format: { type: 'json_object' },
          }),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        logger.error(`OpenAI API error: ${response.status} ${errorText}`)
        return { translations: {} }
      }

      const result = await response.json()
      const content = result.choices?.[0]?.message?.content

      if (!content) {
        return { translations: {} }
      }

      const parsed = JSON.parse(content)

      const translations: Record<string, string> = {}
      for (const key of keys) {
        if (typeof parsed[key] === 'string') {
          translations[key] = parsed[key]
        }
      }

      return { translations }
    } catch (error) {
      logger.error('AI translation failed', error)
      return { translations: {} }
    }
  }
}
