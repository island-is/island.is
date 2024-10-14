import { buildSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages'
import { absenceSection } from './absence'
import { circumstancesSection } from './circumstances'
import { causeOfInjurySection } from './causeOfInjury'
import { typeOfInjurySection } from './typeOfInjury'
import { injuredBodyPartsSection } from './injuredBodyParts'
import { deviationSection } from './deviation'
import { FormValue } from '@island.is/application/types'

export const causeAndConsequencesSection = (index: number) =>
  buildSection({
    id: `causeAndConsequencesSection ${index}`,
    title: sections.draft.causes,
    condition: (formValue: FormValue, externalData, user) => {
      // TODO Nonsense condition for testing,
      // Potentially could look into answers here to determine if this section should be displayed i.e employee nr. x
      return index === 0
    },
    children: [
      absenceSection,
      circumstancesSection,
      deviationSection,
      causeOfInjurySection,
      typeOfInjurySection,
      injuredBodyPartsSection,
    ],
  })
