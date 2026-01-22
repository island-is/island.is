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
  UserProfileApi,
} from '@island.is/application/types'

import { m } from '../lib/messages'
import {
  ParliamentaryCollectionApi,
  ParliamentaryIdentityApi,
  IsDelegatedToCompanyApi,
  CandidateApi,
} from '../dataProviders'
import DigitalServices from '@island.is/application/templates/signature-collection/assets/DigitalServices'
import { NationalRegistryLogo } from '@island.is/application/assets/institution-logos'

export const Prerequisites: Form = buildForm({
  id: 'CreateListPrerequisites',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: NationalRegistryLogo,
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
              id: 'doneImage',
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
              provider: ParliamentaryCollectionApi,
            }),
            buildDataProviderItem({
              provider: ParliamentaryIdentityApi,
            }),
            buildDataProviderItem({
              provider: CandidateApi,
            }),
            buildDataProviderItem({
              provider: IsDelegatedToCompanyApi,
            }),
          ],
        }),
      ],
    }),
  ],
})
