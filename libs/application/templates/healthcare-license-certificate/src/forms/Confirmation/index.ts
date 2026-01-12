import {
  buildCustomField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  payment,
  personal,
} from '../../lib/messages'
import { DirectorateOfHealthLogo } from '@island.is/application/assets/institution-logos'

export const Confirmation: Form = buildForm({
  id: 'ConfirmationForm',
  logo: DirectorateOfHealthLogo,
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
      id: 'informationSection',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildCustomField({
      component: 'CustomFormConclusionSectionField',
      id: 'custom.conclusionSection',
      description: '',
    }),
  ],
})
