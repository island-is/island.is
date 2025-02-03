import { buildForm, getValueViaPath } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { seminarInformationSection } from './SeminarInformation'
import { personalInformationSection } from './PersonalInformation'
import { participantsSection } from './ParticipantsSection'
import {
  buildFormConclusionSection,
  buildFormPaymentChargeOverviewSection,
} from '@island.is/application/ui-forms'
import { conclusion, payment } from '../../lib/messages'
import { getChargeItems } from '../../utils'
import { paymentArrangementSection } from './PaymentArrangement'
import { overviewSection } from './Overview'
import { PaymentOptions } from '../../shared/contstants'

export const SeminarRegistrationForm: Form = buildForm({
  id: 'SeminarRegistrationFormDraft',
  title: '',
  logo: Logo,
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
      getSelectedChargeItems: (_) =>
        getChargeItems().map((x) => ({
          chargeItemCode: x.code,
        })),
    }),
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.pageTitle,
      alertTitle: (application) => {
        const seminarName = getValueViaPath(
          application.externalData,
          'seminar.data.name',
          '',
        )
        return {
          id: conclusion.default.alertTitle.id,
          values: { seminar: seminarName },
        }
      },
      alertMessage: '',
      expandableHeader: conclusion.default.accordionTitle,
      expandableIntro: '',
      expandableDescription: (application) => {
        const paymentOptions = getValueViaPath(
          application.answers,
          'paymentArrangement.paymentOptions',
        )
        return paymentOptions === PaymentOptions.cashOnDelivery
          ? conclusion.default.accordionTextCashOnDelivery
          : conclusion.default.accordionTextPutIntoAccount
      },
    }),
  ],
})
