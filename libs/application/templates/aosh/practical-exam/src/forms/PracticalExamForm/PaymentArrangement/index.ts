import {
  buildCustomField,
  buildDescriptionField,
  buildLinkField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { paymentArrangement } from '../../../lib/messages'
import {
  IndividualOrCompany,
  PaymentOptions,
  SelfOrOthers,
} from '../../../utils/enums'
import { Application, FormValue } from '@island.is/application/types'
import {
  isIndividual,
  isCompany,
  isPersonType,
  isCompanyAndInvoice,
} from '../../../utils'

export const paymentArrangementSection = buildSection({
  id: 'paymentArrangementSection',
  title: paymentArrangement.general.sectionTitle,
  condition: (answers: FormValue) => {
    const selfOrOthers = getValueViaPath<SelfOrOthers>(
      answers,
      'information.selfOrOthers',
    )
    return selfOrOthers === SelfOrOthers.self ? false : true
  },
  children: [
    buildMultiField({
      id: 'paymentArrangement',
      title: paymentArrangement.general.title,
      children: [
        buildDescriptionField({
          id: 'paymentArrangement.individualOrCompanyDescription',
          title: paymentArrangement.labels.registerForWhich,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: 'paymentArrangement.individualOrCompany',
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
          condition: isPersonType,
          clearOnChange: [
            'paymentArrangement.explanation, paymentArrangement.paymentOptionsDescription',
            'paymentArrangement.paymentOptions',
            'paymentArrangement.companyInfo',
            'paymentArrangement.contactInfo.email',
            'paymentArrangement.contactInfo.phone',
          ],
        }),

        /* INDIVIDUAL */
        buildTextField({
          id: 'paymentArrangement.individualInfo.email',
          title: paymentArrangement.labels.email,
          width: 'half',
          required: true,
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.email',
            ),
          condition: (answers: FormValue) => isIndividual(answers),
        }),
        buildPhoneField({
          id: 'paymentArrangement.individualInfo.phone',
          title: paymentArrangement.labels.phonenumber,
          width: 'half',
          required: true,
          backgroundColor: 'white',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ),
          condition: (answers: FormValue) => isIndividual(answers),
        }),
        buildLinkField({
          id: 'paymentArrangement.individualInfo.changeInfo',
          title: paymentArrangement.labels.changeInfo,
          link: '/minarsidur/min-gogn/stillingar/',
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
          condition: isCompany,
        }),
        buildRadioField({
          id: 'paymentArrangement.paymentOptions',
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
          condition: isCompany,
          clearOnChange: ['paymentArrangement.explanation'],
        }),
        buildDescriptionField({
          id: 'paymentArrangement.companyInfoDescription',
          title: paymentArrangement.labels.companyInfo,
          titleVariant: 'h5',
          marginTop: 3,
          marginBottom: 1,
          condition: isCompany,
        }),
        buildNationalIdWithNameField({
          id: 'paymentArrangement.companyInfo',
          required: true,
          customNationalIdLabel: paymentArrangement.labels.companySSN,
          customNameLabel: paymentArrangement.labels.companyName,
          searchPersons: false,
          searchCompanies: true,
          condition: isCompany,
        }),
        buildTextField({
          id: 'paymentArrangement.contactInfo.email',
          title: paymentArrangement.labels.contactEmail,
          width: 'half',
          required: true,
          condition: isCompany,
        }),
        buildPhoneField({
          id: 'paymentArrangement.contactInfo.phone',
          title: paymentArrangement.labels.contactPhone,
          width: 'half',
          required: true,
          condition: isCompany,
        }),
        buildDescriptionField({
          id: 'paymentArrangement.explanationWithPayment',
          title: paymentArrangement.labels.explanationWithPayment,
          titleVariant: 'h5',
          marginTop: 3,
          marginBottom: 1,
          condition: isCompanyAndInvoice,
        }),
        buildTextField({
          id: 'paymentArrangement.explanation',
          title: paymentArrangement.labels.explanation,
          rows: 1,
          maxLength: 40,
          showMaxLength: true,
          condition: isCompanyAndInvoice,
        }),
        buildCustomField({
          id: 'paymentArrangement.watchCompanyNationalId',
          component: 'WatchCompanyNationalId',
          condition: isCompany,
        }),
        /* COMPANY ENDS */
      ],
    }),
  ],
})
