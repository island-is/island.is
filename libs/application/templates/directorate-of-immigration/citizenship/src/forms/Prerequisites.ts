import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import {
  confirmation,
  externalData,
  information,
  payment,
} from '../lib/messages'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  UtlendingastofnunPaymentCatalogApi,
} from '../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          title: externalData.dataProvider.pageTitle,
          id: 'approveExternalData',
          subTitle: externalData.dataProvider.subTitle,
          description: externalData.dataProvider.description,
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
              provider: UtlendingastofnunPaymentCatalogApi,
              title: '',
            }),
            buildDataProviderItem({
              id: 'currentResidencePermit',
              title: externalData.directorateOfImmigration.title,
              subTitle: externalData.directorateOfImmigration.subTitle,
            }),
            buildDataProviderItem({
              id: 'meansOfSupport',
              title: externalData.icelandRevenueAndCustoms.title,
              subTitle: externalData.icelandRevenueAndCustoms.subTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
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
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
