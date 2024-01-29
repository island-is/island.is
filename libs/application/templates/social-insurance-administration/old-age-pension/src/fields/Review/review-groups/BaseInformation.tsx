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
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const BaseInformation = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const {
    userProfileEmail,
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
  } = getApplicationExternalData(application.externalData)
  const { applicantPhonenumber } = getApplicationAnswers(application.answers)
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
              label={formatMessage(
                socialInsuranceAdministrationMessage.confirm.name,
              )}
              value={applicantName}
            />
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '5/12']}
            paddingBottom={3}
          >
            <DataValue
              label={formatMessage(
                socialInsuranceAdministrationMessage.confirm.nationalId,
              )}
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
            label={formatMessage(
              oldAgePensionFormMessage.applicant.applicantInfoMunicipality,
            )}
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
            label={formatMessage(
              socialInsuranceAdministrationMessage.info.applicantEmail,
            )}
            value={userProfileEmail}
          />
        </GridColumn>

        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(
              socialInsuranceAdministrationMessage.info.applicantPhonenumber,
            )}
            value={formatNumber(applicantPhonenumber, 'International')}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
