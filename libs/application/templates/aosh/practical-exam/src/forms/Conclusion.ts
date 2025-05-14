import { buildForm, getValueViaPath } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../lib/messages'
import { IndividualOrCompany, PaymentOptions } from '../utils/enums'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.pageTitle,
      alertTitle: conclusion.default.alertTitle,
      alertMessage: '',
      expandableHeader: conclusion.default.accordionTitle,
      expandableIntro: '',
      expandableDescription: (application) => {
        const paymentOptions = getValueViaPath<PaymentOptions>(
          application.answers,
          'paymentArrangement.paymentOptions',
        )
        const individualOrCompany = getValueViaPath<IndividualOrCompany>(
          application.answers,
          'paymentArrangement.individualOrCompany',
        )

        return paymentOptions === PaymentOptions.cashOnDelivery ||
          individualOrCompany !== IndividualOrCompany.company
          ? conclusion.default.accordionTextCashOnDelivery
          : conclusion.default.accordionTextPutIntoAccount
      },
    }),
  ],
})
