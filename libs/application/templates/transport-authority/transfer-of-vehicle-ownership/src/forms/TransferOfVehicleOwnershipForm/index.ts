import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { conclusionSection } from './conclusionSection'
import { paymentSection } from './paymentSection'
import { prerequisitesSection } from './prerequisitesSection'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'

export const TransferOfVehicleOwnershipForm: Form = buildForm({
  id: 'TransferOfVehicleOwnershipFormDraft',
  logo: TransportAuthorityLogo,
  mode: FormModes.DRAFT,
  children: [
    prerequisitesSection,
    informationSection,
    paymentSection,
    conclusionSection,
  ],
})
