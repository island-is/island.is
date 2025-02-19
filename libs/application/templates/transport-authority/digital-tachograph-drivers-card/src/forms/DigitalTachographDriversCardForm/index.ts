import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { confirmation, payment } from '../../lib/messages'
import { cardTypeSection } from './CardTypeSection'
import { applicantSection } from './ApplicantSection'
import { prerequisitesSection } from './prerequisitesSection'
import { Logo } from '../../assets/Logo'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItems } from '../../utils'

export const DigitalTachographDriversCardForm: Form = buildForm({
  id: 'DigitalTachographDriversCardFormDraft',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    prerequisitesSection,
    cardTypeSection,
    applicantSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (application) =>
        getChargeItems(application).map((item) => ({
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
