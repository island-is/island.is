import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildCustomField,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { MCEvents } from '../lib/constants'

export const MortgageCertificateForm: Form = buildForm({
  id: 'MortgageCertificateFormDraft',
  title: '',
  mode: FormModes.APPLYING,
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
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'nationalRegistryRealEstate',
              type: 'NationalRegistryRealEstateProvider',
              title: m.nationalRegistryRealEstateTitle,
              subTitle: m.nationalRegistryRealEstateSubTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.userProfileInformationTitle,
              subTitle: m.userProfileInformationSubTitle,
            }),
            buildDataProviderItem({
              id: 'payment',
              type: 'FeeInfoProvider',
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'selectRealEstate',
      title: 'Eign',
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
              component: 'PropertiesManager',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: m.continue,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: MCEvents.PENDING,
                  name: m.continue,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: () => {
            return {
              ...m.outroMessage,
            }
          },
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
