import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types/routes'

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
        //sensitive data, can't be stored in state
        buildCustomField({
          id: 'disabilityPensionCertificateReferenceId',
          component: 'DisabilityPensionCertificate',
        }),
      ],
    }),
  ],
})
