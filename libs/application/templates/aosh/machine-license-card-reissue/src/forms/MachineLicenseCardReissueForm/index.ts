import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { payment } from '../../lib/messages'
import { getChargeItems } from '../../utils'
import { conclusionSection } from '../conclusionSection'
import { applicantSection } from './applicantSection'
import { cardDeliverySection } from './cardDeliverySection'
import { overviewSection } from './overviewSection'

export const MachineLicenseCardReissueForm: Form = buildForm({
  id: 'MachineLicenseCardReissueFormDraft',
  logo: AoshLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    applicantSection,
    cardDeliverySection,
    overviewSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: () =>
        getChargeItems().map((x) => ({
          chargeItemCode: x.code,
          chargeItemQuantity: x.quantity,
        })),
    }),
    conclusionSection,
  ],
})
