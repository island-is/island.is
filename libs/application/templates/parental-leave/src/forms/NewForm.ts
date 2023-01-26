import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'

import Logo from '../assets/Logo'
import {
  inReviewFormMessages,
} from '../lib/messages'

export const NewForm: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'residentGrantApplication',
      title: 'Dvalarstyrkur',
      children: [
        buildCustomField({
          id: 'residentGrantApplicationInfo',
          title: 'Dvalarstyrkur',
          description: 'Dvalarstyrkur er fjárstyrkur til barnshafandi foreldris sem er nauðsynlegt að mati sérfræðilæknis að dvelja fjarri heimili sínu í tengslum við nauðsynlega þjónustu vegna fæðingar barns, svo sem vegna fjarlægðar, færðar, óveðurs, verkfalls eða áhættumeðgöngu. Styrkurinn er greiddur eftir á.',
          component: 'ResidentGrantApplication',
        }),
      ]
    })
  ],
})
