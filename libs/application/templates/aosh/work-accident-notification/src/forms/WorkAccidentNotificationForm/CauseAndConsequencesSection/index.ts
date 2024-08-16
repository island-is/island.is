import { buildSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages/sections'
import { absenceSection } from './absence'
import { circumstancesSection } from './circumstances'
import { causeOfInjurySection } from './causeOfInjury'
import { typeOfInjurySection } from './typeOfInjury'
import { injuredBodyPartsSection } from './injuredBodyParts'
import { deviationSection } from './deviation'

export const causeAndConsequencesSection = buildSection({
  id: 'causeAndConsequencesSection',
  title: sections.draft.causes,
  children: [
    absenceSection,
    circumstancesSection,
    deviationSection,
    causeOfInjurySection,
    typeOfInjurySection,
    injuredBodyPartsSection,
  ],
})
