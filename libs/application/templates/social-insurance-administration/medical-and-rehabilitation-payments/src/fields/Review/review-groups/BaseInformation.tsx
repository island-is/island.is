import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { DataValue, ReviewGroup } from '@island.is/application/ui-components'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { format as formatKennitala } from 'kennitala'
import { formatNumber } from 'libphonenumber-js'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../../../utils/medicalAndRehabilitationPaymentsUtils'
import { ReviewGroupProps } from './props'

export const BaseInformation = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()
  const { applicantPhonenumber } = getApplicationAnswers(application.answers)
  const {
    applicantName,
    applicantNationalId,
    applicantAddress,
    applicantMunicipality,
    userProfileEmail,
    spouseName,
    spouseNationalId,
  } = getApplicationExternalData(application.externalData)

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('applicantInfo')}
    >
      <Stack space={3}>
        {applicantName !== '' && (
          <GridRow rowGap={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.confirm.name,
                )}
                value={applicantName}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.confirm.nationalId,
                )}
                value={formatKennitala(applicantNationalId)}
              />
            </GridColumn>
          </GridRow>
        )}
        <GridRow rowGap={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                socialInsuranceAdministrationMessage.confirm.address,
              )}
              value={applicantAddress}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                socialInsuranceAdministrationMessage.confirm.municipality,
              )}
              value={applicantMunicipality}
            />
          </GridColumn>
        </GridRow>
        <GridRow rowGap={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
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
        {spouseName && (
          <GridRow rowGap={3}>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.info.applicantSpouseName,
                )}
                value={spouseName}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
              <DataValue
                label={formatMessage(
                  socialInsuranceAdministrationMessage.confirm.nationalId,
                )}
                value={formatKennitala(spouseNationalId)}
              />
            </GridColumn>
          </GridRow>
        )}
      </Stack>
    </ReviewGroup>
  )
}
