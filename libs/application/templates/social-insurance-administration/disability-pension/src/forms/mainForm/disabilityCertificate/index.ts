import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'

export const disabilityCertificateSection = buildSection({
  id: SectionRouteEnum.DISABILITY_CERTIFICATE,
  title: m.disabilityCertificate.tabTitle,
  tabTitle: m.disabilityCertificate.tabTitle,
  children: [
    buildMultiField({
      id: SectionRouteEnum.DISABILITY_CERTIFICATE,
      title: m.disabilityCertificate.title,
      description: m.disabilityCertificate.description,
      children: [
        buildCustomField({
          id: 'disabilityPensionCertificateReferenceId',
          component: 'DisabilityPensionCertificate',
        }),
      ],
    }),
  ],
})
