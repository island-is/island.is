import { useQuery } from '@apollo/client'
import { coreErrorMessages } from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
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
import parseISO from 'date-fns/parseISO'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { siaCertificateForSicknessAndRehabilitationQuery } from '../../graphql/queries'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'
import { Query } from '@island.is/api/schema'
import { AlertMessageFormField } from '@island.is/application/ui-fields'

export const CertificateForSicknessAndRehabilitation: FC<FieldBaseProps> = ({
  field,
  setBeforeSubmitCallback,
  application,
}) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()

  const { data, loading, error } = useQuery<Query>(
    siaCertificateForSicknessAndRehabilitationQuery,
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
              data?.socialInsuranceCertificateForSicknessAndRehabilitation
                ?.doctor?.name
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
            {/* Put doctorNumber here for now - Smári will search for doctor's number and find job title and return it instead */}
            {
              data?.socialInsuranceCertificateForSicknessAndRehabilitation
                ?.doctor?.doctorNumber
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
              data?.socialInsuranceCertificateForSicknessAndRehabilitation
                ?.doctor?.residence
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
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation
                .informationDateOfLastExamination,
            )}
          </Label>
          <Text></Text>
          <Text>
            {data?.socialInsuranceCertificateForSicknessAndRehabilitation
              ?.lastExaminationDate
              ? format(
                  parseISO(
                    data.socialInsuranceCertificateForSicknessAndRehabilitation
                      .lastExaminationDate,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation
                .informationDateOfCertificate,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceCertificateForSicknessAndRehabilitation
              ?.certificateDate
              ? format(
                  parseISO(
                    data.socialInsuranceCertificateForSicknessAndRehabilitation
                      .certificateDate,
                  ),
                  'dd.MM.yyyy',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation
                .informationIncapacitatedDate,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceCertificateForSicknessAndRehabilitation
              ?.disabilityDate
              ? format(
                  parseISO(
                    data.socialInsuranceCertificateForSicknessAndRehabilitation
                      .disabilityDate,
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
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation.informationICDAnalysis,
            )}
          </Label>
          <Markdown>
            {data?.socialInsuranceCertificateForSicknessAndRehabilitation?.diagnoses?.icd
              ?.map(
                (value, index) =>
                  `${index + 1}. ${value.code} ${value.displayValue}`,
              )
              ?.join('\n\n') ?? ''}
          </Markdown>
        </GridColumn>
        {data?.socialInsuranceCertificateForSicknessAndRehabilitation?.diagnoses
          ?.others &&
          data.socialInsuranceCertificateForSicknessAndRehabilitation.diagnoses
            .others.length > 0 && (
            <GridColumn span="1/1">
              <Label>
                {formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage
                    .certificateForSicknessAndRehabilitation
                    .informationOtherICDAnalysis,
                )}
              </Label>
              <Markdown>
                {data.socialInsuranceCertificateForSicknessAndRehabilitation.diagnoses.others
                  .map((value) => `* ${value.code} ${value.displayValue}`)
                  ?.join('\n\n') ?? ''}
              </Markdown>
            </GridColumn>
          )}
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation
                .informationMedicalHistory,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceCertificateForSicknessAndRehabilitation
                ?.previousHealthHistory
            }
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation
                .informationCurrentStatus,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceCertificateForSicknessAndRehabilitation
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
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation.physicalImpairment,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage
                    .certificateForSicknessAndRehabilitation
                    .physicalImpairmentTooltip,
                )}
              />
            </Box>
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation
                .physicalImpairmentAffect,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceCertificateForSicknessAndRehabilitation
                ?.physicalDifficulty?.displayValue
            }
          </Text>
        </GridColumn>
        {data?.socialInsuranceCertificateForSicknessAndRehabilitation
          ?.physicalDifficulty?.explanation && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage
                  .certificateForSicknessAndRehabilitation
                  .physicalImpairmentExplanation,
              )}
            </Label>
            <Text>
              {
                data?.socialInsuranceCertificateForSicknessAndRehabilitation
                  ?.physicalDifficulty?.explanation
              }
            </Text>
          </GridColumn>
        )}
      </GridRow>
    </Stack>
  )

  const mentalImpairment = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation.mentalImpairment,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage
                    .certificateForSicknessAndRehabilitation
                    .mentalImpairmentTooltip,
                )}
              />
            </Box>
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation.mentalImpairmentAffect,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceCertificateForSicknessAndRehabilitation
                ?.mentalDifficulty?.displayValue
            }
          </Text>
        </GridColumn>
        {data?.socialInsuranceCertificateForSicknessAndRehabilitation
          ?.mentalDifficulty?.explanation && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage
                  .certificateForSicknessAndRehabilitation
                  .mentalImpairmentExplanation,
              )}
            </Label>
            <Text>
              {
                data?.socialInsuranceCertificateForSicknessAndRehabilitation
                  ?.mentalDifficulty?.explanation
              }
            </Text>
          </GridColumn>
        )}
      </GridRow>
    </Stack>
  )

  const activityAndParticipationImpairment = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation
                .activityAndParticipationImpairment,
            )}
            <Box marginLeft={1} display="inlineBlock">
              <Tooltip
                placement="top"
                text={formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage
                    .certificateForSicknessAndRehabilitation
                    .activityAndParticipationImpairmentTooltip,
                )}
              />
            </Box>
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation
                .activityAndParticipationImpairmentAffect,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceCertificateForSicknessAndRehabilitation
                ?.activityParticipationDifficulty?.displayValue
            }
          </Text>
        </GridColumn>
        {data?.socialInsuranceCertificateForSicknessAndRehabilitation
          ?.activityParticipationDifficulty?.explanation && (
          <GridColumn span="1/1">
            <Label>
              {formatMessage(
                medicalAndRehabilitationPaymentsFormMessage
                  .certificateForSicknessAndRehabilitation
                  .activityAndParticipationImpairmentExplanation,
              )}
            </Label>
            <Text>
              {
                data?.socialInsuranceCertificateForSicknessAndRehabilitation
                  ?.activityParticipationDifficulty?.explanation
              }
            </Text>
          </GridColumn>
        )}
      </GridRow>
    </Stack>
  )

  const mainImpairment = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation.mainImpairment,
            )}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              medicalAndRehabilitationPaymentsFormMessage
                .certificateForSicknessAndRehabilitation
                .mainImpairmentExplanation,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceCertificateForSicknessAndRehabilitation
                ?.other
            }
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

  if (
    data?.socialInsuranceCertificateForSicknessAndRehabilitation
      ?.isAlmaCertificate
  ) {
    return (
      <Stack space={4}>
        <Stack space={3}>
          <GridRow>
            <GridColumn span="1/1">
              <AlertMessageFormField
                application={application}
                field={{
                  ...field,
                  type: FieldTypes.ALERT_MESSAGE,
                  component: FieldComponents.ALERT_MESSAGE,
                  title: socialInsuranceAdministrationMessage.shared.alertTitle,
                  alertType: 'info',
                  message:
                    medicalAndRehabilitationPaymentsFormMessage
                      .certificateForSicknessAndRehabilitation
                      .almaCertificateMessage,
                }}
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span="1/1">
              <Text variant="h3">
                {formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage.shared
                    .information,
                )}
              </Text>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span="1/1">
              <Label>
                {formatMessage(
                  medicalAndRehabilitationPaymentsFormMessage
                    .certificateForSicknessAndRehabilitation
                    .almaCertificateDate,
                )}
              </Label>
              <Text>
                {data?.socialInsuranceCertificateForSicknessAndRehabilitation
                  ?.certificateDate
                  ? format(
                      parseISO(
                        data
                          .socialInsuranceCertificateForSicknessAndRehabilitation
                          .certificateDate,
                      ),
                      'dd.MM.yyyy',
                    )
                  : '-'}
              </Text>
            </GridColumn>
          </GridRow>
        </Stack>
        <input
          type="hidden"
          value="true"
          {...register(`${field.id}.isAlmaCertificate`)}
        />
      </Stack>
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
      <input
        type="hidden"
        value={
          data?.socialInsuranceCertificateForSicknessAndRehabilitation
            ?.referenceId
            ? data.socialInsuranceCertificateForSicknessAndRehabilitation
                .referenceId
            : undefined
        }
        {...register(`${field.id}.referenceId`)}
      />
    </Stack>
  )
}
