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
import { PaymentOptions } from '../../utils/enums'
import {
  examCategoriesSectionOthers,
  examCategoriesSectionSelf,
} from './ExamCategories'
import { examLocationSection } from './ExamLocation'

export const PracticalExamForm: Form = buildForm({
  id: 'PracticalExamFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    informationSection,
    examineeSection, // Rendered if user is registered not only himself
    instructorSection,
    examCategoriesSectionSelf, // Conditional on registering only himself
    examCategoriesSectionOthers, // Conditional on registering multiple examinees
    examLocationSection,
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
      alertTitle: conclusion.default.alertTitle,
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
