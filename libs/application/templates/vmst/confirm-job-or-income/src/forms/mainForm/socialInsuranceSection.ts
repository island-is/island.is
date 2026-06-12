import {
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { isSocialInsurance } from '../../utils/conditions'

export const socialInsuranceSection = buildSection({
  id: 'socialInsuranceSection',
  title: m.application.socialInsuranceHeading,
  condition: isSocialInsurance,
  children: [
    buildMultiField({
      id: 'socialInsuranceMultiField',
      title: m.application.socialInsuranceHeading,
      children: [
        buildDescriptionField({
          id: 'socialInsuranceDesc',
          description: m.application.socialInsuranceDescription,
        }),
        buildFieldsRepeaterField({
          id: 'registerSocialInsurance',
          formTitleNumbering: 'suffix',
          formTitle: (_index, application) => {
            const items = getValueViaPath<Array<unknown>>(
              application.answers,
              'registerSocialInsurance',
            )
            if (!items || items.length <= 1) {
              return ''
            }
            return m.application.socialInsuranceHeading
          },
          addItemButtonText: m.application.addLine,
          minRows: 1,
          fields: {
            socialPaymentType: {
              component: 'select',
              label: m.application.paymentType,
              required: true,
              options: (application) => {
                const incomeTypes =
                  getValueViaPath<Array<{ id?: string; name?: string }>>(
                    application.externalData,
                    'incomeTypes.data.trTypes',
                  ) ?? []

                return incomeTypes.map((type) => ({
                  label: type.name ?? '',
                  value: type.id ?? '',
                }))
              },
            },
            amountPerMonth: {
              component: 'input',
              label: m.application.amountPerMonth,
              type: 'number',
              currency: true,
              required: true,
              min: 0,
            },
            paymentFrequency: {
              component: 'radio',
              largeButtons: true,
              required: true,
              width: 'half',
              options: [
                { value: 'oneTime', label: m.application.oneTimePayment },
                { value: 'monthly', label: m.application.monthlyPayment },
              ],
            },
          },
        }),
      ],
    }),
  ],
})
