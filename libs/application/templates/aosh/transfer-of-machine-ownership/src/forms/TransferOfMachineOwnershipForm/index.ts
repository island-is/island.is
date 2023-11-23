import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { conclusionSection } from './conclusionSection'
import { paymentSection } from './paymentSection'
import { prerequisitesSection } from './prerequisitesSection'
import { Logo } from '../../assets/Logo'

export const TransferOfMachineOwnershipForm: Form = buildForm({
  id: 'TransferOfMachineOwnershipFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    prerequisitesSection,
    informationSection,
    paymentSection,
    conclusionSection,
  ],
})
