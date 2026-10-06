import { useEffect, useRef, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Button, DialogPrompt } from '@island.is/island-ui/core'
import { FormScreen } from '../components/form/FormScreen'
import { regulation } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { Advert } from '../fields/Advert'
import { SignaturesField } from '../fields/Signatures'
import { BaseChanges, ReferenceText } from '../components/regulations'
import { useRegulationDraft } from '../hooks/useRegulationDraft'
import { useRegulationImpacts } from '../hooks/useRegulationImpacts'
import { useAmendingText } from '../hooks/useAmendingText'
import { useApplication } from '../hooks/useUpdateApplication'

export const RegulationContentScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application } = props
  const isAmending =
    application.answers?.applicationType === 'amending_regulation'

  const { saveDraft, loadDraft, draftId } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  // Shown next to the editor so the text can be compared with the changes
  // that will be applied to the base regulations
  const { impacts } = useRegulationImpacts({
    draftId: isAmending ? draftId : undefined,
  })
  const { generateText } = useAmendingText({ applicationId: application.id })
  const { refetchApplication } = useApplication({
    applicationId: application.id,
  })

  // Remounts the title and text inputs after the text is regenerated
  const [advertKey, setAdvertKey] = useState(0)

  const regenerateText = async () => {
    await generateText(impacts)
    await refetchApplication()
    setAdvertKey((key) => key + 1)
  }

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

  const updateTextMsg = regulation.content.updateText

  return (
    <FormScreen
      goToScreen={handleNavigate}
      title={f(regulation.content.general.title)}
      intro={f(regulation.content.general.intro)}
    >
      {isAmending && impacts.length > 0 && (
        <>
          <ReferenceText legend={f(regulation.content.baseChanges.legend)}>
            <BaseChanges impacts={impacts} />
          </ReferenceText>
          <Box display="flex" justifyContent="flexEnd" marginBottom={2}>
            <DialogPrompt
              baseId="regenerate_amending_text_dialog"
              title={f(updateTextMsg.title)}
              description={f(updateTextMsg.description)}
              ariaLabel={f(updateTextMsg.title)}
              disclosureElement={
                <Button
                  variant="text"
                  size="small"
                  icon="reload"
                  iconType="outline"
                >
                  {f(updateTextMsg.button)}
                </Button>
              }
              onConfirm={regenerateText}
              buttonTextConfirm={f(updateTextMsg.confirm)}
              buttonTextCancel={f(updateTextMsg.cancel)}
            />
          </Box>
        </>
      )}
      <Advert key={advertKey} {...props} />
      <SignaturesField {...props} />
    </FormScreen>
  )
}

export default RegulationContentScreen
