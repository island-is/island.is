import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryV3UserApi,
} from '@island.is/application/types'

import { m } from '../lib/messages'
import DigitalServices from '@island.is/application/templates/signature-collection/assets/DigitalServices'
import { NationalElectoralCommissionLogo } from '@island.is/application/assets/institution-logos'
import { CanSignApi, GetListApi } from '../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'SignListPrerequisites',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: NationalElectoralCommissionLogo,
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
              provider: NationalRegistryV3UserApi,
              title: m.nationalRegistryProviderTitle,
              subTitle: m.nationalRegistryProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: CanSignApi,
            }),
            buildDataProviderItem({
              provider: GetListApi,
            }),
          ],
        }),
      ],
    }),
  ],
})
