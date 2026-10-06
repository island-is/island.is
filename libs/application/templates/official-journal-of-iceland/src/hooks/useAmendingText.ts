/**
 * Generates the suggested amending regulation title and text from its
 * impacts and stores them in the advert answers.
 *
 * The generated text is only a starting point. The user edits it freely,
 * and what they submit is what gets published, so it is never overwritten
 * without asking once the user has edited it (see `isEdited`).
 */
import { useCallback, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from '@island.is/island-ui/core'
import type { HTMLText } from '@island.is/regulations'
import { RegulationImpactSchema } from '../lib/dataSchema'
import { InputFields } from '../lib/types'
import {
  formatAmendingBodyWithArticlePrefix,
  formatAmendingRegTitle,
} from '../utils/formatAmendingRegulation'
import { useApplication } from './useUpdateApplication'

type AmendingText = {
  /** Base64-encoded HTML, as stored in the advert answers */
  html: string
  title: string
}

const buildText = (impacts: RegulationImpactSchema[]): AmendingText => {
  if (!impacts.length) return { html: '', title: '' }
  const bodyHtml = formatAmendingBodyWithArticlePrefix(impacts).join(
    '',
  ) as HTMLText
  return {
    html: Buffer.from(bodyHtml).toString('base64'),
    // Without the "Reglugerð" prefix in the OJOI flow
    title: formatAmendingRegTitle(impacts, { skipRegulationPrefix: true }),
  }
}

export const useAmendingText = ({
  applicationId,
}: {
  applicationId: string
}) => {
  const { getValues } = useFormContext()
  const { updateApplicationV2 } = useApplication({ applicationId })

  // The text and title as last generated, to tell them apart from edits
  const lastGeneratedRef = useRef<AmendingText>()

  const getCurrent = useCallback(
    (): AmendingText => ({
      html: (getValues(InputFields.advert.html) as string | undefined) ?? '',
      title: (getValues(InputFields.advert.title) as string | undefined) ?? '',
    }),
    [getValues],
  )

  /**
   * Remember the current text as generated if it is exactly what these
   * impacts generate, so coming back to the impacts screen without editing
   * doesn't count as an edit.
   */
  const rememberIfGenerated = useCallback(
    (impacts: RegulationImpactSchema[]) => {
      const generated = buildText(impacts)
      const current = getCurrent()
      if (
        generated.html === current.html &&
        generated.title === current.title
      ) {
        lastGeneratedRef.current = generated
      }
    },
    [getCurrent],
  )

  /**
   * Whether the title or text holds anything other than nothing or exactly
   * what was last generated, read from the live form state.
   */
  const isEdited = useCallback(() => {
    const current = getCurrent()
    const html = Buffer.from(current.html, 'base64').toString('utf-8')
    const hasText = html.replace(/<[^>]*>|&nbsp;/g, '').trim().length > 0
    if (!hasText && !current.title.trim()) return false

    const last = lastGeneratedRef.current
    return !(last && last.html === current.html && last.title === current.title)
  }, [getCurrent])

  /**
   * Mirrors the regulations-admin "Uppfæra texta" flow.
   * Resolves to whether the text was saved, and tells the user if not.
   */
  const generateText = useCallback(
    async (impacts: RegulationImpactSchema[]): Promise<boolean> => {
      const generated = buildText(impacts)
      try {
        await updateApplicationV2({
          path: InputFields.advert.html,
          value: generated.html,
        })
        await updateApplicationV2({
          path: InputFields.advert.title,
          value: generated.title,
        })
        lastGeneratedRef.current = generated
        return true
      } catch (error) {
        console.error('Failed to update amending regulation text:', error)
        toast.error('Ekki tókst að uppfæra texta breytingareglugerðar.')
        return false
      }
    },
    [updateApplicationV2],
  )

  return { isEdited, rememberIfGenerated, generateText }
}
