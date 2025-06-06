import { YES } from '@island.is/application/core'
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

export const Questions = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate } = useLocale()
  const {
    isSelfEmployed,
    calculatedRemunerationDate,
    isPartTimeEmployed,
    isStudying,
  } = getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('questions')}
    >
      <Stack space={3}>
        <GridRow rowGap={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .questionsIsSelfEmployed,
              )}
              value={isSelfEmployed}
            />
          </GridColumn>
          {isSelfEmployed === YES && (
            <GridColumn span="12/12">
              <DataValue
                label={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.generalInformation
                    .questionsCalculatedRemunerationDate,
                )}
                value={formatDate(calculatedRemunerationDate)}
              />
            </GridColumn>
          )}
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .questionsIsPartTimeEmployed,
              )}
              value={isPartTimeEmployed}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <RadioValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .questionsIsStudying,
              )}
              value={isStudying}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
