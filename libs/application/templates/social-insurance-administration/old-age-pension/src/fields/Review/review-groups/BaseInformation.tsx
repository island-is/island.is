import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../lib/oldAgePensionUtils'
import { oldAgePensionFormMessage } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { formatNumber } from 'libphonenumber-js'

export const BaseInformation = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    spouseName,
    spouseNationalId,
  } = getApplicationExternalData(application.externalData)
  const { applicantEmail, applicantPhonenumber } = getApplicationAnswers(
    application.answers,
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
              label={formatMessage(oldAgePensionFormMessage.review.name)}
              value={applicantName}
            />
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '5/12']}
            paddingBottom={3}
          >
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.nationalId)}
              value={formatKennitala(applicantNationalId)}
            />
          </GridColumn>
        </GridRow>
      )}

      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12']}
          paddingBottom={3}
        >
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.address)}
            value={applicantAddress}
          />
        </GridColumn>

        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12']}
          paddingBottom={3}
        >
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.municipality)}
            value={applicantMunicipality}
          />
        </GridColumn>
      </GridRow>

      <GridRow>
        <GridColumn
          span={['12/12', '12/12', '12/12', '5/12']}
          paddingBottom={[3, 3, 3, 0]}
        >
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.email)}
            value={applicantEmail}
          />
        </GridColumn>

        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(oldAgePensionFormMessage.review.phonenumber)}
            value={formatNumber(applicantPhonenumber, 'International')}
          />
        </GridColumn>
      </GridRow>

      {spouseName && (
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']} paddingTop={3}>
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.spouseName)}
              value={spouseName}
            />
          </GridColumn>

          <GridColumn span={['12/12', '12/12', '12/12', '5/12']} paddingTop={3}>
            <DataValue
              label={formatMessage(oldAgePensionFormMessage.review.nationalId)}
              value={formatKennitala(spouseNationalId)}
            />
          </GridColumn>
        </GridRow>
      )}
    </ReviewGroup>
  )
}
