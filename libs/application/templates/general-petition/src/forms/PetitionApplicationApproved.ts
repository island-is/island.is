import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const PetitionApplicationApproved: Form = buildForm({
  id: 'PetitionApplicationApproved',
  title: m.overview.finalTitle,
  logo: Logo,
  mode: FormModes.APPROVED,
  children: [
    buildCustomField({
      id: 'thankYou',
      title: m.overview.finalTitle,
      component: 'ListSubmitted',
    }),
  ],
})
