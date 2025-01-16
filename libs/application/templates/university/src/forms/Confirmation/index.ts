import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  confirmation,
  personal,
  review,
} from '../../lib/messages'
// import { Logo } from '../../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { formerEducation } from '../../lib/messages/formerEducation'

export const Confirmation: Form = buildForm({
  id: 'ConfirmationForm',
  // logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'personal',
      title: personal.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'information',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'formerEducation',
      title: formerEducation.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'review',
      title: review.general.sectionTitle,
      children: [],
    }),
    buildFormConclusionSection({
      alertTitle: confirmation.general.alertTitle,
      expandableHeader: confirmation.general.accordionTitle,
      expandableDescription: confirmation.general.accordionText,
    }),
  ],
})
