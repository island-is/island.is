import { buildMultiField } from '@island.is/application/core'
import { buildSection } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ApplicantType } from '../../shared/constants'
import { getCountriesAsOption } from '../../utils'
import { buildSelectField } from '@island.is/application/core'
import * as m from '../../lib/messages'

export const studentResidencySection = buildSection({
  id: 'residencySectionStudent',
  title: m.application.residency.sectionTitle,
  children: [
    buildMultiField({
      id: 'residencyMultiField',
      title: m.application.residency.studentSectionDescription,
      children: [
        buildSelectField({
          id: 'residencyStudentSelectField',
          title: m.application.residency.studentSectionSelectionTitle,
          required: true,
          options: ({ externalData }) => getCountriesAsOption(externalData),
          defaultValue: '',
          placeholder: m.application.residency.studentSectionPlaceholderText,
        }),
      ],
    }),
  ],
  condition: (answers: FormValue) =>
    answers.studentOrTouristRadioFieldTourist === ApplicantType.STUDENT,
})
