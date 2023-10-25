import {
  buildForm,
  buildSection,
  buildCustomField,
  buildSubmitField,
  buildMultiField,
  buildTextField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { ChangeOperatorOfVehicle } from '../../lib/dataSchema'
import { conclusion, payment } from '../../lib/messages'
import { getChargeItemCodes } from '../../utils'
import { externalDataSection } from './externalDataSection'
import { informationSection } from './InformationSection'
import { Logo } from '../../assets/Logo'
import { getChargeItemCodeWithAnswers } from '../../utils/getChargeItemCodes'

export const ChangeOperatorOfVehicleForm: Form = buildForm({
  id: 'ChangeOperatorOfVehicleFormDraft',
  title: '',
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    externalDataSection,
    informationSection,
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'paymentMultiField',
          title: payment.general.pageTitle,
          space: 1,
          children: [
            buildCustomField({
              id: 'PaymentChargeOverview',
              title: '',
              component: 'PaymentChargeOverview',
            }),
            buildCustomField({
              id: 'ValidationErrorMessages',
              title: '',
              component: 'ValidationErrorMessages',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: payment.general.confirm,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: payment.general.confirm,
                  type: 'primary',
                  condition: (formValue, externalData) => {
                    const chargeItemCodes = getChargeItemCodeWithAnswers(
                      formValue as ChangeOperatorOfVehicle,
                    )
                    const allItems = externalData?.payment?.data as [
                      {
                        priceAmount: number
                        chargeItemName: string
                        chargeItemCode: string
                      },
                    ]
                    const items = chargeItemCodes.map((chargeItemCode) => {
                      return allItems.find(
                        (item) => item.chargeItemCode === chargeItemCode,
                      )
                    })
                    return items.length > 0
                  },
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'tmp',
      title: conclusion.general.sectionTitle,
      children: [
        // Only to have submit button visible
        buildTextField({
          id: 'tmp',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
