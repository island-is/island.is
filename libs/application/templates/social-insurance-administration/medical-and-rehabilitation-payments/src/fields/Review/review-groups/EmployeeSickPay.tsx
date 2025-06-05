import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import {
  getApplicationAnswers,
  getSickPayEndDateLabel,
  getYesNoNotApplicableTranslation,
} from '../../../utils/medicalAndRehabilitationPaymentsUtils'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { NOT_APPLICABLE } from '../../../utils/constants'

export const EmployeeSickPay = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate } = useLocale()

  const { hasUtilizedEmployeeSickPayRights, employeeSickPayEndDate } =
    getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('employeeSickPay')}
    >
      <Stack space={3}>
        <GridRow>
          <GridColumn span={['9/12', '9/12', '9/12', '12/12']}>
            <DataValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .employeeSickPayTitle,
              )}
              value={formatMessage(
                getYesNoNotApplicableTranslation(
                  hasUtilizedEmployeeSickPayRights,
                ),
              )}
            />
          </GridColumn>
        </GridRow>
        {hasUtilizedEmployeeSickPayRights !== NOT_APPLICABLE && (
          <GridRow>
            <GridColumn span="12/12">
              <DataValue
                label={formatMessage(
                  getSickPayEndDateLabel(hasUtilizedEmployeeSickPayRights),
                )}
                value={formatDate(employeeSickPayEndDate)}
              />
            </GridColumn>
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
