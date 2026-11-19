import {
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { FjarskiptastofaLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'

export const completedForm = buildForm({
  id: 'completedForm',
  logo: FjarskiptastofaLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'resultsSection',
      title: m.results.sectionTitle,
      children: [
        buildMultiField({
          id: 'results',
          children: [
            buildCustomField({
              id: 'assessmentResults',
              component: 'AssessmentResults',
            }),
          ],
        }),
      ],
    }),
  ],
})
