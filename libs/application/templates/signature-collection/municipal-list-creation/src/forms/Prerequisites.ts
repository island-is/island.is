import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSubmitField,
  buildSection,
  buildMultiField,
  buildDescriptionField,
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
import Logo from '../../assets/Logo'
import DigitalServices from '../../assets/DigitalServices'

export const Prerequisites: Form = buildForm({
  id: 'CreateListPrerequisites',
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
            buildImageField({
              id: 'introImage',
              image: DigitalServices,
              imageWidth: '50%',
              imagePosition: 'center',
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
            /*buildDataProviderItem({
              provider: MunicipalCollectionApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: MunicipalIdentityApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: CandidateApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: IsDelegatedToCompanyApi,
              title: '',
              subTitle: '',
            }),*/
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
      id: 'screen4',
      title: m.overview,
      children: [],
    }),
    buildSection({
      id: 'screen5',
      title: m.confirmCreation,
      children: [],
    }),
    buildSection({
      id: 'screen6',
      title: m.listCreated,
      children: [],
    }),
  ],
})
