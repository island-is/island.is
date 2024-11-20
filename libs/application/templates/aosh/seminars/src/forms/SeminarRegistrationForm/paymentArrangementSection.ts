import {
  buildCompanySearchField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { paymentArrangement } from '../../lib/messages'

export const paymentArrangementSection = buildSection({
  id: 'paymentArrangementSection',
  title: paymentArrangement.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'paymentArrangement.multiField',
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
              value: 'individual',
              label: paymentArrangement.labels.individual,
            },
            { value: 'company', label: paymentArrangement.labels.company },
          ],
        }),
        buildDescriptionField({
          id: 'paymentArrangement.paymentOptionsDescription',
          title: paymentArrangement.labels.paymentOptions,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildRadioField({
          id: 'paymentArrangement.paymentOptions',
          title: '',
          width: 'half',
          options: [
            {
              value: 'cashOnDelivery',
              label: paymentArrangement.labels.cashOnDelivery,
            },
            {
              value: 'putIntoAccount',
              label: paymentArrangement.labels.putIntoAccount,
            },
          ],
        }),
        buildDescriptionField({
          id: 'paymentArrangement.companyInfoDescription',
          title: paymentArrangement.labels.companyInfo,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildCompanySearchField({
          id: 'paymentArrangement.companySSN',
          title: paymentArrangement.labels.companySSN,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'paymentArrangement.companySSN',
          title: paymentArrangement.labels.companySSN,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'paymentArrangement.companyName',
          title: paymentArrangement.labels.companyName,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'paymentArrangement.contactEmail',
          title: paymentArrangement.labels.contactEmail,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'paymentArrangement.contactPhone',
          title: paymentArrangement.labels.contactPhone,
          width: 'half',
          required: true,
        }),
      ],
    }),
  ],
})
