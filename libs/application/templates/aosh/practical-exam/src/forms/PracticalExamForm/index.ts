import { buildForm, getValueViaPath } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { informationSection } from './InformationSection'
import { examineeSection } from './ExamineeSection'
import { instructorSection } from './InstructorSection'
import { paymentArrangementSection } from './PaymentArrangement'
import { overviewSection } from './Overview'
import {
  buildFormConclusionSection,
  buildFormPaymentChargeOverviewSection,
} from '@island.is/application/ui-forms'
import { getChargeItems } from '../../utils'
import { conclusion, payment } from '../../lib/messages'
import { PaymentOptions } from '../../shared/constants'
import { examCategoriesSection } from './ExamCategories'

export const PracticalExamForm: Form = buildForm({
  id: 'PracticalExamFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    informationSection,
    examineeSection,
    instructorSection,
    examCategoriesSection,
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
      alertTitle: conclusion.default.alertTitle, // TODO: Add seminar name from answers
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
