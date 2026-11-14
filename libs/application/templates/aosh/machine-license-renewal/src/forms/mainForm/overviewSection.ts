import {
  buildCheckboxField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  YES,
} from '@island.is/application/core'
import { overview } from '../../lib/messages'
import {
  getApplicantOverviewItems,
  getLicenseOverviewItems,
  getMedicalCertificateAttachments,
  getRightsOverviewItems,
} from '../../utils/getOverviewItems'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: overview.general.title,
      description: overview.general.description,
      children: [
        buildOverviewField({
          id: 'overview.applicant',
          items: getApplicantOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.rights',
          backId: 'rights',
          items: getRightsOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.medicalCertificate',
          title: overview.labels.medicalCertificate,
          titleVariant: 'h4',
          backId: 'medicalCertificateMultiField',
          attachments: getMedicalCertificateAttachments,
        }),
        buildOverviewField({
          id: 'overview.license',
          backId: 'license',
          items: getLicenseOverviewItems,
        }),
        buildCheckboxField({
          id: 'overview.agreement',
          large: true,
          marginTop: 3,
          options: [{ value: YES, label: overview.labels.agreement }],
        }),
      ],
    }),
  ],
})
