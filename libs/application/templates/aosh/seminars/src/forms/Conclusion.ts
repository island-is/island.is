import { buildForm, getValueViaPath } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../lib/messages'
import { isApplyingForMultiple, isIndividual } from '../utils'
import { PaymentOptions } from '../shared/types'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  logo: AoshLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.pageTitle,
      alertTitle: (application) => {
        const seminarName = getValueViaPath<string>(
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
        const paymentOptions = getValueViaPath<PaymentOptions>(
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
