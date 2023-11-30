import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../lib/householdSupplementUtils'
import { householdSupplementFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { formatNumber } from 'libphonenumber-js'

export const BaseInformation = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { applicantEmail, applicantPhonenumber } = getApplicationAnswers(
    application.answers,
  )
  const { applicantName, applicantNationalId } = getApplicationExternalData(
    application.externalData,
  )
  const { formatMessage } = useLocale()
  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('applicantInfo')}
    >
      {applicantName !== '' && (
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '5/12']}
            paddingBottom={3}
          >
            <DataValue
              label={formatMessage(householdSupplementFormMessage.confirm.name)}
              value={applicantName}
            />
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '5/12']}
            paddingBottom={3}
          >
            <DataValue
              label={formatMessage(
                householdSupplementFormMessage.confirm.nationalId,
              )}
              value={formatKennitala(applicantNationalId)}
            />
          </GridColumn>
        </GridRow>
      )}

      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12']}
          paddingBottom={[3, 3, 3, 0]}
        >
          <DataValue
            label={formatMessage(householdSupplementFormMessage.confirm.email)}
            value={applicantEmail}
          />
        </GridColumn>

        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(
              householdSupplementFormMessage.confirm.phonenumber,
            )}
            value={formatNumber(applicantPhonenumber, 'International')}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
