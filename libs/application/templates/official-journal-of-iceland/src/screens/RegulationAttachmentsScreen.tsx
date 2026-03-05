import { useLocale } from '@island.is/localization'
import { FormScreen } from '../components/form/FormScreen'
import { Attachments } from '../fields/Attachments'
import { attachments } from '../lib/messages'
import { OJOIFieldBaseProps } from '../lib/types'
import { useRegulationDraft } from '../hooks/useRegulationDraft'

/**
 * Regulation-specific attachments screen. Renders the same UI as the ad flow's
 * AttachmentsScreen (toggle between HTML additions editor and file upload) but
 * also calls saveDraft() on navigate so that any HTML additions written here
 * (answers.advert.additions) are synced to the regulation draft DB.
 *
 * File uploads use the same OJOI attachment store mechanism as ads.
 */
export const RegulationAttachmentsScreen = (props: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { application } = props

  const { saveDraft, draftId } = useRegulationDraft({
    applicationId: application.id,
    answers: application.answers as unknown as Record<string, unknown>,
  })

  const handleNavigate = (screenId?: string) => {
    if (draftId) {
      saveDraft()
    }
    props.goToScreen?.(screenId ?? '')
  }

  return (
    <FormScreen
      title={f(attachments.general.title)}
      intro={f(attachments.general.intro)}
      goToScreen={handleNavigate}
    >
      <Attachments
        field={props.field}
        application={application}
        errors={props.errors}
      />
    </FormScreen>
  )
}
