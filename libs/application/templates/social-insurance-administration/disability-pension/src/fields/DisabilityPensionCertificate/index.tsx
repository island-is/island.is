import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { FieldBaseProps } from '@island.is/application/types'
import { Label } from '@island.is/application/ui-components'
import {
  Accordion,
  AccordionItem,
  Divider,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Markdown } from '@island.is/shared/components'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { disabilityPensionFormMessage } from '../../lib/messages'

import { MOCK_CERTIFICATE } from './mockData'

export const DisabilityPensionCertificate: FC<FieldBaseProps> = ({
  field,
  setBeforeSubmitCallback,
}) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()

  /* const { data, loading, error } =
    useQuery<SiaDisabilityPensionCertificateQuery>(
      siaDisabilityPensionCertificate,
    ) */

  const data = MOCK_CERTIFICATE

  setBeforeSubmitCallback?.(async () => {
    // If data is still loading, prevent submission
    /*if (loading) {
      return [false, '']
    }*/

    // In all other cases, allow submission
    return [true, null]
  })

  const managedBy = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .managedBy,
            )}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(socialInsuranceAdministrationMessage.confirm.name)}
          </Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate?.doctor?.name}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .doctorNumber,
            )}
          </Label>
          <Text>
            {/* Put doctorNumber here for now - Smári will search for doctor's number and find job title and return it instead */}
            {
              data?.socialInsuranceDisabilityPensionCertificate?.doctor
                ?.doctorNumber
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .managedByLocation,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate?.doctor
                ?.residence
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .phoneNumber,
            )}
          </Label>
          <Text>
            {
              data?.socialInsuranceDisabilityPensionCertificate?.doctor
                ?.phoneNumber
            }
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate.email,
            )}
          </Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate?.doctor?.email}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate.address,
            )}
          </Label>
          <Text>{'???'}</Text>
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
              disabilityPensionFormMessage.disabilityPensionCertificate
                .information,
            )}
          </Text>
        </GridColumn>
        <GridColumn span={'1/1'}>
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .informationIncapacitatedDate,
            )}
          </Label>
          <Text></Text>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              .dateOfWorkIncapacity ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .informationICDAnalysis,
            )}
          </Label>
          <Markdown>
            {data?.socialInsuranceDisabilityPensionCertificate?.diagnoses?.mainDiagnoses
              ?.map(
                (value, index) =>
                  `${index + 1}. ${value.code} ${value.description}`,
              )
              .join('\n\n') ?? ''}
          </Markdown>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .informationOtherICDAnalysis,
            )}
          </Label>
          <Markdown>
            {data?.socialInsuranceDisabilityPensionCertificate?.diagnoses?.otherDiagnoses
              ?.map(
                (value, index) =>
                  `${index + 1}. ${value.code} ${value.description}`,
              )
              .join('\n\n') ?? ''}
          </Markdown>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .informationMedicalHistory,
            )}
          </Label>
          <Text></Text>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              .healthHistorySummary ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .informationMedicalImpairmentCause,
            )}
          </Label>
          <Text></Text>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              .participationLimitationCause ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .informationMedicalImpairmentStability,
            )}
          </Label>
          <Text></Text>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              ?.abilityChangePotential ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .informationMedicalImpairmentProjectedImprovement,
            )}
          </Label>
          <Text></Text>
          <Text>{'Gögn vantar - bíður eftir TR'}</Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              disabilityPensionFormMessage.disabilityPensionCertificate
                .informationMedicalMedicalImplementsUsage,
            )}
          </Label>
          <Text></Text>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              .medicationAndSupports ?? '-'}
          </Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  const physicalImpairments = () => (
    <AccordionItem
      label={formatMessage(
        disabilityPensionFormMessage.disabilityPensionCertificate
          .physicalImpairment,
      )}
      id="physical-impairments-accordion-item"
      key="physical-impairments-accordion-item"
    >
      <Stack space={3}>
        <GridRow rowGap={3}>
          <GridColumn span="1/1">
            <Text>
              {formatMessage(
                disabilityPensionFormMessage.disabilityPensionCertificate
                  .physicalImpairmentEffect,
              )}
            </Text>
          </GridColumn>
          {data?.socialInsuranceDisabilityPensionCertificate?.physicalAbilityRatings?.map(
            (rating) => (
              <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
                <Label>{rating.type?.toString()}</Label>
                <Text>{rating.score?.toString()}</Text>
              </GridColumn>
            ),
          )}
        </GridRow>
      </Stack>
    </AccordionItem>
  )

  const cognitiveImpairments = () => (
    <AccordionItem
      label={formatMessage(
        disabilityPensionFormMessage.disabilityPensionCertificate
          .cognitiveImpairment,
      )}
      id="cognitive-impairments-accordion-item"
      key="cognitive-impairments-accordion-item"
    >
      <Stack space={3}>
        <GridRow rowGap={3}>
          <GridColumn span="1/1">
            <Text>
              {formatMessage(
                disabilityPensionFormMessage.disabilityPensionCertificate
                  .cognitiveImpairmentEffect,
              )}
            </Text>
          </GridColumn>
          {data?.socialInsuranceDisabilityPensionCertificate?.cognitiveAndMentalAbilityRatings?.map(
            (rating) => (
              <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
                <Label>{rating.type?.toString()}</Label>
                <Text>{rating.score?.toString()}</Text>
              </GridColumn>
            ),
          )}
        </GridRow>
      </Stack>
    </AccordionItem>
  )

  const functionalAssessments = () => (
    <AccordionItem
      label={formatMessage(
        disabilityPensionFormMessage.disabilityPensionCertificate
          .functionalAssessment,
      )}
      id="functional-assessments-accordion-item"
      key="functional-assessments-accordion-item"
    >
      <Stack space={3}>
        <GridRow rowGap={3}>
          <GridColumn span="1/1">
            <Text>
              {formatMessage(
                disabilityPensionFormMessage.disabilityPensionCertificate
                  .functionalAssessmentDescription,
              )}
            </Text>
          </GridColumn>
          {data?.socialInsuranceDisabilityPensionCertificate?.functionalAssessment?.map(
            (rating) => (
              <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
                <Label>{rating.type?.toString()}</Label>
                <Text>{rating.score?.toString()}</Text>
              </GridColumn>
            ),
          )}
        </GridRow>
      </Stack>
    </AccordionItem>
  )

  return (
    <Stack space={4}>
      {managedBy()}
      <Divider />
      {information()}
      <Accordion>
        {physicalImpairments()}
        {cognitiveImpairments()}
        {functionalAssessments()}
      </Accordion>
      <input
        type="hidden"
        value={
          data?.socialInsuranceDisabilityPensionCertificate?.referenceId
            ? data.socialInsuranceDisabilityPensionCertificate.referenceId
            : undefined
        }
        {...register(field.id)}
      />
    </Stack>
  )
}
