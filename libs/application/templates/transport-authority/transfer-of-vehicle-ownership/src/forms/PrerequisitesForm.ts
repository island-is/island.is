//TODO delete this file

import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { information, externalData, payment, conclusion } from '../lib/messages'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          title: externalData.dataProvider.pageTitle,
          id: 'approveExternalData',
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              id: 'payment',
              type: 'PaymentChargeInfoProvider',
              title: externalData.payment.title,
              subTitle: externalData.payment.subTitle,
            }),
            buildDataProviderItem({
              id: 'currentVehicleList',
              type: 'CurrentVehiclesProvider',
              title: externalData.currentVehicles.title,
              subTitle: externalData.currentVehicles.subTitle,
            }),
            buildDataProviderItem({
              id: 'insuranceCompanyList',
              type: 'InsuranceCompaniesProvider',
              title: '',
            }),
          ],
        }),
        buildMultiField({
          id: 'getDataSuccess',
          title: externalData.dataProvider.getDataSuccess,
          description: externalData.dataProvider.getDataSuccessDescription,
          children: [
            buildDescriptionField({
              id: 'getDataSuccess.nationalRegistry',
              title: externalData.nationalRegistry.title,
              description: externalData.nationalRegistry.subTitle,
              titleVariant: 'h4',
            }),
            buildDescriptionField({
              id: 'getDataSuccess.userProfile',
              title: externalData.userProfile.title,
              description: externalData.userProfile.subTitle,
              titleVariant: 'h4',
              space: 'gutter',
            }),
            buildSubmitField({
              id: 'getDataSuccess.toDraft',
              title: externalData.dataProvider.submitButton,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: externalData.dataProvider.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'informationSection',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: conclusion.general.sectionTitle,
      children: [],
    }),
  ],
})
