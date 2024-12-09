import { buildSection } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { equitiesAndLiabilitiesSubsection } from './equitiesAndLiabilitiesSubsection'
import { capitalNumbersSubsection } from './capitalNumbersSubsection'
import { operatingCostSubsection } from './operatingCostSubsection'

export const keyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  children: [
    operatingCostSubsection,
    capitalNumbersSubsection,
    equitiesAndLiabilitiesSubsection,
  ],
})
