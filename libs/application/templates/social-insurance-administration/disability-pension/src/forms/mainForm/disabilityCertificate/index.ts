import {
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'

export const disabilityCertificateSection =
  buildSection({
    id: SectionRouteEnum.DISABILITY_CERTIFICATE,
    tabTitle: disabilityPensionFormMessage.disabilityCertificate.tabTitle,
    children: [
      buildMultiField({
        id: SectionRouteEnum.DISABILITY_CERTIFICATE,
        title: disabilityPensionFormMessage.disabilityCertificate.title,
        description: disabilityPensionFormMessage.disabilityCertificate.description,
        children: []
      }),
    ]
  })
