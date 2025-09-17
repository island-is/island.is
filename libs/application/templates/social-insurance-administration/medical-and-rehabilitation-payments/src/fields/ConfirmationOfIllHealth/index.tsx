import { useQuery } from '@apollo/client'
import {
  coreErrorMessages,
  getErrorViaPath,
  YES,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { Label } from '@island.is/application/ui-components'
import { CheckboxFormField } from '@island.is/application/ui-fields'
import {
  AlertMessage,
  Divider,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { siaConfirmationOfIllHealthQuery } from '../../graphql/queries'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { SiaConfirmationOfIllHealthQuery } from '../../types/schema'
import { getApplicationAnswers } from '../../utils/medicalAndRehabilitationPaymentsUtils'
import { ManagedBy } from '../components/ManagedBy'

export const ConfirmationOfIllHealth: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()

  const {
    data,
    loading,
    error: confirmationOfIllHealthError,
  } = useQuery<SiaConfirmationOfIllHealthQuery>(siaConfirmationOfIllHealthQuery)

  setBeforeSubmitCallback?.(async () => {
    const { confirmationOfIllHealthConfirmation } = getApplicationAnswers(
      application.answers,
    )

    // If the user confirmed the confirmation of ill health, allow submission
    if (confirmationOfIllHealthConfirmation?.includes(YES)) {
      return [true, null]
    }

    // If data is still loading or there's an error, prevent submission
    if (loading || confirmationOfIllHealthError) {
      return [false, '']
    }

    // In all other cases, allow submission
    return [true, null]
  })

  const information = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.information,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared
                .dateOfConfirmation,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmationOfIllHealth?.created
              ? format(
                  parseISO(data.socialInsuranceConfirmationOfIllHealth.created),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .confirmationOfIllHealth.informationCurrentMedicalStatus,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmationOfIllHealth?.currentMedicalStatus
              ? data.socialInsuranceConfirmationOfIllHealth.currentMedicalStatus
              : formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.shared
                    .notApplicable,
                )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared
                .hasPreviousApproval,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmationOfIllHealth?.previousApplication
              ?.hasPreviousApproval
              ? formatMessage(socialInsuranceAdministrationMessage.shared.yes)
              : formatMessage(socialInsuranceAdministrationMessage.shared.no)}
          </Text>
        </GridColumn>
        {data?.socialInsuranceConfirmationOfIllHealth?.previousApplication
          ?.hasPreviousApproval && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.shared
                  .previousApplicationDetails,
              )}
            </Label>
            <Text>
              {
                data?.socialInsuranceConfirmationOfIllHealth
                  ?.previousApplication?.additionalDetails
              }
            </Text>
          </GridColumn>
        )}
      </GridRow>
    </Stack>
  )

  const applicationForMedicalAndRehabilitationPayments = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.application,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.applyingFor,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmationOfIllHealth?.typeAppliedFor}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/3']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .confirmationOfIllHealth.applicationStartOfIllHealth,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmationOfIllHealth?.requestedPeriod
              ?.startDate
              ? format(
                  parseISO(
                    data.socialInsuranceConfirmationOfIllHealth.requestedPeriod
                      .startDate,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/3']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .confirmationOfIllHealth.applicationEstimatedEnd,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmationOfIllHealth?.requestedPeriod
              ?.endDate
              ? format(
                  parseISO(
                    data.socialInsuranceConfirmationOfIllHealth.requestedPeriod
                      .endDate,
                  ),
                  'dd.MM.yyyy',
                )
              : formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.shared
                    .estimatedTimeUnclear,
                )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/3']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.estimatedTime,
            )}
          </Label>
          <Text>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared
                .estimatedTimeMonths,
              {
                months:
                  data?.socialInsuranceConfirmationOfIllHealth?.requestedPeriod
                    ?.totalRequestedMonths,
              },
            )}
          </Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  if (loading) {
    return (
      <SkeletonLoader repeat={2} space={2} height={150} borderRadius="large" />
    )
  }

  if (confirmationOfIllHealthError) {
    return (
      <AlertMessage
        type="error"
        title={formatMessage(
          socialInsuranceAdministrationMessage.shared.alertTitle,
        )}
        message={formatMessage(coreErrorMessages.failedDataProvider)}
      />
    )
  }

  return (
    <Stack space={4}>
      <ManagedBy
        serviceProvider={
          data?.socialInsuranceConfirmationOfIllHealth?.serviceProvider
        }
      />
      <Divider />
      {information()}
      <Divider />
      {applicationForMedicalAndRehabilitationPayments()}
      <CheckboxFormField
        application={application}
        error={errors && getErrorViaPath(errors, `${field.id}.confirmation`)}
        field={{
          id: `${field.id}.confirmation`,
          large: true,
          backgroundColor: 'blue',
          type: FieldTypes.CHECKBOX,
          component: FieldComponents.CHECKBOX,
          children: undefined,
          options: [
            {
              value: YES,
              label:
                medicalAndRehabilitationPaymentsFormMessage.shared
                  .confirmationConfirm,
            },
          ],
        }}
      />
      <input
        type="hidden"
        value={
          data?.socialInsuranceConfirmationOfIllHealth?.referenceId
            ? data.socialInsuranceConfirmationOfIllHealth.referenceId
            : undefined
        }
        {...register(`${field.id}.referenceId`)}
      />
    </Stack>
  )
}
