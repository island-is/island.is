import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { conclusionSection } from './conclusionSection'
import { prerequisitesSection } from './prerequisitesSection'
import { Logo } from '../../assets/Logo'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { payment } from '../../lib/messages'
import { getChargeItemCodes } from '../../utils'

export const TransferOfMachineOwnershipForm: Form = buildForm({
  id: 'TransferOfMachineOwnershipFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    prerequisitesSection,
    informationSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (_) =>
        getChargeItemCodes().map((x) => ({
          chargeItemCode: x,
        })),
    }),
    conclusionSection,
  ],
})
