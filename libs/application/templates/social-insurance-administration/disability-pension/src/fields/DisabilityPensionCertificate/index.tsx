import { useQuery } from '@apollo/client'
import { coreErrorMessages } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { Label } from '@island.is/application/ui-components'
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
import { useFormContext } from 'react-hook-form'
import { SiaDisabilityPensionCertificateQuery } from '../../types/schema'
import { disabilityPensionFormMessage } from '../../lib/messages'

import { siaDisabilityPensionCertificate } from '../../graphql/queries'

export const DisabilityPensionCertificate: FC<FieldBaseProps> = ({
  field,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()

  const { data, loading, error } =
    useQuery<SiaDisabilityPensionCertificateQuery>(
      siaDisabilityPensionCertificate,
    )

  setBeforeSubmitCallback?.(async () => {
    // If data is still loading, prevent submission
    if (loading) {
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
              disabilityPensionFormMessage
                .disabilityPensionCertificate.managedBy,
            )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(socialInsuranceAdministrationMessage.confirm.name)}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.doctor?.name
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.shared.jobTitle,
            )}
          </Label>
          <Text>
            {/* Put doctorNumber here for now - Smári will search for doctor's number and find job title and return it instead */}
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.doctor?.doctorNumber
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate.managedByLocation,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.doctor?.residence
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              socialInsuranceAdministrationMessage.confirm.email
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.doctor?.email
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
              disabilityPensionFormMessage
                .disabilityPensionCertificate.information,
            )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .informationDateOfLastExamination,
            )}
          </Label>
          <Text></Text>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              ?.lastInspectionDate
              ? format(
                  new Date(
                    data.socialInsuranceDisabilityPensionCertificate.lastInspectionDate,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .informationDateOfCertificate,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              ?.certificateDate
              ? format(
                  new Date(
                    data.socialInsuranceDisabilityPensionCertificate.certificateDate,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .informationIncapacitatedDate,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              ?.dateOfWorkIncapacity
              ? format(
                  new Date(
                    data.socialInsuranceDisabilityPensionCertificate.disabilityDate,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
            {'\n\n'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate.informationICDAnalysis,
            )}
          </Label>
          <Markdown>
            {data?.socialInsuranceDisabilityPensionCertificate?.diagnoses?.icd
              ?.map(
                (value, index) =>
                  `${index + 1}. ${value.code} ${value.displayValue}`,
              )
              ?.join('\n\n') ?? ''}
          </Markdown>
        </GridColumn>
        {data?.socialInsuranceDisabilityPensionCertificate?.diagnoses
          ?.others &&
          data.socialInsuranceDisabilityPensionCertificate.diagnoses
            .others.length > 0 && (
            <GridColumn span="1/1">
              <Label>
                {formatMessage(
                  disabilityPensionFormMessage
                    .disabilityPensionCertificate
                    .informationOtherICDAnalysis,
                )}
              </Label>
              <Markdown>
                {data.socialInsuranceDisabilityPensionCertificate.diagnoses.others
                  .map((value) => `* ${value.code} ${value.displayValue}`)
                  ?.join('\n\n') ?? ''}
              </Markdown>
            </GridColumn>
          )}
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .informationMedicalHistory,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.previousHealthHistory
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .informationCurrentStatus,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.currentStatus
            }
          </Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  const physicalImpairment = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate.physicalImpairment,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  disabilityPensionFormMessage
                    .disabilityPensionCertificate
                    .physicalImpairmentTooltip,
                )}
              />
            </Box>
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .physicalImpairmentAffect,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.physicalDifficulty?.displayValue
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .physicalImpairmentExplanation,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.physicalDifficulty?.explanation
            }
          </Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  const mentalImpairment = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate.mentalImpairment,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  disabilityPensionFormMessage
                    .disabilityPensionCertificate
                    .mentalImpairmentTooltip,
                )}
              />
            </Box>
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate.mentalImpairmentAffect,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.mentalDifficulty?.displayValue
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .mentalImpairmentExplanation,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.mentalDifficulty?.explanation
            }
          </Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  const activityAndParticipationImpairment = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .activityAndParticipationImpairment,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  disabilityPensionFormMessage
                    .disabilityPensionCertificate
                    .activityAndParticipationImpairmentTooltip,
                )}
              />
            </Box>
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .activityAndParticipationImpairmentAffect,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.activityParticipationDifficulty?.displayValue
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .activityAndParticipationImpairmentExplanation,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.activityParticipationDifficulty?.explanation
            }
          </Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  const mainImpairment = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate.mainImpairment,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .mainImpairmentExplanation,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate
                ?.other
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
              disabilityPensionFormMessage
                .disabilityPensionCertificate.application,
            )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/3']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .applicationStartOfTreatment,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              ?.confirmation?.estimatedDuration?.start
              ? format(
                  new Date(
                    data.socialInsuranceDisabilityPensionCertificate.confirmation.estimatedDuration.start,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/3']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .applicationEstimatedEndOfTreatment,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              ?.confirmation?.estimatedDuration?.start
              ? format(
                  new Date(
                    data.socialInsuranceDisabilityPensionCertificate.confirmation.estimatedDuration.start,
                  ),
                  'dd.MM.yyyy',
                )
              : formatMessage(
                disabilityPensionFormMessage
                    .disabilityPensionCertificate
                    .applicationEstimatedTimeUnclear,
                )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/3']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .applicationEstimatedTime,
            )}
          </Label>
          <Text>
            {formatMessage(
              disabilityPensionFormMessage
                .disabilityPensionCertificate
                .applicationEstimatedTimeMonths,
              {
                months:
                  data?.socialInsuranceDisabilityPensionCertificate
                    ?.confirmation?.estimatedDuration?.months,
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

  if (error) {
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
      {physicalImpairment()}
      <Divider />
      {mentalImpairment()}
      <Divider />
      {activityAndParticipationImpairment()}
      <Divider />
      {mainImpairment()}
      <Divider />
      {applicationForMedicalAndRehabilitationPayments()}
      <input
        type="hidden"
        value={
          data?.socialInsuranceDisabilityPensionCertificate
            ?.referenceId
            ? data.socialInsuranceDisabilityPensionCertificate
                .referenceId
            : undefined
        }
        {...register(field.id)}
      />
    </Stack>
  )
}
