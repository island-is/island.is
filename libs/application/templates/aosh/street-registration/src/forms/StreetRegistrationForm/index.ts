import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import {
  buildFormConclusionSection,
  buildFormPaymentChargeOverviewSection,
} from '@island.is/application/ui-forms'
import { conclusion, externalData, payment } from '../../lib/messages'
import { getChargeItems } from '../../utils'

export const StreetRegistrationForm: Form = buildForm({
  id: 'StreetRegistrationFormDraft',
  logo: AoshLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    informationSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.title,
      getSelectedChargeItems: (_) =>
        getChargeItems().map((item) => ({
          chargeItemCode: item.code,
          chargeItemQuantity: item.quantity,
        })),
    }),
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.accordionTitle,
      expandableHeader: conclusion.default.expandableHeader,
      expandableDescription: conclusion.default.expandableDescription,
    }),
  ],
})
