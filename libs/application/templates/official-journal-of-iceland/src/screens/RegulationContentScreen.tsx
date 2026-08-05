import { useEffect, useRef } from 'react'
import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { regulation } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { Advert } from '../fields/Advert'
import { SignaturesField } from '../fields/Signatures'
import { useRegulationDraft } from '../hooks/useRegulationDraft'

export const RegulationContentScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application } = props

  const { saveDraft, loadDraft, draftId } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  // Load regulation-specific fields from the DB on first render.
  // The draft itself is created in TypeSelectionScreen.
  const initRef = useRef(false)
  useEffect(() => {
    if (initRef.current || !draftId) return
    initRef.current = true
    loadDraft(draftId)
  }, [draftId, loadDraft])

  // Sync OJOI answer fields (advert title/html, signature) to the
  // regulation DB when navigating away from this screen.
  const handleNavigate = async (screenId?: string) => {
    if (draftId) {
      await saveDraft()
    }
    props.goToScreen?.(screenId ?? '')
  }

  return (
    <FormScreen
      goToScreen={handleNavigate}
      title={f(regulation.content.general.title)}
      intro={f(regulation.content.general.intro)}
    >
      <Advert {...props} />
      <SignaturesField {...props} />
    </FormScreen>
  )
}

export default RegulationContentScreen
