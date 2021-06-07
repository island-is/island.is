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
import { NationalRegistryUser, UserProfile } from '../types/schema'
import { m } from '../lib/messages'

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
        buildDescriptionField({
          id: 'info',
          title: m.informationMultiFieldTitle,
          description: (application) => {
            console.log({ application })
            return 'Skemmtu þér vel...'
          }
        }),
      ],
    }),
  ],
})
