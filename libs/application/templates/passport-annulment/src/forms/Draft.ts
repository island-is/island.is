import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildDescriptionField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  PassportsApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'

import { m } from '../lib/messages'
import { info } from './sections/info'
import { overview } from './sections/overveiw'

export const Draft: Form = buildForm({
  id: 'PassportApplicationDraftForm',
  title: m.formName,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalDataSection',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollectionTitle,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              provider: PassportsApi,
              title: m.dataCollectionIdentityDocumentTitle,
              subTitle: m.dataCollectionIdentityDocumentSubtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'passportSection',
      title: m.selectPassportSectionTitle,
      children: [
        buildMultiField({
          id: 'selectPassport',
          title: m.selectPassportSectionTitle,
          description: m.selectPassportSectionDescription,
          children: [
            buildCustomField({
              id: 'passport',
              title: '',
              component: 'PassportSelection',
            }),
            buildDescriptionField({
              id: 'passportNumber',
              title: '',
            }),
            buildDescriptionField({
              id: 'passportName',
              title: '',
            }),
            buildDescriptionField({
              id: 'productionRequestID',
              title: '',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'personalInfoSection',
      title: m.infoTitle,
      children: [info],
    }),

    buildSection({
      id: 'overviewSection',
      title: m.overview,
      children: [overview],
    }),
  ],
})
