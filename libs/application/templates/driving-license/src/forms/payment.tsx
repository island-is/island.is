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
  mode: FormModes.EDITING,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'paypay',
      title: 'Greiðsla',
      children: [
        buildMultiField({
          id: 'info',
          title: m.informationMultiFieldTitle,
          children: [
            buildKeyValueField({
              label: 'hoho',
              value: 'hi hi',
              width: 'full',
            }),
            buildDividerField({
              title: '',
              color: 'dark400',
            }),
          ],
        }),
      ],
    }),
  ],
})
