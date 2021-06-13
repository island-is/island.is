import React from 'react'

import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildExternalDataProvider,
  buildKeyValueField,
  buildDataProviderItem,
  buildSubmitField,
  buildCheckboxField,
  buildCustomField,
  buildSelectField,
  buildDividerField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const payment: Form = buildForm({
  id: 'DrivingLicenseApplicationPaymentForm',
  title: 'greiðsla',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'awaitingPayment',
      title: 'Greiðsla',
      children: [
        // TODO: ekki tókst að stofna til greiðslu skjár - condition
        buildDescriptionField({
          id: 'info',
          title: 'Greiðsla',
          description: (application) => {
            const createCharge = application.externalData.createCharge.data as {
              error: ''
              data: { paymentUrl: string }
            }
            if (!createCharge.error) console.log({ createCharge })
            window.document.location.href = createCharge.data.paymentUrl
            return 'Sendi þig áfram á greiðsluveitu...'
          },
        }),
      ],
    }),
  ],
})
