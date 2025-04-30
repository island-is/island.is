import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getApplicationAnswers } from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'

export const SelfAssessment = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { gotAssistance, highestLevelOfEducation } = getApplicationAnswers(
    application.answers,
  )

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('selfAssessmentQuestions1')}
    >
      <Stack space={3}>
        <GridRow>
          <GridColumn span="12/12">
            <RadioValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                  .gotAssistance,
              )}
              value={gotAssistance}
            />
          </GridColumn>
        </GridRow>
        <GridRow rowGap={3}>
          <GridColumn span="12/12">
            <DataValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                  .highestlevelOfEducationDescription,
              )}
              value={highestLevelOfEducation}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
