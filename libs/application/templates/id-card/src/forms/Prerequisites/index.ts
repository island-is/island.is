import {
  buildAlertMessageField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  buildMultiField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import {
  applicantInformation,
  confirmation,
  externalData,
  idInformation,
  payment,
  review,
} from '../../lib/messages'
import {
  DeliveryAddressApi,
  IdentityDocumentApi,
  MockableSyslumadurPaymentCatalogApi,
  NationalRegistryUser,
  SyslumadurPaymentCatalogApi,
  UserInfoApi,
} from '../../dataProviders'
import { priceList } from '../../lib/messages/priceList'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'preInformation',
      title: externalData.preInformation.sectionTitle,

      children: [
        buildMultiField({
          id: 'preInformation.multifield',
          title: externalData.preInformation.sectionTitle,
          description: externalData.preInformation.description,
          children: [
            buildAlertMessageField({
              id: 'preInformation.alertField.hasValidCard',
              alertType: 'info',
              message: externalData.preInformation.hasValidCardAlert,
              marginTop: 0,
            }),
            buildAlertMessageField({
              id: 'preInformation.alertField.lostOldCard',
              alertType: 'info',
              message: externalData.preInformation.lostOldCardAlert,
              marginTop: 0,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.dataProvider.pageTitle,
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: externalData.dataProvider.submitButton,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUser,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: UserInfoApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),

            buildDataProviderItem({
              provider: DeliveryAddressApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: IdentityDocumentApi,
              title: externalData.identityDocument.title,
              subTitle: externalData.identityDocument.subTitle,
            }),
            buildDataProviderItem({
              provider: SyslumadurPaymentCatalogApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: MockableSyslumadurPaymentCatalogApi,
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'idInformation',
      title: idInformation.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'applicantInformation',
      title: applicantInformation.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'priceList',
      title: priceList.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'review',
      title: review.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
