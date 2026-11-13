import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import { application, externalData } from '../lib/messages'
import {
  IdentityApi,
  LicensesApi,
  MockableVinnueftirlitidPaymentCatalogApi,
  UserProfileApi,
  VinnueftirlitidPaymentCatalogApi,
} from '../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  logo: AoshLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'externalData',
      tabTitle: application.prerequisiteTabTitle,
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
              provider: IdentityApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: LicensesApi,
              title: externalData.ver.title,
              subTitle: externalData.ver.subTitle,
            }),
            buildDataProviderItem({
              provider: VinnueftirlitidPaymentCatalogApi,
            }),
            buildDataProviderItem({
              provider: MockableVinnueftirlitidPaymentCatalogApi,
            }),
          ],
        }),
      ],
    }),
  ],
})
