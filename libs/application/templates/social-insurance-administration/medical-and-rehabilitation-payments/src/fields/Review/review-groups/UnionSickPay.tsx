import { formatText, YES } from '@island.is/application/core'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { NOT_APPLICABLE } from '../../../lib/constants'
import {
  getApplicationAnswers,
  getYesNoNotApplicableTranslation,
} from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'

export const UnionSickPay = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate } = useLocale()

  const {
    hasUtilizedUnionSickPayRights,
    unionSickPayEndDate,
    unionNationalId,
  } = getApplicationAnswers(application.answers)

  //TODO: Get the name of the union from the API

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('unionSickPay')}
    >
      <Stack space={3}>
        <GridRow rowGap={3}>
          <GridColumn span={['9/12', '9/12', '9/12', '12/12']}>
            <DataValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .unionSickPayTitle,
              )}
              value={formatText(
                getYesNoNotApplicableTranslation(hasUtilizedUnionSickPayRights),
                application,
                formatMessage,
              )}
            />
          </GridColumn>
        </GridRow>
        {hasUtilizedUnionSickPayRights !== NOT_APPLICABLE && (
          <GridRow rowGap={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.generalInformation
                    .unionSickPayUnionSelectTitle,
                )}
                value={unionNationalId}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={
                  hasUtilizedUnionSickPayRights === YES
                    ? formatMessage(
                        medicalAndRehabilitationPaymentsFormMessage.shared
                          .sickPayDidEndDate,
                      )
                    : formatMessage(
                        medicalAndRehabilitationPaymentsFormMessage.shared
                          .sickPayDoesEndDate,
                      )
                }
                value={formatDate(unionSickPayEndDate)}
              />
            </GridColumn>
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
