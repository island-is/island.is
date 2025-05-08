import {
  DataValue,
  ReviewGroup,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { parentalLeaveFormMessages } from '../../../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../lib/parentalLeaveUtils'
import { ReviewGroupProps } from './props'

export const BaseInformation = ({
  application,
  editable,
  goToScreen,
  hasError,
}: ReviewGroupProps) => {
  const { applicantEmail, applicantPhoneNumber } = getApplicationAnswers(
    application.answers,
  )

  const { applicantName } = getApplicationExternalData(application.externalData)
  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isEditable={editable}
      editAction={() => goToScreen?.('infoSection')}
    >
      <Stack space={2}>
        {applicantName !== '' && (
          <GridRow rowGap={2}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.applicant.fullName,
                )}
                value={applicantName ?? ''}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  parentalLeaveFormMessages.applicant.nationalId,
                )}
                value={formatKennitala(application.applicant) ?? ''}
              />
            </GridColumn>
          </GridRow>
        )}

        <GridRow rowGap={2}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(parentalLeaveFormMessages.applicant.email)}
              value={applicantEmail ?? ''}
              error={hasError('applicant.email')}
            />
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.applicant.phoneNumber,
              )}
              value={formatPhoneNumber(applicantPhoneNumber) ?? ''}
              error={hasError('applicant.phoneNumber')}
            />
          </GridColumn>
        </GridRow>
      </Stack>
    </ReviewGroup>
  )
}
