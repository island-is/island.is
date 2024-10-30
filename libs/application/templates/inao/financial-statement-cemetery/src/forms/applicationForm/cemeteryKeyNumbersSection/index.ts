import { buildSection } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { opperatingCostSubSection } from './opperatingCostSubSection'
import { capitalNumberSubSection } from './capitalNumberSubSection'
import { equityAndLiabilitiesSubSection } from './equityAndLiabilitySubSection'

export const cemeteryKeyNumbersSection = buildSection({
  id: 'cemeteryKeyNumbers',
  title: m.keynumbers,
  children: [
    opperatingCostSubSection,
    capitalNumberSubSection,
    equityAndLiabilitiesSubSection,
  ],
})
