import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSubmitField,
  buildSection,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

import { m } from '../lib/messages'
import Logo from '../../assets/Logo'
import { CanSignApi, GetListApi } from '../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'SignListPrerequisites',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: Logo,
  children: [
    buildSection({
      id: 'intro',
      title: m.intro,
      children: [
        buildMultiField({
          id: 'intro',
          title: m.introTitle,
          description: m.introDescription,
          children: [
            buildDescriptionField({
              id: 'introText',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveExternalData',
      title: m.dataCollection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollection,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckbox,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: m.dataCollectionSubmit,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.userProfileProviderTitle,
              subTitle: m.userProfileProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: m.nationalRegistryProviderTitle,
              subTitle: m.nationalRegistryProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: CanSignApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: GetListApi,
              title: '',
              subTitle: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'screen3',
      title: m.information,
      children: [],
    }),
    buildSection({
      id: 'screen7',
      title: m.listSigned,
      children: [],
    }),
  ],
})
