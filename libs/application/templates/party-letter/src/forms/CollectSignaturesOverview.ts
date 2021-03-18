import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const CollectSignaturesOverview: Form = buildForm({
  id: 'LetterApplicationSignatureOverview',
  title: 'Meðmælendur',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'recommendations',
      title: m.recommendations.title,
      children: [
        buildCustomField({
          id: 'gatherRecommendations',
          title: m.recommendations.title,
          component: 'Recommendations',
        }),
      ],
    }),
  ],
})
