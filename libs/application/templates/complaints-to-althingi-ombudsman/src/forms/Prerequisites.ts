import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { application, dataProvider, section } from '../lib/messages'
import { AlthingiOmbudsmanLogo } from '@island.is/application/assets/institution-logos'

export const Prerequisites: Form = buildForm({
  id: 'ComplaintToAlthinigOmbudsmanPrerequisites',
  title: application.general.name,
  mode: FormModes.DRAFT,
  logo: AlthingiOmbudsmanLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'conditions',
      title: section.dataCollection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: dataProvider.dataProviderHeader,
          subTitle: dataProvider.dataProviderSubTitle,
          checkboxLabel: dataProvider.dataProviderCheckboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryV3UserApi,
              title: dataProvider.nationalRegistryTitle,
              subTitle: dataProvider.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: dataProvider.userProfileTitle,
              subTitle: dataProvider.userProfileSubTitle,
            }),
            buildDataProviderItem({
              title: dataProvider.notificationTitle,
              subTitle: dataProvider.notificationSubTitle,
            }),
          ],
        }),
      ],
    }),
  ],
})
