import { useQuery } from '@apollo/client'
import { coreErrorMessages, YES } from '@island.is/application/core'
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
  Box,
  Divider,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import format from 'date-fns/format'
import { FC } from 'react'
import { siaRehabilitationPlanQuery } from '../../graphql/queries'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { SiaRehabilitationPlanQuery } from '../../types/schema'

export const RehabilitationPlan: FC<FieldBaseProps> = ({
  application,
  field,
  error,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()

  const {
    data,
    loading,
    error: rehabilitationPlanError,
  } = useQuery<SiaRehabilitationPlanQuery>(siaRehabilitationPlanQuery)

  setBeforeSubmitCallback?.(async () => {
    if (loading || rehabilitationPlanError) {
      return [false, '']
    }
    return [true, null]
  })

  const serviceProvider = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .serviceProvider,
              {
                serviceProvider:
                  data?.socialInsuranceRehabilitationPlan?.serviceProvider
                    ?.serviceProviderName,
              },
            )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .serviceProviderLocation,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceRehabilitationPlan?.serviceProvider
                ?.workplace
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              socialInsuranceAdministrationMessage.info.applicantPhonenumber,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceRehabilitationPlan?.serviceProvider
                ?.phoneNumber
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .serviceProviderRehabilitationProvider,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceRehabilitationPlan?.serviceProvider
                ?.coordinatorName
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .serviceProviderJobTitle,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceRehabilitationPlan?.serviceProvider
                ?.coordinatorTitle
            }
          </Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  const rehabilitationObjective = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjective,
            )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjectiveStart,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceRehabilitationPlan?.startDate
              ? format(
                  new Date(data.socialInsuranceRehabilitationPlan.startDate),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjectiveEstimatedEnd,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceRehabilitationPlan?.plannedEndDate
              ? format(
                  new Date(
                    data.socialInsuranceRehabilitationPlan.plannedEndDate,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjectiveEmphasisAndAim,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceRehabilitationPlan
                ?.rehabilitationFocusAndStrategy
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjectivePhysicalHealthGoals,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .rehabilitationObjectivePhysicalHealthGoalsTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {
              data?.socialInsuranceRehabilitationPlan?.physicalHealthGoals
                ?.goalDescription
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjectivePhysicalHealthResources,
            )}
          </Label>
          <Markdown>
            {data?.socialInsuranceRehabilitationPlan?.physicalHealthGoals?.measures
              ?.map((value) => '* ' + value)
              ?.join('\n\n') ?? ''}
          </Markdown>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjectiveMentalHealthGoals,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .rehabilitationObjectiveMentalHealthGoalsTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {
              data?.socialInsuranceRehabilitationPlan?.mentalHealthGoals
                ?.goalDescription
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjectiveMentalHealthResources,
            )}
          </Label>
          <Markdown>
            {data?.socialInsuranceRehabilitationPlan?.mentalHealthGoals?.measures
              ?.map((value) => '* ' + value)
              ?.join('\n\n') ?? ''}
          </Markdown>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjectiveActivityAndParticipationGoals,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .rehabilitationObjectiveActivityAndParticipationGoalsTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {
              data?.socialInsuranceRehabilitationPlan
                ?.activityAndParticipationGoals?.goalDescription
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .rehabilitationObjectiveActivityAndParticipationResources,
            )}
          </Label>
          <Markdown>
            {data?.socialInsuranceRehabilitationPlan?.activityAndParticipationGoals?.measures
              ?.map((value) => '* ' + value)
              ?.join('\n\n') ?? ''}
          </Markdown>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  if (loading) {
    return (
      <SkeletonLoader repeat={2} space={2} height={150} borderRadius="large" />
    )
  }

  if (rehabilitationPlanError) {
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
      {serviceProvider()}
      <Divider />
      {rehabilitationObjective()}
      <CheckboxFormField
        application={application}
        error={error}
        field={{
          id: field.id,
          large: true,
          backgroundColor: 'blue',
          type: FieldTypes.CHECKBOX,
          component: FieldComponents.CHECKBOX,
          children: undefined,
          options: [
            {
              value: YES,
              label:
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .confirm,
            },
          ],
        }}
      />
    </Stack>
  )
}
