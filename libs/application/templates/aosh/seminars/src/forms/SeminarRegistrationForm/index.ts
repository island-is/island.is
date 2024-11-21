import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { seminarInformationSection } from './SeminarInformation'
import { personalInformationSection } from './PersonalInformation'
import { participantsSection } from './ParticipantsSection'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { confirmation, payment } from '../../lib/messages'
import { getChargeItemCodes } from '../../utils'
import { paymentArrangementSection } from './PaymentArrangement'
import { overviewSection } from './Overview'

export const SeminarRegistrationForm: Form = buildForm({
  id: 'SeminarRegistrationFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    seminarInformationSection,
    personalInformationSection,
    participantsSection,
    paymentArrangementSection,
    overviewSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (_) =>
        getChargeItemCodes().map((x) => ({
          chargeItemCode: x,
        })),
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
