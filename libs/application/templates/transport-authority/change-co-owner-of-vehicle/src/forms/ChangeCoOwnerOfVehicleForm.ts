import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildCustomField,
  buildSubmitField,
  buildMultiField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messagesx'
import { payment, externalData } from '../lib/messages'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  SamgongustofaPaymentCatalogApi,
  CurrentVehiclesApi,
} from '../dataProviders'

export const ChangeCoOwnerOfVehicleForm: Form = buildForm({
  id: 'ChangeCoOwnerOfVehicleFormDraft',
  title: '',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'externalData',
      title: m.externalDataSection,
      children: [
        buildExternalDataProvider({
          title: m.externalDataTitle,
          id: 'approveExternalData',
          subTitle: m.externalDataSubTitle,
          checkboxLabel: m.externalDataAgreement,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: CurrentVehiclesApi,
              title: externalData.currentVehicles.title,
              subTitle: externalData.currentVehicles.subTitle,
            }),
            buildDataProviderItem({
              provider: SamgongustofaPaymentCatalogApi,
              title: externalData.payment.title,
              subTitle: externalData.payment.subTitle,
            }),
          ],
        }),
      ],
    }),
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
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.confirm,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirm,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [
        buildCustomField({
          component: 'ConfirmationField',
          id: 'ConfirmationField',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
