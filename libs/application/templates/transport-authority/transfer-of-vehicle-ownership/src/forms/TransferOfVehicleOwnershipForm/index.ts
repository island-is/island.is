import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { conclusionSection } from './conclusionSection'
import { paymentSection } from './paymentSection'
import { prerequisitesSection } from './prerequisitesSection'

export const TransferOfVehicleOwnershipForm: Form = buildForm({
  id: 'TransferOfVehicleOwnershipFormDraft',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    prerequisitesSection,
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
  ],
})
