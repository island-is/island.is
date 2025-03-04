import { buildForm, getValueViaPath } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../assets/Logo'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../lib/messages'
import { PaymentOptions } from '../shared/contstants'
import { isApplyingForMultiple, isIndividual } from '../utils'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
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
        const userIsApplyingForMultiple = isApplyingForMultiple(
          application.answers,
        )

        const userIsIndividual = isIndividual(application.answers)
        return userIsIndividual || !userIsApplyingForMultiple
          ? conclusion.default.accordionTextCashOnDelivery
          : paymentOptions === PaymentOptions.putIntoAccount
          ? conclusion.default.accordionTextPutIntoAccount
          : conclusion.default.accordionTextCashOnDelivery
      },
    }),
  ],
})
