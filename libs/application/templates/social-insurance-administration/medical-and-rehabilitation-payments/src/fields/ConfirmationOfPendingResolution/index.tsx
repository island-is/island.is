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
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { siaConfirmationOfPendingResolutionQuery } from '../../graphql/queries'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { SiaConfirmationOfPendingResolutionQuery } from '../../types/schema'
import { getApplicationAnswers } from '../../utils/medicalAndRehabilitationPaymentsUtils'

export const ConfirmationOfPendingResolution: FC<FieldBaseProps> = ({
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
    error: confirmationOfPendingResolutionError,
  } = useQuery<SiaConfirmationOfPendingResolutionQuery>(
    siaConfirmationOfPendingResolutionQuery,
  )

  setBeforeSubmitCallback?.(async () => {
    const { confirmationOfPendingResolutionConfirmation } =
      getApplicationAnswers(application.answers)

    // If the user confirmed the confirmation of pending resolution, allow submission
    if (confirmationOfPendingResolutionConfirmation?.includes(YES)) {
      return [true, null]
    }

    // If data is still loading or there's an error, prevent submission
    if (loading || confirmationOfPendingResolutionError) {
      return [false, '']
    }

    // In all other cases, allow submission
    return [true, null]
  })

  const managedBy = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.managedBy,
            )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(socialInsuranceAdministrationMessage.confirm.name)}
          </Label>
          <Text>
            {
              data?.socialInsuranceConfirmationOfPendingResolution
                ?.serviceProvider?.coordinatorName
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.jobTitle,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceConfirmationOfPendingResolution
                ?.serviceProvider?.coordinatorTitle
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.location,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceConfirmationOfPendingResolution
                ?.serviceProvider?.workplace
            }
          </Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

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
              medicalAndRehabilitationPaymentsFormMessage
                .confirmationOfPendingResolution.informationResources,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceConfirmationOfPendingResolution
                ?.requestedTreatment?.treatmentType?.display
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared
                .furtherExplanation,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceConfirmationOfPendingResolution
                ?.treatmentExplanation
            }
          </Text>
        </GridColumn>
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
        <GridColumn span={['1/1', '1/1', '1/1', '1/3']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .confirmationOfPendingResolution.applicationStartOfWaitingList,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmationOfPendingResolution
              ?.requestedPeriod?.startDate
              ? format(
                  new Date(
                    data.socialInsuranceConfirmationOfPendingResolution.requestedPeriod.startDate,
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
                .confirmationOfPendingResolution
                .applicationEstimatedEndOfWaitPeriod,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmationOfPendingResolution
              ?.requestedPeriod?.endDate
              ? format(
                  new Date(
                    data.socialInsuranceConfirmationOfPendingResolution.requestedPeriod.endDate,
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
              medicalAndRehabilitationPaymentsFormMessage
                .confirmationOfPendingResolution.applicationEstimatedTimeOfWait,
            )}
          </Label>
          <Text>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared
                .estimatedTimeMonths,
              {
                months:
                  data?.socialInsuranceConfirmationOfPendingResolution
                    ?.requestedPeriod?.totalRequestedMonths,
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

  if (confirmationOfPendingResolutionError) {
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
      {managedBy()}
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
          data?.socialInsuranceConfirmationOfPendingResolution?.referenceId
            ? data.socialInsuranceConfirmationOfPendingResolution.referenceId
            : undefined
        }
        {...register(`${field.id}.referenceId`)}
      />
    </Stack>
  )
}
