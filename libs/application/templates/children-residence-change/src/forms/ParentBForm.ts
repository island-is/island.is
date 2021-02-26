import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import Logo from '../../assets/Logo'
import * as m from '../lib/messages'

export const ParentBForm: Form = buildForm({
  id: 'ParentBForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'approveTermsParentB',
      title: m.section.effect,
      children: [
        buildCustomField({
          id: 'approveTermsParentB',
          title: m.terms.general.pageTitle,
          component: 'Terms',
        }),
      ],
    }),
    buildSection({
      id: 'residenceChangeOverview',
      title: m.section.overview,
      children: [
        buildCustomField({
          id: 'residenceChangeReview',
          title: m.contract.general.pageTitle,
          component: 'Overview',
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'residenceChangeConfirmation',
          title: m.confirmation.general.pageTitle,
          component: 'Confirmation',
        }),
      ],
    }),
  ],
})
