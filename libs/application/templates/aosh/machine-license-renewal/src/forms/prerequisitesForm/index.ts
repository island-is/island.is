import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { AoshLogo } from '@island.is/application/assets/institution-logos'
import {
  IdentityApi,
  MachineLicenseRightsApi,
  MockableVinnueftirlitidPaymentCatalogApi,
  UserProfileApiWithValidation,
  VinnueftirlitidPaymentCatalogApi,
} from '../../dataProviders'
import { prerequisites } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  logo: AoshLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: prerequisites.general.tabTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: prerequisites.general.title,
          subTitle: prerequisites.general.subTitle,
          checkboxLabel: prerequisites.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: IdentityApi,
              title: prerequisites.nationalRegistry.title,
              subTitle: prerequisites.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApiWithValidation,
              title: prerequisites.userProfile.title,
              subTitle: prerequisites.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: MachineLicenseRightsApi,
              title: prerequisites.machineLicenseRights.title,
              subTitle: prerequisites.machineLicenseRights.subTitle,
            }),
            buildDataProviderItem({
              provider: VinnueftirlitidPaymentCatalogApi,
            }),
            buildDataProviderItem({
              provider: MockableVinnueftirlitidPaymentCatalogApi,
            }),
          ],
          submitField: buildSubmitField({
            id: 'submit',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: prerequisites.general.submitButton,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
