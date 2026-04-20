import { buildForm, getValueViaPath } from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
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
  logo: AoshLogo,
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
      getSelectedChargeItems: (application: Application) =>
        getChargeItems(application).map((x) => ({
          chargeItemCode: x.code,
          chargeItemQuantity: x.quantity,
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
