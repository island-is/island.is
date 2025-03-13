import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { NationalRegistryUserParentB } from '../dataProviders'
import { externalData } from '../lib/messages'
import { StateParentBSection } from './Review/State/StateParentB'
import { OverviewSection } from './Review/Overview'
import { Routes } from '../lib/constants'

export const ParentB: Form = buildForm({
  id: 'IdCardApplicationParentB',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'preInformation',
      title: externalData.preInformation.sectionTitle,
      children: [
        buildMultiField({
          id: 'preInformation.multifield',
          title: externalData.preInformation.title,
          description: ({ answers }) => ({
            ...externalData.preInformation.parentBIntroText,
            values: {
              guardianName: getValueViaPath(
                answers,
                `${Routes.FIRSTGUARDIANINFORMATION}.name`,
                '',
              ) as string,
              childName: getValueViaPath(
                answers,
                `${Routes.APPLICANTSINFORMATION}.name`,
                '',
              ) as string,
            },
          }),
          children: [
            buildDescriptionField({
              id: 'preInformation.parentB',
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
