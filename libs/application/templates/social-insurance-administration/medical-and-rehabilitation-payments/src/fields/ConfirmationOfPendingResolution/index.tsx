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
import { Markdown } from '@island.is/shared/components'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { siaConfirmationOfPendingResolutionQuery } from '../../graphql/queries'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { Query } from '@island.is/api/schema'
import { getApplicationAnswers } from '../../utils/medicalAndRehabilitationPaymentsUtils'
import { ManagedBy } from '../components/ManagedBy'

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
  } = useQuery<Query>(siaConfirmationOfPendingResolutionQuery)

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
            {data?.socialInsuranceConfirmationOfPendingResolution?.created
              ? format(
                  parseISO(
                    data.socialInsuranceConfirmationOfPendingResolution.created,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.treatmentTypes,
            )}
          </Label>
          <Markdown>
            {data?.socialInsuranceConfirmationOfPendingResolution?.requestedTreatment?.treatmentTypes
              ?.map((value, index) => `${index + 1}. ${value.display}`)
              ?.join('\n\n') ?? ''}
          </Markdown>
        </GridColumn>
        {data?.socialInsuranceConfirmationOfPendingResolution
          ?.requestedTreatment?.otherTreatmentDescription && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.shared
                  .otherTreatmentDescription,
              )}
            </Label>
            <Text>
              {
                data?.socialInsuranceConfirmationOfPendingResolution
                  ?.requestedTreatment?.otherTreatmentDescription
              }
            </Text>
          </GridColumn>
        )}
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
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared
                .hasPreviousApproval,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmationOfPendingResolution
              ?.previousApplication?.hasPreviousApproval
              ? formatMessage(socialInsuranceAdministrationMessage.shared.yes)
              : formatMessage(socialInsuranceAdministrationMessage.shared.no)}
          </Text>
        </GridColumn>
        {data?.socialInsuranceConfirmationOfPendingResolution
          ?.previousApplication?.hasPreviousApproval && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.shared
                  .previousApplicationDetails,
              )}
            </Label>
            <Text>
              {
                data?.socialInsuranceConfirmationOfPendingResolution
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
            {
              data?.socialInsuranceConfirmationOfPendingResolution
                ?.typeAppliedFor
            }
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
                  parseISO(
                    data.socialInsuranceConfirmationOfPendingResolution
                      .requestedPeriod.startDate,
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
                  parseISO(
                    data.socialInsuranceConfirmationOfPendingResolution
                      .requestedPeriod.endDate,
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
      <ManagedBy
        serviceProvider={
          data?.socialInsuranceConfirmationOfPendingResolution?.serviceProvider
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
          data?.socialInsuranceConfirmationOfPendingResolution?.referenceId
            ? data.socialInsuranceConfirmationOfPendingResolution.referenceId
            : undefined
        }
        {...register(`${field.id}.referenceId`)}
      />
    </Stack>
  )
}
