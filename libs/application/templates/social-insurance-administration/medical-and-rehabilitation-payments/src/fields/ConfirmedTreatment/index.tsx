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
import { siaConfirmedTreatmentQuery } from '../../graphql/queries'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { Query } from '@island.is/api/schema'
import { getApplicationAnswers } from '../../utils/medicalAndRehabilitationPaymentsUtils'
import { ManagedBy } from '../components/ManagedBy'

export const ConfirmedTreatment: FC<FieldBaseProps> = ({
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
    error: confirmedTreatmentError,
  } = useQuery<Query>(siaConfirmedTreatmentQuery)

  setBeforeSubmitCallback?.(async () => {
    const { confirmedTreatmentConfirmation } = getApplicationAnswers(
      application.answers,
    )

    // If the user confirmed the confirmed treatment, allow submission
    if (confirmedTreatmentConfirmation?.includes(YES)) {
      return [true, null]
    }

    // If data is still loading or there's an error, prevent submission
    if (loading || confirmedTreatmentError) {
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
            {data?.socialInsuranceConfirmedTreatment?.created
              ? format(
                  parseISO(data.socialInsuranceConfirmedTreatment.created),
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
            {data?.socialInsuranceConfirmedTreatment?.requestedTreatment?.treatmentTypes
              ?.map((value, index) => `${index + 1}. ${value.display}`)
              ?.join('\n\n') ?? ''}
          </Markdown>
        </GridColumn>
        {data?.socialInsuranceConfirmedTreatment?.requestedTreatment
          ?.otherTreatmentDescription && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.shared
                  .otherTreatmentDescription,
              )}
            </Label>
            <Text>
              {
                data?.socialInsuranceConfirmedTreatment?.requestedTreatment
                  ?.otherTreatmentDescription
              }
            </Text>
          </GridColumn>
        )}
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared
                .hasPreviousApproval,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmedTreatment?.previousApplication
              ?.hasPreviousApproval
              ? formatMessage(socialInsuranceAdministrationMessage.shared.yes)
              : formatMessage(socialInsuranceAdministrationMessage.shared.no)}
          </Text>
        </GridColumn>
        {data?.socialInsuranceConfirmedTreatment?.previousApplication
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
                data?.socialInsuranceConfirmedTreatment?.previousApplication
                  ?.additionalDetails
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
          <Text>{data?.socialInsuranceConfirmedTreatment?.typeAppliedFor}</Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/3']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared
                .startOfTreatment,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmedTreatment?.requestedPeriod?.startDate
              ? format(
                  parseISO(
                    data.socialInsuranceConfirmedTreatment.requestedPeriod
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
              medicalAndRehabilitationPaymentsFormMessage.shared
                .estimatedEndOfTreatment,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmedTreatment?.requestedPeriod?.endDate
              ? format(
                  parseISO(
                    data.socialInsuranceConfirmedTreatment.requestedPeriod
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
                  data?.socialInsuranceConfirmedTreatment?.requestedPeriod
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

  if (confirmedTreatmentError) {
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
          data?.socialInsuranceConfirmedTreatment?.serviceProvider
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
          data?.socialInsuranceConfirmedTreatment?.referenceId
            ? data.socialInsuranceConfirmedTreatment.referenceId
            : undefined
        }
        {...register(`${field.id}.referenceId`)}
      />
    </Stack>
  )
}
