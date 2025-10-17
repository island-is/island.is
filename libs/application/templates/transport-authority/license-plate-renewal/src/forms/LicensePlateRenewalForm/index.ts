import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { conclusion, payment } from '../../lib/messages'
import { informationSection } from './InformationSection'
import { prerequisitesSection } from './prerequisitesSection'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItems } from '../../utils'

export const LicensePlateRenewalForm: Form = buildForm({
  id: 'LicensePlateRenewalFormDraft',
  logo: TransportAuthorityLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    prerequisitesSection,
    informationSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (application) =>
        getChargeItems(application).map((item) => ({
          chargeItemCode: item.code,
          chargeItemQuantity: item.quantity,
        })),
    }),
    buildSection({
      id: 'conclusion',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
  ],
})
