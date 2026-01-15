import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types/routes'

export const disabilityCertificateSection = buildSection({
  id: SectionRouteEnum.DISABILITY_CERTIFICATE,
  title: m.certificate.title,
  children: [
    buildMultiField({
      id: SectionRouteEnum.DISABILITY_CERTIFICATE,
      title: m.certificate.title,
      description: m.certificate.description,
      children: [
        //sensitive data, can't be stored in state
        buildCustomField({
          id: 'disabilityPensionCertificateReferenceId',
          component: 'DisabilityPensionCertificate',
        }),
      ],
    }),
  ],
})
