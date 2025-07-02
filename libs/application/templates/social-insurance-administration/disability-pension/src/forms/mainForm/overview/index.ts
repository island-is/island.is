import {
    buildOverviewField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../lib/routes'

export const overviewSection =
  buildSection({
    id: SectionRouteEnum.OVERVIEW,
    title: disabilityPensionFormMessage.overview.title,
    children: [
      buildOverviewField({
        id: SectionRouteEnum.OVERVIEW,
        title: disabilityPensionFormMessage.overview.title,
        description: disabilityPensionFormMessage.overview.description,
      }),
    ]
  })
