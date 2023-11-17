import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ParentsSubSection } from './ParentsSubSection'
import { MaritalStatusSubSection } from './MaritalStatusSubSection'
import { CountriesOfResidenceSubSection } from './CountriesOfResidenceSubSection'
import { StaysAbroadSubSection } from './StaysAbroadSubSection'
import { FormerIcelanderSubSection } from './FormerIcelanderSubSection'

export const InformationSection = buildSection({
  id: 'information',
  title: information.general.sectionTitle,
  children: [
    MaritalStatusSubSection,
    ParentsSubSection,
    FormerIcelanderSubSection,
    CountriesOfResidenceSubSection,
    StaysAbroadSubSection,
  ],
})
