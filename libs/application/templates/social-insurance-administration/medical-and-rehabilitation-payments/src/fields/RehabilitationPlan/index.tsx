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
import parseISO from 'date-fns/parseISO'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { siaRehabilitationPlanQuery } from '../../graphql/queries'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { SiaRehabilitationPlanQuery } from '../../types/schema'
import { getApplicationAnswers } from '../../utils/medicalAndRehabilitationPaymentsUtils'
import { ManagedBy } from '../components/ManagedBy'

export const RehabilitationPlan: FC<FieldBaseProps> = ({
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
    error: rehabilitationPlanError,
  } = useQuery<SiaRehabilitationPlanQuery>(siaRehabilitationPlanQuery)

  setBeforeSubmitCallback?.(async () => {
    const { rehabilitationPlanConfirmation } = getApplicationAnswers(
      application.answers,
    )

    // If the user confirmed the rehabilitation plan, allow submission
    if (rehabilitationPlanConfirmation?.includes(YES)) {
      return [true, null]
    }

    // If data is still loading or there's an error, prevent submission
    if (loading || rehabilitationPlanError) {
      return [false, '']
    }

    // In all other cases, allow submission
    return [true, null]
  })

  const getEvaluationScaleName = (value: number) => {
    return data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation?.evaluationScale?.find(
      (evaluation) => evaluation.value === value,
    )?.display
  }

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
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .informationCurrentPosition,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceRehabilitationPlan?.applicantEmploymentStatus
                ?.display
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.shared.applyingFor,
            )}
          </Label>
          <Text>{data?.socialInsuranceRehabilitationPlan?.typeAppliedFor}</Text>
        </GridColumn>
        {data?.socialInsuranceRehabilitationPlan?.followUpEvaluation
          ?.rehabilitationProgress?.display && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .informationProgress,
              )}
            </Label>
            <Text>
              {
                data.socialInsuranceRehabilitationPlan.followUpEvaluation
                  .rehabilitationProgress.display
              }
            </Text>
          </GridColumn>
        )}
        {data?.socialInsuranceRehabilitationPlan?.followUpEvaluation
          ?.rehabilitationProgressDetails && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .informationExplanationOfProgress,
              )}
            </Label>
            <Text>
              {
                data.socialInsuranceRehabilitationPlan.followUpEvaluation
                  .rehabilitationProgressDetails
              }
            </Text>
          </GridColumn>
        )}
        {data?.socialInsuranceRehabilitationPlan?.followUpEvaluation
          ?.rehabilitationMeasuresProgress?.display && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .informationAttendance,
              )}
            </Label>
            <Text>
              {
                data.socialInsuranceRehabilitationPlan.followUpEvaluation
                  .rehabilitationMeasuresProgress.display
              }
            </Text>
          </GridColumn>
        )}
        {data?.socialInsuranceRehabilitationPlan?.followUpEvaluation
          ?.rehabilitationMeasuresProgressDetails && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .informationExplanationOfAttendance,
              )}
            </Label>
            <Text>
              {
                data.socialInsuranceRehabilitationPlan.followUpEvaluation
                  .rehabilitationMeasuresProgressDetails
              }
            </Text>
          </GridColumn>
        )}
        {data?.socialInsuranceRehabilitationPlan?.followUpEvaluation
          ?.rehabilitationChanges?.display && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .informationChange,
              )}
            </Label>
            <Text>
              {
                data.socialInsuranceRehabilitationPlan.followUpEvaluation
                  .rehabilitationChanges.display
              }
            </Text>
          </GridColumn>
        )}
        {data?.socialInsuranceRehabilitationPlan?.followUpEvaluation
          ?.rehabilitationChangesDetails && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .informationExplanationOfChange,
              )}
            </Label>
            <Text>
              {
                data.socialInsuranceRehabilitationPlan.followUpEvaluation
                  .rehabilitationChangesDetails
              }
            </Text>
          </GridColumn>
        )}
        {data?.socialInsuranceRehabilitationPlan?.followUpEvaluation
          ?.applicantCircumstancesChanges?.display && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .informationApplicantCircumstancesChanges,
              )}
            </Label>
            <Text>
              {
                data.socialInsuranceRehabilitationPlan.followUpEvaluation
                  .applicantCircumstancesChanges.display
              }
            </Text>
          </GridColumn>
        )}
        {data?.socialInsuranceRehabilitationPlan?.followUpEvaluation
          ?.applicantCircumstancesChangesDetails && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .informationExplanationOfApplicantCircumstancesChanges,
              )}
            </Label>
            <Text>
              {
                data.socialInsuranceRehabilitationPlan.followUpEvaluation
                  .applicantCircumstancesChangesDetails
              }
            </Text>
          </GridColumn>
        )}
      </GridRow>
    </Stack>
  )

  const comprehensiveAssessment = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessment,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .comprehensiveAssessmentTooltip,
                )}
              />
            </Box>
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessmentLearningAndApplyingKnowledge,
            )}
          </Label>
          <Text>
            {getEvaluationScaleName(
              data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation
                ?.learningAndApplyingKnowledge ?? 0,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessmentGeneralTasksAndRequirements,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .comprehensiveAssessmentGeneralTasksAndRequirementsTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {getEvaluationScaleName(
              data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation
                ?.generalTasksAndDemands ?? 0,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessmentCommunicationAndRelationships,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .comprehensiveAssessmentCommunicationAndRelationshipsTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {getEvaluationScaleName(
              data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation
                ?.communicationAndRelationships ?? 0,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessmentMobility,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .comprehensiveAssessmentMobilityTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {getEvaluationScaleName(
              data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation
                ?.mobility ?? 0,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessmentSelfCare,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .comprehensiveAssessmentSelfCareTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {getEvaluationScaleName(
              data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation
                ?.selfCare ?? 0,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessmentDomesticLife,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .comprehensiveAssessmentDomesticLifeTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {getEvaluationScaleName(
              data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation
                ?.domesticLife ?? 0,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessmentDailyLife,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .comprehensiveAssessmentDailyLifeTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {getEvaluationScaleName(
              data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation
                ?.mainDailyLifeAreas ?? 0,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessmentLeisureAndInterests,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                    .comprehensiveAssessmentLeisureAndInterestsTooltip,
                )}
              />
            </Box>
          </Label>
          <Text>
            {getEvaluationScaleName(
              data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation
                ?.leisureAndHobbies ?? 0,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                .comprehensiveAssessmentExpression,
            )}
          </Label>
          <Text>
            {getEvaluationScaleName(
              data?.socialInsuranceRehabilitationPlan?.comprehensiveEvaluation
                ?.expression ?? 0,
            )}
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
                  parseISO(data.socialInsuranceRehabilitationPlan.startDate),
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
                  parseISO(
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
      <ManagedBy
        serviceProvider={
          data?.socialInsuranceRehabilitationPlan?.serviceProvider
        }
      />
      <Divider />
      {information()}
      <Divider />
      {comprehensiveAssessment()}
      <Divider />
      {rehabilitationObjective()}
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
                medicalAndRehabilitationPaymentsFormMessage.rehabilitationPlan
                  .confirm,
            },
          ],
        }}
      />
      <input
        type="hidden"
        value={
          data?.socialInsuranceRehabilitationPlan?.referenceId
            ? data.socialInsuranceRehabilitationPlan.referenceId
            : undefined
        }
        {...register(`${field.id}.referenceId`)}
      />
    </Stack>
  )
}
