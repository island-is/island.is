import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes, FormValue } from '@island.is/application/types'
import { informationSection } from './InformationSection'
import { Logo } from '../../assets/Logo'
import {
  buildFormConclusionSection,
  buildFormPaymentChargeOverviewSection,
  buildFormPaymentChargeOverviewSubSection,
} from '@island.is/application/ui-forms'
import { conclusion, externalData, payment } from '../../lib/messages'
import { getChargeItemCodes } from '../../utils'
import { isPaymentRequiredSubSection } from '../../utils/isPaymentRequired'
export const TransferOfMachineOwnershipForm: Form = buildForm({
  id: 'TransferOfMachineOwnershipFormDraft',
  title: '',
  logo: Logo,
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
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      condition: (answers: FormValue, externalData) =>
        !isPaymentRequiredSubSection(answers, externalData),
      children: [
        buildFormPaymentChargeOverviewSubSection({
          sectionTitle: payment.general.sectionTitle,
          getSelectedChargeItems: (_) =>
            getChargeItemCodes().map((x) => ({
              chargeItemCode: x,
            })),
        }),
      ],
    }),

    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.accordionTitle,
      alertMessage: conclusion.default.alertMessage,
      expandableHeader: conclusion.default.accordionTitle,
      expandableDescription: conclusion.default.accordionText,
    }),
  ],
})
