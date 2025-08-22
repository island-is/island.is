import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSubmitField,
  buildSection,
  buildMultiField,
  buildImageField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import Logo from '@island.is/application/templates/signature-collection/assets/Logo'
import DigitalServices from '@island.is/application/templates/signature-collection/assets/DigitalServices'
import { CandidateApi, MunicipalCollectionApi } from '../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'createListPrerequisites',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: Logo,
  children: [
    buildSection({
      id: 'intro',
      children: [
        buildMultiField({
          id: 'intro',
          title: m.introTitle,
          description: m.introDescription,
          children: [
            buildImageField({
              id: 'introImage',
              image: DigitalServices,
              imageWidth: 'auto',
              imagePosition: 'center',
              marginTop: 'gutter',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveExternalData',
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
              provider: MunicipalCollectionApi,
            }),
            buildDataProviderItem({
              provider: CandidateApi,
            }),
          ],
        }),
      ],
    }),
  ],
})
