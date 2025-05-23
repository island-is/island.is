import { buildSection } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { operatingCostSubSection } from './operatingcostSubSection'
import { equityAndLiabilitiesSubSection } from './equitiesAndLiabilitiesSubSection'
import { capitalNumberSection } from './capitalNumbersSection'
import { isGreaterThanIncomeLimit } from '../../../utils/conditions'

export const individualKeyNumbersSection = buildSection({
  id: 'keyNumbers',
  title: m.keyNumbers,
  condition: isGreaterThanIncomeLimit,

  children: [
    operatingCostSubSection,
    capitalNumberSection,
    equityAndLiabilitiesSubSection,
  ],
})
