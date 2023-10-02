import {
  DataValue,
  ReviewGroup,
  formatPhoneNumber,
} from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { getApplicationExternalData } from '../../../lib/parentalLeaveUtils'
import { useStatefulAnswers } from '../../../hooks/useStatefulAnswers'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../..'
import { format as formatKennitala } from 'kennitala'
import { ReviewGroupProps } from './props'

export const BaseInformation = ({
  application,
  editable,
  groupHasNoErrors,
  hasError,
}: ReviewGroupProps) => {
  const [{ applicantEmail, applicantPhoneNumber }, setStateful] =
    useStatefulAnswers(application)

  const { applicantName } = getApplicationExternalData(application.externalData)

  const { formatMessage } = useLocale()

  return (
    <ReviewGroup
      isEditable={editable}
      canCloseEdit={groupHasNoErrors([
        'applicant.email',
        'applicant.phoneNumber',
      ])}
      editChildren={
        <Box marginTop={[8, 8, 8, 0]}>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '12/12', '6/12']}
              paddingBottom={3}
            >
              <InputController
                id="applicant.email"
                name="applicant.email"
                defaultValue={applicantEmail}
                type="email"
                label={formatMessage(parentalLeaveFormMessages.applicant.email)}
                onChange={(e) =>
                  setStateful((prev) => ({
                    ...prev,
                    applicantEmail: e.target.value,
                  }))
                }
                error={hasError('applicant.email')}
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
              <InputController
                id="applicant.phoneNumber"
                name="applicant.phoneNumber"
                defaultValue={applicantPhoneNumber}
                type="tel"
                format="###-####"
                placeholder="000-0000"
                label={formatMessage(
                  parentalLeaveFormMessages.applicant.phoneNumber,
                )}
                onChange={(e) =>
                  setStateful((prev) => ({
                    ...prev,
                    applicantPhoneNumber: e.target.value,
                  }))
                }
                error={hasError('applicant.phoneNumber')}
              />
            </GridColumn>
          </GridRow>
        </Box>
      }
      triggerValidation
    >
      {applicantName !== '' && (
        <GridRow marginBottom={3}>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.applicant.fullName,
              )}
              value={applicantName}
            />
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            <DataValue
              label={formatMessage(
                parentalLeaveFormMessages.applicant.nationalId,
              )}
              value={formatKennitala(application.applicant)}
            />
          </GridColumn>
        </GridRow>
      )}

      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(parentalLeaveFormMessages.applicant.email)}
            value={applicantEmail}
            error={hasError('applicant.email')}
          />
        </GridColumn>

        <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
          <DataValue
            label={formatMessage(
              parentalLeaveFormMessages.applicant.phoneNumber,
            )}
            value={formatPhoneNumber(applicantPhoneNumber)}
            error={hasError('applicant.phoneNumber')}
          />
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}
