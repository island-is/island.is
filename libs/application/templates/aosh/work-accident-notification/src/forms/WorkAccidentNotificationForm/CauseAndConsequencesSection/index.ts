import { buildSection, getValueViaPath } from '@island.is/application/core'
import { sections } from '../../../lib/messages'
import { absenceSection } from './absence'
import { circumstancesSection } from './circumstances'
import { causeOfInjurySection } from './causeOfInjury'
import { typeOfInjurySection } from './typeOfInjury'
import { injuredBodyPartsSection } from './injuredBodyParts'
import { deviationSection } from './deviation'
import { FormValue } from '@island.is/application/types'
import { WorkAccidentNotification } from '../../../lib/dataSchema'

export const causeAndConsequencesSection = (index: number) =>
  buildSection({
    id: `causeAndConsequencesSection ${index}`,
    title: () => {
      return {
        ...sections.draft.causes,
        values: {
          number: index + 1,
        },
      }
    },
    condition: (formValue: FormValue, externalData, user) => {
      const answers = formValue as WorkAccidentNotification
      return index < answers.employeeAmount
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
