/**
 * Generates the suggested amending regulation title and text from its
 * impacts and stores them in the advert answers.
 *
 * The generated text is only a starting point. The user edits it freely,
 * and what they submit is what gets published, so it is never overwritten
 * without asking once it has content (see `hasText`).
 */
import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import type { HTMLText } from '@island.is/regulations'
import { RegulationImpactSchema } from '../lib/dataSchema'
import { InputFields } from '../lib/types'
import {
  formatAmendingBodyWithArticlePrefix,
  formatAmendingRegTitle,
} from '../utils/formatAmendingRegulation'
import { useApplication } from './useUpdateApplication'

export const useAmendingText = ({
  applicationId,
}: {
  applicationId: string
}) => {
  const { getValues } = useFormContext()
  const { updateApplicationV2 } = useApplication({ applicationId })

  /** Whether the advert text has any content, read from the live form state */
  const hasText = useCallback(() => {
    const base64Html = getValues(InputFields.advert.html) as string | undefined
    if (!base64Html) return false
    const html = Buffer.from(base64Html, 'base64').toString('utf-8')
    return html.replace(/<[^>]*>|&nbsp;/g, '').trim().length > 0
  }, [getValues])

  /**
   * Mirrors the regulations-admin "Uppfæra texta" flow.
   */
  const generateText = useCallback(
    async (impacts: RegulationImpactSchema[]) => {
      if (impacts.length === 0) {
        await updateApplicationV2({
          path: InputFields.advert.html,
          value: '',
        })
        await updateApplicationV2({
          path: InputFields.advert.title,
          value: '',
        })
        return
      }

      const bodyHtml = formatAmendingBodyWithArticlePrefix(impacts).join(
        '',
      ) as HTMLText
      const base64Body = Buffer.from(bodyHtml).toString('base64')

      // Without the "Reglugerð" prefix in the OJOI flow
      const title = formatAmendingRegTitle(impacts, {
        skipRegulationPrefix: true,
      })

      await updateApplicationV2({
        path: InputFields.advert.html,
        value: base64Body,
      })
      await updateApplicationV2({
        path: InputFields.advert.title,
        value: title,
      })
    },
    [updateApplicationV2],
  )

  return { hasText, generateText }
}
