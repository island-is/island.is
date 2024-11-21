import {
  buildAlertMessageField,
  buildCompanySearchField,
  buildCustomField,
  buildDescriptionField,
  buildLinkField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { paymentArrangement } from '../../../lib/messages'
import { IndividualOrCompany, PaymentOptions } from '../../../shared/contstants'
import { FormValue } from '@island.is/application/types'
import { isIndividual, isCompany } from '../../../utils'

export const paymentArrangementSection = buildSection({
  id: 'paymentArrangementSection',
  title: paymentArrangement.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentArrangementMultiField',
      title: paymentArrangement.general.title,
      children: [
        buildDescriptionField({
          id: 'paymentArrangement.individualOrCompanyDescription',
          title: paymentArrangement.labels.registerForWhich,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: 'paymentArrangement.individualOrCompany',
          title: '',
          width: 'half',
          options: [
            {
              value: IndividualOrCompany.individual,
              label: paymentArrangement.labels.individual,
            },
            {
              value: IndividualOrCompany.company,
              label: paymentArrangement.labels.company,
            },
          ],
        }),

        /* INDIVIDUAL */
        buildTextField({
          id: 'paymentArrangement.individualInfo.email',
          title: paymentArrangement.labels.email,
          width: 'half',
          required: true,
          condition: (answers: FormValue) => isIndividual(answers),
        }),
        buildTextField({
          id: 'paymentArrangement.individualInfo.phone',
          title: paymentArrangement.labels.phonenumber,
          width: 'half',
          required: true,
          condition: (answers: FormValue) => isIndividual(answers),
        }),
        buildLinkField({
          id: 'paymentArrangement.individualInfo.changeInfo',
          title: paymentArrangement.labels.changeInfo,
          link: 'https://www.island.is',
          variant: 'text',
          iconProps: { icon: 'arrowForward' },
          justifyContent: 'flexEnd',
          condition: (answers: FormValue) => isIndividual(answers),
        }),
        /* INDIVIDUAL ENDS */

        /* COMPANY */
        buildDescriptionField({
          id: 'paymentArrangement.paymentOptionsDescription',
          title: paymentArrangement.labels.paymentOptions,
          titleVariant: 'h5',
          marginTop: 3,
          condition: (answers: FormValue) => isCompany(answers),
        }),
        buildRadioField({
          id: 'paymentArrangement.paymentOptions',
          title: '',
          width: 'half',
          options: [
            {
              value: PaymentOptions.cashOnDelivery,
              label: paymentArrangement.labels.cashOnDelivery,
            },
            {
              value: PaymentOptions.putIntoAccount,
              label: paymentArrangement.labels.putIntoAccount,
            },
          ],
          condition: (answers: FormValue) => isCompany(answers),
        }),
        buildDescriptionField({
          id: 'paymentArrangement.companyInfoDescription',
          title: paymentArrangement.labels.companyInfo,
          titleVariant: 'h5',
          marginTop: 3,
          marginBottom: 1,
          condition: (answers: FormValue) => isCompany(answers),
        }),
        buildCompanySearchField({
          id: 'paymentArrangement.companyInfo',
          title: paymentArrangement.labels.companySSN,
          required: true,
          condition: (answers: FormValue) => isCompany(answers),
        }),
        buildTextField({
          id: 'paymentArrangement.contactInfo.email',
          title: paymentArrangement.labels.contactEmail,
          width: 'half',
          required: true,
          condition: (answers: FormValue) => isCompany(answers),
        }),
        buildTextField({
          id: 'paymentArrangement.contactInfo.phone',
          title: paymentArrangement.labels.contactPhone,
          width: 'half',
          required: true,
          condition: (answers: FormValue) => isCompany(answers),
        }),
        buildAlertMessageField({
          id: 'paymentArrangement.contactOrganizationAlert',
          title: '',
          message: paymentArrangement.labels.contactOrganizationAlert,
          alertType: 'error',
          marginTop: 5,
          condition: (answers: FormValue) => isCompany(answers),
        }),
        buildDescriptionField({
          id: 'paymentArrangement.explanationWithPayment',
          title: paymentArrangement.labels.explanationWithPayment,
          titleVariant: 'h5',
          marginTop: 3,
          marginBottom: 1,
          condition: (answers: FormValue) => isCompany(answers),
        }),
        buildTextField({
          id: 'paymentArrangement.explanation',
          title: paymentArrangement.labels.explanation,
          condition: (answers: FormValue) => isCompany(answers),
        }),
        /* COMPANY ENDS */

        buildCustomField({
          id: 'paymentArrangement.agreementCheckbox',
          title: '',
          component: 'AgreementCheckbox',
        }),
      ],
    }),
  ],
})
