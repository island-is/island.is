import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation, payment } from '../../lib/messages'
import { informationSection } from './InformationSection'
import { prerequisitesSection } from './prerequisitesSection'
import { Logo } from '../../assets/Logo'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeCodeItems } from '../../utils'
import { time } from 'console'

export const DigitalTachographWorkshopCardForm: Form = buildForm({
  id: 'DigitalTachographWorkshopCardFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    prerequisitesSection,
    informationSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (_) =>
        getChargeCodeItems().map((item) => ({
          chargeItemCode: item.code,
          chargeItemQuantity: item.quantity,
        })),
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
