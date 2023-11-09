import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { m } from '../lib/messages'

export const Draft: Form = buildForm({
  id: 'SignatureListCreationDraft',
  title: m.applicationName,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalDataSection',
      title: m.dataCollection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollection,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckbox,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: m.nationalRegistryProviderTitle,
              subTitle: m.nationalRegistryProviderSubtitle,
            }),
          ],
        }),
      ],
    }),
  ],
})
