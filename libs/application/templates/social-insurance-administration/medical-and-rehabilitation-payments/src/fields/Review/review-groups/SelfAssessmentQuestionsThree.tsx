import { NO, YES } from '@island.is/application/core'
import {
  DataValue,
  RadioValue,
  ReviewGroup,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getApplicationAnswers } from '../../../utils/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'

export const SelfAssessmentQuestionsThree = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const {
    mainProblem,
    hasPreviouslyReceivedRehabilitationOrTreatment,
    previousRehabilitationOrTreatment,
    previousRehabilitationSuccessful,
    previousRehabilitationSuccessfulFurtherExplanations,
  } = getApplicationAnswers(application.answers)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('selfAssessmentQuestionsThree')}
    >
      <Stack space={3}>
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '12/12']}>
            <DataValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                  .mainProblemTitle,
              )}
              value={mainProblem}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="12/12">
            <RadioValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                  .hasPreviouslyReceivedRehabilitationOrTreatment,
              )}
              value={hasPreviouslyReceivedRehabilitationOrTreatment}
            />
          </GridColumn>
        </GridRow>
        {hasPreviouslyReceivedRehabilitationOrTreatment === YES && (
          <>
            <GridRow>
              <GridColumn span="12/12">
                <DataValue
                  label={formatMessage(
                    medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                      .previousRehabilitationOrTreatment,
                  )}
                  value={previousRehabilitationOrTreatment}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="12/12">
                <RadioValue
                  label={formatMessage(
                    medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                      .previousRehabilitationSuccessful,
                  )}
                  value={previousRehabilitationSuccessful}
                />
              </GridColumn>
            </GridRow>
            {(previousRehabilitationSuccessful === YES ||
              previousRehabilitationSuccessful === NO) && (
              <GridRow>
                <GridColumn span="12/12">
                  <DataValue
                    label={formatMessage(
                      medicalAndRehabilitationPaymentsFormMessage.selfAssessment
                        .previousRehabilitationSuccessfulFurtherExplanations,
                    )}
                    value={previousRehabilitationSuccessfulFurtherExplanations}
                  />
                </GridColumn>
              </GridRow>
            )}
          </>
        )}
      </Stack>
    </ReviewGroup>
  )
}
