import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  PassportsApi,
} from '@island.is/application/types'
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
  NationalRegistryUser,
  // SyslumadurPaymentCatalogApi,
  UserInfoApi,
} from '../../dataProviders'
import { priceList } from '../../lib/messages/priceList'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'preInformation',
      title: externalData.preInformation.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'preInformation.description',
          title: externalData.preInformation.title,
          description: externalData.preInformation.description,
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
            title: '',
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
              provider: PassportsApi,
              title: externalData.identityDocument.title,
              subTitle: externalData.identityDocument.subTitle,
            }),
            // buildDataProviderItem({
            //   provider: SyslumadurPaymentCatalogApi,
            //   title: '',
            // }),
            buildDataProviderItem({
              provider: DeliveryAddressApi,
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
