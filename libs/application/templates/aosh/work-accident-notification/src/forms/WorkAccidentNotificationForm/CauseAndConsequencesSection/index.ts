import { buildSection } from '@island.is/application/core'
import { sections } from '../../../lib/messages'
import { absenceSection } from './absence'
import { circumstancesSection } from './circumstances'
import { causeOfInjurySection } from './causeOfInjury'
import { typeOfInjurySection } from './typeOfInjury'
import { injuredBodyPartsSection } from './injuredBodyParts'
import { deviationSection } from './deviation'
import { FormValue } from '@island.is/application/types'
import { WorkAccidentNotification } from '../../..'

export const causeAndConsequencesSection = (index: number) =>
  buildSection({
    id: `causeAndConsequencesSection ${index}`,
    title: sections.draft.causes,
    condition: (formValue: FormValue) => {
      const answers = formValue as WorkAccidentNotification
      return index < answers.employeeAmount || index === 0
    },
    children: [
      absenceSection(index),
      circumstancesSection(index),
      deviationSection(index),
      causeOfInjurySection(index),
      typeOfInjurySection(index),
      injuredBodyPartsSection(index),
    ],
  })
