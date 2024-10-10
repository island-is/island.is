import { buildSection } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { operatingCostSubsection } from './operatingCostSubsection'
import { capitalNumbersSubsection } from './capitalNumbersSubsection'
import { equitiesAndLiabilitiesSubsection } from './equitiesAndLiabilitiesSubsection'

export const keyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  children: [
    operatingCostSubsection,
    capitalNumbersSubsection,
    equitiesAndLiabilitiesSubsection,
  ],
})
