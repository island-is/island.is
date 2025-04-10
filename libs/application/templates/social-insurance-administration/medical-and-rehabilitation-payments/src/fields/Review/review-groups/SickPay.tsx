import { formatText, YES, YesOrNoEnum } from '@island.is/application/core'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  getApplicationAnswers,
  getYesNoNotApplicableTranslation,
} from '../../../lib/medicalAndRehabilitationPaymentsUtils'
import { ReviewGroupProps } from './props'

import { NOT_APPLICABLE } from '../../../lib/constants'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../../lib/messages'

export const SickPay = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage, formatDate } = useLocale()

  const { sickPayOption, sickPayDoesEndDate, sickPayDidEndDate } =
    getApplicationAnswers(application.answers)

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('sickPay')}
    >
      <Stack space={2}>
        <GridRow rowGap={2}>
          <GridColumn span={['9/12', '9/12', '9/12', '12/12']}>
            <DataValue
              label={formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.generalInformation
                  .sickPayTitle,
              )}
              value={formatText(
                getYesNoNotApplicableTranslation(sickPayOption),
                application,
                formatMessage,
              )}
            />
          </GridColumn>
        </GridRow>
        {sickPayOption !== NOT_APPLICABLE && (
          <GridRow rowGap={2}>
            <GridColumn span={'12/12'}>
              <DataValue
                label={
                  sickPayOption === YES
                    ? formatMessage(
                        medicalAndRehabilitationPaymentsFormMessage.shared
                          .sickPayDidEndDate,
                      )
                    : formatMessage(
                        medicalAndRehabilitationPaymentsFormMessage.shared
                          .sickPayDoesEndDate,
                      )
                }
                value={
                  sickPayOption === YesOrNoEnum.YES
                    ? formatDate(sickPayDidEndDate)
                    : formatDate(sickPayDoesEndDate)
                }
              />
            </GridColumn>
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
