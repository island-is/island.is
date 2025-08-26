import {
  buildCustomField,
  buildDescriptionField,
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
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import {
  isCompany,
  isCompanyType,
  isPersonType,
  isApplyingForMultiple,
  companyCondition,
} from '../../../utils'
import { IndividualOrCompany, PaymentOptions } from '../../../shared/types'

export const paymentArrangementSection = buildSection({
  id: 'paymentArrangementSection',
  title: paymentArrangement.general.sectionTitle,
  condition: (answers: FormValue) => {
    const userIsApplyingForMultiple = isApplyingForMultiple(answers)
    return userIsApplyingForMultiple
  },
  children: [
    buildMultiField({
      id: 'paymentArrangementMultiField',
      title: paymentArrangement.general.title,
      children: [
        buildDescriptionField({
          id: 'paymentArrangement.individualOrCompanyDescription',
          title: paymentArrangement.labels.registerForWhich,
          titleVariant: 'h5',
          condition: (_, externalData: ExternalData) =>
            isPersonType(externalData),
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
          condition: (_, externalData: ExternalData) =>
            isPersonType(externalData),
        }),

        /* COMPANY */
        buildDescriptionField({
          id: 'paymentArrangement.paymentOptionsDescription',
          title: paymentArrangement.labels.paymentOptions,
          titleVariant: 'h5',
          marginTop: 3,
          condition: companyCondition,
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
          condition: companyCondition,
        }),
        buildDescriptionField({
          id: 'paymentArrangement.companyInfoDescription',
          title: paymentArrangement.labels.companyInfo,
          titleVariant: 'h5',
          marginTop: 3,
          marginBottom: 1,
          condition: companyCondition,
        }),
        buildTextField({
          id: 'paymentArrangement.companyInfo.nationalId',
          title: paymentArrangement.labels.companySSN,
          width: 'half',
          readOnly: true,
          required: true,
          format: '######-####',
          defaultValue: (application: Application) => {
            const nationalId = getValueViaPath<string>(
              application.externalData,
              'identity.data.nationalId',
            )

            return nationalId
          },
          condition: (_, externalData: ExternalData) =>
            isCompanyType(externalData),
        }),
        buildTextField({
          id: 'paymentArrangement.companyInfo.name',
          title: paymentArrangement.labels.companyName,
          width: 'half',
          readOnly: true,
          required: true,
          defaultValue: (application: Application) => {
            const name = getValueViaPath<string>(
              application.externalData,
              'identity.data.name',
            )

            return name
          },
          condition: (_, externalData: ExternalData) =>
            isCompanyType(externalData),
        }),
        buildNationalIdWithNameField({
          id: 'paymentArrangement.companyInfo',
          required: true,
          customNationalIdLabel: paymentArrangement.labels.companySSN,
          customNameLabel: paymentArrangement.labels.companyName,
          searchPersons: false,
          searchCompanies: true,
          condition: (answers: FormValue, externalData: ExternalData) =>
            !isCompanyType(externalData) && isCompany(answers),
        }),
        buildTextField({
          id: 'paymentArrangement.contactInfo.email',
          title: paymentArrangement.labels.contactEmail,
          width: 'half',
          required: true,
          condition: companyCondition,
        }),
        buildPhoneField({
          id: 'paymentArrangement.contactInfo.phone',
          title: paymentArrangement.labels.contactPhone,
          width: 'half',
          required: true,
          condition: companyCondition,
        }),
        buildCustomField({
          id: 'paymentArrangement.watchCompanyNationalId',
          title: '',
          component: 'WatchCompanyNationalId',
          condition: companyCondition,
        }),
        buildTextField({
          id: 'paymentArrangement.explanation',
          title: paymentArrangement.labels.explanation,
          placeholder: paymentArrangement.labels.explanationPlaceholder,
          maxLength: 40,
          showMaxLength: true,
          condition: (answers: FormValue, externalData: ExternalData) => {
            const paymentArrangement = getValueViaPath<PaymentOptions>(
              answers,
              'paymentArrangement.paymentOptions',
            )

            return (
              companyCondition(answers, externalData) &&
              paymentArrangement === PaymentOptions.putIntoAccount
            )
          },
        }),
        /* COMPANY ENDS */
      ],
    }),
  ],
})
