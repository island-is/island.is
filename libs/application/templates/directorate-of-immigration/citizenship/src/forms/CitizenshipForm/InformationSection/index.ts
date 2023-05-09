import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ResidenceConditionsSubSection } from './ResidenceConditionsSubSection'
import { ParentsSubSection } from './ParentsSubSection'
import { MaritalStatusSubSection } from './MaritalStatusSubSection'
import { CountriesOfResidenceSubSection } from './CountriesOfResidenceSubSection'
import { StaysAbroadSubSection } from './StaysAbroadSubSection'

export const InformationSection = buildSection({
  id: 'information',
  title: information.general.sectionTitle,
  children: [
    ResidenceConditionsSubSection,
    ParentsSubSection,
    MaritalStatusSubSection,
    CountriesOfResidenceSubSection,
    StaysAbroadSubSection,
  ],
})
