import { buildRadioField } from '@island.is/application/core'

import { buildMultiField } from '@island.is/application/core'

import { buildSection } from '@island.is/application/core'
import { getContinentsAsOption } from '../../utils'
import { FormValue } from '@island.is/application/types'
import * as m from '../../lib/messages'
import { ApplicantType } from '../../shared/constants'

export const touristResidencySection = buildSection({
  id: 'residencySectionTourist',
  title: m.application.residency.sectionTitle,
  children: [
    buildMultiField({
      id: 'residencyMultiField',
      title: m.application.residency.touristSectionDescription,
      children: [
        buildRadioField({
          id: 'residencyTouristRadioField',
          required: true,
          options: ({ externalData }) => getContinentsAsOption(externalData),
          width: 'half',
        }),
      ],
    }),
  ],
  condition: (answers: FormValue) =>
    answers.studentOrTouristRadioFieldTourist === ApplicantType.TOURIST,
})
