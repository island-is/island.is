import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
} from '@island.is/application/core'
import Logo from '../assets/Logo'
import { inReview } from '../lib/messages'

export const AssigneeInReview: Form = buildForm({
  id: 'AssigneeInReview',
  title: inReview.general.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'review',
      title: '',
      children: [
        buildCustomField(
          {
            id: 'ReviewForm',
            title: '',
            component: 'ReviewForm',
          },
          {
            isAssignee: true,
          },
        ),
      ],
    }),
  ],
})
