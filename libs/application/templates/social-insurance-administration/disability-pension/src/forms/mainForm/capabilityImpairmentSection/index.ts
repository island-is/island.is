import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../lib/routes'

export const capabilityImpairmentSection =
  buildSection({
    id: SectionRouteEnum.CAPABILITY_IMPAIRMENT,
    tabTitle: disabilityPensionFormMessage.capabilityImpairment.tabTitle,
    children: [
      buildDescriptionField({
        id: SectionRouteEnum.CAPABILITY_IMPAIRMENT,
        title: disabilityPensionFormMessage.capabilityImpairment.title,
        description: disabilityPensionFormMessage.capabilityImpairment.description,
      }),
    ]
  })
