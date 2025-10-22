import { buildForm } from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { seminarInformationSection } from './SeminarInformation'
import { personalInformationSection } from './PersonalInformation'
import { participantsSection } from './ParticipantsSection'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { payment } from '../../lib/messages'
import { getChargeItems } from '../../utils'
import { paymentArrangementSection } from './PaymentArrangement'
import { overviewSection } from './Overview'

export const SeminarRegistrationForm: Form = buildForm({
  id: 'SeminarRegistrationFormDraft',
  logo: AoshLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: false,
  children: [
    seminarInformationSection,
    personalInformationSection,
    participantsSection,
    paymentArrangementSection,
    overviewSection,
    buildFormPaymentChargeOverviewSection({
      sectionTitle: payment.general.sectionTitle,
      getSelectedChargeItems: (application: Application) =>
        getChargeItems(application).map((x) => ({
          chargeItemCode: x.code,
          chargeItemQuantity: x.quantity,
        })),
    }),
  ],
})
