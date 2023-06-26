import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildCustomField,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { m } from '../lib/messages'
import {
  IdentityApi,
  NationalRegistryRealEstateApi,
  UserProfileApi,
  SyslumadurPaymentCatalogApi,
} from '../dataProviders'

export const MortgageCertificateForm: Form = buildForm({
  id: 'MortgageCertificateFormDraft',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
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
              provider: IdentityApi,
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryRealEstateApi,
              title: m.nationalRegistryRealEstateTitle,
              subTitle: m.nationalRegistryRealEstateSubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.userProfileInformationTitle,
              subTitle: m.userProfileInformationSubTitle,
            }),
            buildDataProviderItem({
              provider: SyslumadurPaymentCatalogApi,
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'selectRealEstate',
      title: m.property,
      children: [
        buildMultiField({
          id: 'selectRealEstate.info',
          title: m.selectRealEstateTitle,
          space: 1,
          children: [
            buildDescriptionField({
              id: 'selectRealEstateDescription',
              title: '',
              description: m.selectRealEstateDescription,
            }),
            buildCustomField({
              id: 'selectProperty',
              title: '',
              component: 'SelectProperty',
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
      id: 'payment',
      title: m.payment,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: m.confirmation,
      children: [],
    }),
  ],
})
