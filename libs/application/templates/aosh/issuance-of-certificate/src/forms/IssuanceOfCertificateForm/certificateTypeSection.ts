import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { certificateType } from '../../lib/messages'
import { CertificateType } from '../../utils/constants'

export const certificateTypeSection = buildSection({
  id: 'certificateTypeSection',
  title: certificateType.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'certificateTypeMultiField',
      title: certificateType.general.title,
      description: certificateType.general.description,
      children: [
        buildRadioField({
          id: 'certificateType.type',
          options: [
            {
              label: certificateType.labels.workMachineCertificate,
              value: CertificateType.WORK_MACHINE_CERTIFICATE,
            },
            {
              label: certificateType.labels.ADRCertificate,
              value: CertificateType.ADR_CERTIFICATE,
            },
          ],
        }),
      ],
    }),
  ],
})
