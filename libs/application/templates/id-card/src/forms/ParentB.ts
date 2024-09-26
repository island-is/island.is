import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { NationalRegistryUserParentB } from '../dataProviders'
import { externalData } from '../lib/messages'
import { StateParentBSection } from './Review/State/StateParentB'
import { OverviewSection } from './Review/Overview'

export const ParentB: Form = buildForm({
  id: 'IdCardApplicationParentB',
  title: '',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'preInformation',
      title: externalData.preInformation.sectionTitle,
      children: [
        buildMultiField({
          id: 'preInformation.multifield',
          title: externalData.preInformation.title,
          children: [
            buildDescriptionField({
              id: 'preInformation.parentB',
              title: '',
              description: externalData.preInformation.parentBIntroText,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'externalDataSection',
      title: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalDataParentB',
          title: externalData.dataProvider.pageTitle,
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserParentB,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
          ],
        }),
      ],
    }),
    StateParentBSection,
    OverviewSection,
  ],
})
