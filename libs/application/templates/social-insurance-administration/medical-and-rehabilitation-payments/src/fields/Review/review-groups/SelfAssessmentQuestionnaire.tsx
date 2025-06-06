import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'

export const SelfAssessmentQuestionnaire = ({
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('selfAssessmentQuestionnaire')}
    >
      <GridRow>
        <GridColumn span="9/12">
          <DataValue
            label={formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.selfAssessment.title,
            )}
            value={formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.overview
                .selfAssessmentConfirmed,
            )}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
