import { buildSection } from '@island.is/application/core'
import { propertyInfoSubsection } from './propertyInfoSubsection'
import { conditionSubsection } from './conditionSubsection'
import { fireProtectionsSubsection } from './fireProtectionsSubsection'
import { propertySearchSubsection } from './propertySearchSubsection'
import { descriptionAndSpecialProvisionsSubsection } from './descriptionAndSpecialProvisionsSubsection'
import * as m from '../../../lib/messages'

export const rentalHousingSection = buildSection({
  id: 'rentalHousingSection',
  title: m.application.housingSectionName,
  children: [
    propertySearchSubsection,
    propertyInfoSubsection,
    descriptionAndSpecialProvisionsSubsection,
    conditionSubsection,
    fireProtectionsSubsection,
  ],
})
