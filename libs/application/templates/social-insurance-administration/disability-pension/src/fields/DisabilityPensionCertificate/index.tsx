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
import { useQuery } from '@apollo/client'
import { siaDisabilityPensionCertificateQuery } from '../../graphql/queries'
import format from 'date-fns/format'
import * as m from '../../lib/messages'
import { Query } from '@island.is/api/schema'

export const DisabilityPensionCertificate: FC<FieldBaseProps> = ({
  setBeforeSubmitCallback,
}) => {
  const { formatMessage, lang } = useLocale()

  const { data, loading } = useQuery<Query>(
    siaDisabilityPensionCertificateQuery,
    { variables: { locale: lang } },
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
          <Text variant="h3">{formatMessage(m.certificate.managedBy)}</Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>{formatMessage(m.certificate.name)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate?.doctor?.name ??
              '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>{formatMessage(m.certificate.residence)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate?.doctor
              ?.residence ?? '-'}
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
            {formatMessage(m.certificate.informationTitle)}
          </Text>
        </GridColumn>
        <GridColumn span={'1/1'}>
          <Label>{formatMessage(m.certificate.incapacityDate)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              .dateOfWorkIncapacity
              ? format(
                  new Date(
                    data.socialInsuranceDisabilityPensionCertificate.dateOfWorkIncapacity,
                  ),
                  'yyyy-MM-dd',
                )
              : '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>{formatMessage(m.certificate.iCDAnalysis)}</Label>
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
          <Label>{formatMessage(m.certificate.otherICDAnalysis)}</Label>
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
          <Label>{formatMessage(m.certificate.medicalHistory)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              .healthHistorySummary ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>{formatMessage(m.certificate.impairmentCause)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              .participationLimitationCause ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>{formatMessage(m.certificate.impairmentStability)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate.stabilityOfHealth
              ?.description ?? '-'}
          </Text>
          {data?.socialInsuranceDisabilityPensionCertificate?.stabilityOfHealth
            ?.furtherDetails && (
            <Text>
              {
                data.socialInsuranceDisabilityPensionCertificate
                  .stabilityOfHealth.furtherDetails
              }
            </Text>
          )}
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(m.certificate.impairmentProjectedImprovement)}
          </Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              ?.abilityChangePotential ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>{formatMessage(m.certificate.medicalImplementsUsage)}</Label>
          {medicationAndSupportsUsed()}
        </GridColumn>
        <GridColumn span="1/1">
          <Label>{formatMessage(m.certificate.employmentCapability)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              ?.capacityForWork ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>{formatMessage(m.certificate.previousTherapies)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              ?.previousRehabilitation ?? '-'}
          </Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  const medicationAndSupportsUsed = () => {
    if (
      !data?.socialInsuranceDisabilityPensionCertificate
        ?.medicationAndSupportsUsed
    ) {
      return (
        <Text>{formatMessage(m.certificate.noMedicationAndSupportsUsed)}</Text>
      )
    }

    return (
      <>
        {data?.socialInsuranceDisabilityPensionCertificate
          ?.medicationAndSupportsUsed.medicationUsed && (
          <Text>{`${formatMessage(m.certificate.medicine)}: ${
            data?.socialInsuranceDisabilityPensionCertificate
              ?.medicationAndSupportsUsed.medicationUsed
          }`}</Text>
        )}
        {data?.socialInsuranceDisabilityPensionCertificate
          ?.medicationAndSupportsUsed.supportsUsed && (
          <Text>{`${formatMessage(m.certificate.supports)}: ${
            data?.socialInsuranceDisabilityPensionCertificate
              ?.medicationAndSupportsUsed.supportsUsed
          }`}</Text>
        )}
        {data?.socialInsuranceDisabilityPensionCertificate
          ?.medicationAndSupportsUsed.interventionsUsed && (
          <Text>{`${formatMessage(m.certificate.otherInterventions)}: ${
            data?.socialInsuranceDisabilityPensionCertificate
              ?.medicationAndSupportsUsed.interventionsUsed
          }`}</Text>
        )}
      </>
    )
  }

  const physicalImpairments = () => (
    <AccordionItem
      label={formatMessage(m.certificate.physicalImpairment)}
      id="physical-impairments-accordion-item"
      key="physical-impairments-accordion-item"
    >
      <Stack space={3}>
        <GridRow rowGap={3}>
          <GridColumn span="1/1">
            <Text>{formatMessage(m.certificate.physicalImpairmentEffect)}</Text>
          </GridColumn>
          {data?.socialInsuranceDisabilityPensionCertificate?.physicalImpairments?.map(
            (rating, idx) => (
              <GridColumn
                key={`${rating.title ?? 'physical'}-${idx}`}
                span={['1/1', '1/1', '1/1', '1/2']}
              >
                <Label>{rating.title}</Label>
                <Text>{rating.value}</Text>
              </GridColumn>
            ),
          )}
        </GridRow>
      </Stack>
    </AccordionItem>
  )

  const cognitiveImpairments = () => (
    <AccordionItem
      label={formatMessage(m.certificate.cognitiveImpairment)}
      id="cognitive-impairments-accordion-item"
      key="cognitive-impairments-accordion-item"
    >
      <Stack space={3}>
        <GridRow rowGap={3}>
          <GridColumn span="1/1">
            <Text>
              {formatMessage(m.certificate.cognitiveImpairmentEffect)}
            </Text>
          </GridColumn>
          {data?.socialInsuranceDisabilityPensionCertificate?.mentalImpairments?.map(
            (rating, idx) => (
              <GridColumn
                key={`${rating.title ?? 'mental'}-${idx}`}
                span={['1/1', '1/1', '1/1', '1/2']}
              >
                <Label>{rating.title}</Label>
                <Text>{rating.value}</Text>
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
      </Accordion>
    </Stack>
  )
}
