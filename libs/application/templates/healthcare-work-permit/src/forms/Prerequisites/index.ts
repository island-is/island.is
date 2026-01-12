import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import {
  confirmation,
  externalData,
  information,
  payment,
  personal,
} from '../../lib/messages'
import {
  EmbaettiLandlaeknisPaymentCatalogApi,
  HealtcareLicenesApi,
  UserProfileApi,
  ProcessPermitsApi,
} from '../../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
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
          checkboxLabel: externalData.dataProvider.checkboxLabel,
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
              provider: NationalRegistryUserApi.configure({
                params: {
                  citizenshipWithinEES: true,
                },
              }),
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: HealtcareLicenesApi,
              title: externalData.healtcareLicenses.title,
              subTitle: externalData.healtcareLicenses.subTitle,
            }),
            buildDataProviderItem({
              title: externalData.universityOfIceland.title,
              subTitle: externalData.universityOfIceland.subTitle,
            }),
            buildDataProviderItem({
              provider: EmbaettiLandlaeknisPaymentCatalogApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: ProcessPermitsApi,
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'personal',
      title: personal.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'selectLicenseSection',
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
