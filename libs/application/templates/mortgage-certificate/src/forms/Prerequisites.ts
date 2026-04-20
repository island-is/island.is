import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import {
  IdentityApi,
  UserProfileApi,
  SyslumadurPaymentCatalogApi,
  MockableSyslumadurPaymentCatalogApi,
} from '../dataProviders'
import { confirmation, externalData, payment, property } from '../lib/messages'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  logo: DistrictCommissionersLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.general.sectionTitle,
      children: [
        buildExternalDataProvider({
          title: externalData.general.pageTitle,
          id: 'approveExternalData',
          subTitle: externalData.general.subTitle,
          checkboxLabel: externalData.general.checkboxLabel,
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
          dataProviders: [
            buildDataProviderItem({
              provider: IdentityApi,
              title: externalData.labels.nationalRegistryTitle,
              subTitle: externalData.labels.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.labels.userProfileInformationTitle,
              subTitle: externalData.labels.userProfileInformationSubTitle,
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
      id: 'selectRealEstate',
      title: property.general.sectionTitle,
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
