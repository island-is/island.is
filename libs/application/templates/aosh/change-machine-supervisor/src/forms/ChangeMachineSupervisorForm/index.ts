import {
  buildForm,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../../lib/messages'
import { externalDataSection } from './externalDataSection'
import { informationSection } from './InformationSection'
import { Logo } from '../../assets/Logo'

export const ChangeOperatorOfVehicleForm: Form = buildForm({
  id: 'ChangeOperatorOfVehicleFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    externalDataSection,
    informationSection,
    buildSection({
      id: 'tmp',
      title: conclusion.general.sectionTitle,
      children: [
        // Only to have submit button visible
        buildTextField({
          id: 'tmp',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
