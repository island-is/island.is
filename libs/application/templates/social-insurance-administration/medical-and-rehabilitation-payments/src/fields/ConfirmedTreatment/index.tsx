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
import { siaConfirmedTreatmentQuery } from '../../graphql/queries'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { SiaConfirmedTreatmentQuery } from '../../types/schema'
import { getApplicationAnswers } from '../../utils/medicalAndRehabilitationPaymentsUtils'
import { Markdown } from '@island.is/shared/components'

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
  } = useQuery<SiaConfirmedTreatmentQuery>(siaConfirmedTreatmentQuery)

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
            {data?.socialInsuranceConfirmedTreatment?.caseManager?.name}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.jobTitle,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmedTreatment?.caseManager?.jobTitle}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.location,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmedTreatment?.caseManager?.workplace}
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
              medicalAndRehabilitationPaymentsFormMessage.shared
                .dateOfConfirmation,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmedTreatment?.confirmationDate
              ? format(
                  new Date(
                    data.socialInsuranceConfirmedTreatment.confirmationDate,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.confirmedTreatment
                .informationFurtherExplanationOfPreviousTreatment,
            )}
          </Label>
          <Text>
            {/* If this value is empty, insert the text "Not applicable" */}
            {data?.socialInsuranceConfirmedTreatment?.previousTreatment
              ?.description
              ? data.socialInsuranceConfirmedTreatment.previousTreatment
                  .description
              : formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.shared
                    .notApplicable,
                )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.confirmedTreatment
                .informationInformationRegardingTreatment,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceConfirmedTreatment?.previousTreatment?.type
                ?.display
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.confirmedTreatment
                .informationTreatmentType,
            )}
          </Label>
          <Markdown>
            {data?.socialInsuranceConfirmedTreatment?.treatmentPlan?.treatmentType
              ?.map((type) => '* ' + type.display)
              ?.join('\n\n') ?? ''}
          </Markdown>
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
              medicalAndRehabilitationPaymentsFormMessage.shared
                .startOfTreatment,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceConfirmedTreatment?.estimatedDuration?.start
              ? format(
                  new Date(
                    data.socialInsuranceConfirmedTreatment.estimatedDuration.start,
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
            {data?.socialInsuranceConfirmedTreatment?.estimatedDuration?.end
              ? format(
                  new Date(
                    data.socialInsuranceConfirmedTreatment.estimatedDuration.end,
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
                  data?.socialInsuranceConfirmedTreatment?.estimatedDuration
                    ?.months,
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
          data?.socialInsuranceConfirmedTreatment?.referenceId
            ? data.socialInsuranceConfirmedTreatment.referenceId
            : undefined
        }
        {...register(`${field.id}.referenceId`)}
      />
    </Stack>
  )
}
