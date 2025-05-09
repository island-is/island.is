import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, IdentityApi } from '@island.is/application/types'
import { FormModes, UserProfileApi } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { externalData } from '../../lib/messages'
import {
  MockableVinnueftirlitidPaymentCatalogApi,
  UserProfileApiWithValidation,
  VinnueftirlitidPaymentCatalogApi,
} from '../../dataProviders'

export const Prerequisites = buildForm({
  id: 'PrerequisitesForm',
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'prerequisitesSection',
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.dataProvider.pageTitle,
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: IdentityApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApiWithValidation,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: VinnueftirlitidPaymentCatalogApi,
            }),
            buildDataProviderItem({
              provider: MockableVinnueftirlitidPaymentCatalogApi,
            }),
            buildDataProviderItem({
              // provider: MissingProvider
              title: externalData.certificates.title,
              subTitle: externalData.certificates.subTitle,
            }),
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
