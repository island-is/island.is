import {
  buildDescriptionField,
  buildKeyValueField,
  buildMultiField,
  buildOverviewField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { socialInsuranceAdministrationMessage as sm } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

import { SectionRouteEnum } from '../../../types'
import { siaDisabilityPensionCertificate } from '../../../graphql/queries'
import { SiaDisabilityPensionCertificateQuery } from '../../../types/schema'
import { getApplicationExternalData } from '../../../utils'
import format from 'date-fns/format'

export const newCertificateSection = buildSection({
  id: SectionRouteEnum.NEW_CERTIFICATE,
  title: m.disabilityCertificate.tabTitle,
  tabTitle: m.disabilityCertificate.tabTitle,
  children: [
    buildMultiField({
      id: SectionRouteEnum.DISABILITY_CERTIFICATE,
      title: m.disabilityCertificate.title,
      description:
        m.disabilityCertificate.description,
      children: [
        buildOverviewField({
          id: `${SectionRouteEnum.DISABILITY_CERTIFICATE}.doctor`,
          description: m.certificate
            .managedBy,
          titleVariant: 'h4',
          bottomLine: true,
          loadItems: async(formValue, externalData, _, apolloClient) => {
            const { data } =
              await apolloClient.query<SiaDisabilityPensionCertificateQuery>({
                query: siaDisabilityPensionCertificate,
              })

            return [
              {
                width: 'half',
                label: sm.confirm.name,
                value: data.socialInsuranceDisabilityPensionCertificate.doctor?.name ?? '-'
              },
              {
                width: 'half',
                label: m.certificate.doctorNumber,
                value: data.socialInsuranceDisabilityPensionCertificate.doctor?.doctorNumber ?? '-'
              },
              {
                width: 'half',
                label: m.certificate.managedByLocation,
                value: data?.socialInsuranceDisabilityPensionCertificate?.doctor?.residence ?? '-'
              },
              {
                width: 'half',
                label:m.certificate
                  .phoneNumber,
                value: 'TODO'
              },
              {
                width: 'half',
                label: m.certificate.email,
                value: 'TODO'
              },
              {
                width: 'half',
                label: m.certificate.address,
                value: '-'
              }
            ]
          },
        }),
        buildOverviewField({
          id: `${SectionRouteEnum.DISABILITY_CERTIFICATE}.information`,
          description: m.certificate
            .information,
          titleVariant: 'h4',
          bottomLine: true,
          loadItems: async(formValue, externalData, _, apolloClient) => {
            const { data } =
              await apolloClient.query<SiaDisabilityPensionCertificateQuery>({
                query: siaDisabilityPensionCertificate,
              })

            return [
              {
                width: 'full',
                label:  m.certificate
                  .informationIncapacitatedDate,
                value: data?.socialInsuranceDisabilityPensionCertificate
                  .dateOfWorkIncapacity
                  ? format(
                      new Date(
                        data.socialInsuranceDisabilityPensionCertificate.dateOfWorkIncapacity,
                      ),
                      'yyyy-MM-dd',
                    )
                  : '-'
              },
              {
                width: 'full',
                label:   m.certificate
                  .informationICDAnalysis,
                value: data?.socialInsuranceDisabilityPensionCertificate?.diagnoses?.mainDiagnoses
                  ?.map(
                    (value, index) =>
                      `${index + 1}. ${value.code} ${value.description}`,
                  )
                  .join('\n\n') ?? ''
              },
              {
                width: 'full',
                label:m.certificate
                  .informationOtherICDAnalysis,
                value: data?.socialInsuranceDisabilityPensionCertificate?.diagnoses?.otherDiagnoses
                  ?.map(
                    (value, index) =>
                      `${index + 1}. ${value.code} ${value.description}`,
                  )
                  .join('\n\n') ?? ''
              },
              {
                width: 'full',
                label:m.certificate
                  .informationMedicalHistory,
                value:data?.socialInsuranceDisabilityPensionCertificate
                  .healthHistorySummary ?? '-'
              },
              {
                width: 'full',
                label:  m.certificate
                  .informationMedicalImpairmentCause,
                value: data?.socialInsuranceDisabilityPensionCertificate
                  .participationLimitationCause ?? '-',
              },
              {
                width: 'full',
                label:  m.certificate
                  .informationMedicalImpairmentStability,
                value: data?.socialInsuranceDisabilityPensionCertificate
                  ?.abilityChangePotential ?? '-'
              },
              {
                width: 'full',
                label: m.certificate
                  .informationMedicalImpairmentProjectedImprovement,
                value: 'Gögn vantar - bíður eftir TR'
              },
              {
                width: 'full',
                label:   m.certificate
                  .informationMedicalMedicalImplementsUsage,
                value: data?.socialInsuranceDisabilityPensionCertificate
                  .medicationAndSupports ?? '-'
              }
            ]
          },
        }),
      ],
    }),
  ],
})
