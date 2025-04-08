import { formatText, YES, YesOrNoEnum } from '@island.is/application/core'
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

export const EmployeeSickPay = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate } = useLocale()

  const {
    employeeSickPayOption,
    employeeSickPayDoesEndDate,
    employeeSickPayDidEndDate,
  } = getApplicationAnswers(application.answers)

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
              value={formatText(
                getYesNoNotApplicableTranslation(employeeSickPayOption),
                application,
                formatMessage,
              )}
            />
          </GridColumn>
        </GridRow>
        {employeeSickPayOption !== NOT_APPLICABLE && (
          <GridRow>
            <GridColumn span="12/12">
              <DataValue
                label={
                  employeeSickPayOption === YES
                    ? formatMessage(
                        medicalAndRehabilitationPaymentsFormMessage.overview
                          .sickPayDidEndDate,
                      )
                    : formatMessage(
                        medicalAndRehabilitationPaymentsFormMessage.overview
                          .sickPayDoesEndDate,
                      )
                }
                value={
                  employeeSickPayOption === YesOrNoEnum.YES
                    ? formatDate(employeeSickPayDidEndDate)
                    : formatDate(employeeSickPayDoesEndDate)
                }
              />
            </GridColumn>
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
