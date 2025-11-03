import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
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
  const { formatMessage } = useLocale()

  const { data, loading } = useQuery<Query>(
    siaDisabilityPensionCertificateQuery,
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
          <Label>{formatMessage(sm.confirm.name)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate?.doctor?.name ??
              '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>{formatMessage(m.certificate.doctorNumber)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate?.doctor
              ?.doctorNumber ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>{formatMessage(m.certificate.residence)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate?.doctor
              ?.residence ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>{formatMessage(m.certificate.phoneNumber)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate?.doctor
              ?.phoneNumber ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>{formatMessage(m.certificate.email)}</Label>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate?.doctor?.email ??
              '-'}
          </Text>
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
          <Label>{formatMessage(m.certificate.address)}</Label>
          <Text>{'-'}</Text>
        </GridColumn>
      </GridRow>
    </Stack>
  )

  const information = () => (
    <Stack space={3}>
      <GridRow rowGap={3}>
        <GridColumn span="1/1">
          <Text variant="h3">{formatMessage(m.certificate.information)}</Text>
        </GridColumn>
        <GridColumn span={'1/1'}>
          <Label>
            {formatMessage(m.certificate.informationIncapacitatedDate)}
          </Label>
          <Text></Text>
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
          <Label>{formatMessage(m.certificate.informationICDAnalysis)}</Label>
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
            {formatMessage(m.certificate.informationOtherICDAnalysis)}
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
            {formatMessage(m.certificate.informationMedicalHistory)}
          </Label>
          <Text></Text>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              .healthHistorySummary ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(m.certificate.informationMedicalImpairmentCause)}
          </Label>
          <Text></Text>
          <Text>
            {data?.socialInsuranceDisabilityPensionCertificate
              .participationLimitationCause ?? '-'}
          </Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(m.certificate.informationMedicalImpairmentStability)}
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
              m.certificate.informationMedicalImpairmentProjectedImprovement,
            )}
          </Label>
          <Text></Text>
          <Text>{'Gögn vantar - bíður eftir TR'}</Text>
        </GridColumn>
        <GridColumn span="1/1">
          <Label>
            {formatMessage(
              m.certificate.informationMedicalMedicalImplementsUsage,
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
      label={formatMessage(m.certificate.physicalImpairment)}
      id="physical-impairments-accordion-item"
      key="physical-impairments-accordion-item"
    >
      <Stack space={3}>
        <GridRow rowGap={3}>
          <GridColumn span="1/1">
            <Text>{formatMessage(m.certificate.physicalImpairmentEffect)}</Text>
          </GridColumn>
          {data?.socialInsuranceDisabilityPensionCertificate?.physicalAbilityRatings?.map(
            (rating, idx) => (
              <GridColumn
                key={`${rating.type ?? 'physical'}-${idx}`}
                span={['1/1', '1/1', '1/1', '1/2']}
              >
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
          {data?.socialInsuranceDisabilityPensionCertificate?.cognitiveAndMentalAbilityRatings?.map(
            (rating, idx) => (
              <GridColumn
                key={`${rating.type ?? 'physical'}-${idx}`}
                span={['1/1', '1/1', '1/1', '1/2']}
              >
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
      </Accordion>
    </Stack>
  )
}
