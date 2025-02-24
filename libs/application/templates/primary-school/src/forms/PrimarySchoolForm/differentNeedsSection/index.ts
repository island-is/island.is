import { buildSection } from '@island.is/application/core'
import { primarySchoolMessages } from '../../../lib/messages'
import { allergiesAndIntolerancesSubSection } from './allergiesAndIntolerancesSubSection'
import { freeSchoolMealSubSection } from './freeSchoolMealSubSection'
import { languageSubSection } from './languageSubSection'
import { supportSubSection } from './supportSubSection'

export const differentNeedsSection = buildSection({
  id: 'differentNeedsSection',
  title: primarySchoolMessages.differentNeeds.sectionTitle,
  children: [
    languageSubSection,
    freeSchoolMealSubSection,
    allergiesAndIntolerancesSubSection,
    supportSubSection,
  ],
})
