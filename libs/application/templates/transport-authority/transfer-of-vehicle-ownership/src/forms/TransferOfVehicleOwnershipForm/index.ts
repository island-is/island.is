import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { externalData, payment } from '../../lib/messages'
import { m } from '../../lib/messagess'
import { informationSection } from './InformationSection'
import { conclusionSection } from './conclusionSection'
import { paymentSection } from './paymentSection'

export const TransferOfVehicleOwnershipForm: Form = buildForm({
  id: 'TransferOfVehicleOwnershipFormDraft',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    informationSection,
    // This section will not be here
    /* buildSection({
      id: 'applicationStatus',
      title: payment.general.sectionTitle,
      children: [
        buildCustomField({
          component: 'ApplicationStatus',
          id: 'ApplicationStatus',
          title: '',
          description: '',
        }),
      ],
    }), */
    paymentSection,
    conclusionSection,
    // This section will probably be removed
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildCustomField({
          component: 'ConfirmationField',
          id: 'ConfirmationField',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
