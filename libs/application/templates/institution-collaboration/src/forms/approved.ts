import {
  buildForm,
  buildMultiField,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import { institutionApplicationMessages as m } from '../lib/messages'

export const approved: Form = buildForm({
  id: 'InstitutionCollaborationApprovedForm',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'approvedApplication',
      title: '',
      children: [
        buildMultiField({
          id: 'approvedApplicationReview',
          title: m.approved.sectionTitle,
          description: m.approved.sectionDescription,
          children: [
            buildCustomField({
              id: 'reviewScreen',
              title: '',
              component: 'ReviewScreen',
            }),
          ],
        }),
      ],
    }),
  ],
})
