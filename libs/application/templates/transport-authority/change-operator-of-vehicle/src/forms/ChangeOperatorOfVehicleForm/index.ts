import {
  buildForm,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion } from '../../lib/messages'
import { externalDataSection } from './externalDataSection'
import { informationSection } from './InformationSection'
import { paymentSection } from './paymentSection'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'

export const ChangeOperatorOfVehicleForm: Form = buildForm({
  id: 'ChangeOperatorOfVehicleFormDraft',
  logo: TransportAuthorityLogo,
  mode: FormModes.DRAFT,
  children: [
    externalDataSection,
    informationSection,
    paymentSection,
    buildSection({
      id: 'tmp',
      title: conclusion.general.sectionTitle,
      children: [
        // Only to have submit button visible
        buildTextField({
          id: 'tmp',
          description: '',
        }),
      ],
    }),
  ],
})
