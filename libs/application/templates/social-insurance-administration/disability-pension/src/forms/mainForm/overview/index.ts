import {
    buildOverviewField,
  buildSection,
} from '@island.is/application/core'
import { disabilityPensionFormMessage } from '../../../lib/messages'
import { SectionRouteEnum } from '../../../types'

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
