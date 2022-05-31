import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildFileUploadField,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { clientInfoSection } from './personalElection/clientInfoSection'
import { m } from '../../lib/messages'
import { keyNumbersSection } from './shared/keyNumbers/keyNumbersSection'
import { overviewSection } from './shared/overviewSection'

export const getApplication = (): Form => {
  return buildForm({
  id: 'FinancialStatementsInao',
  title: '',
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conditions',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollectionTitle,
          checkboxLabel: m.dataCollectionCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
          ],
        }),
      ],
    }),
    clientInfoSection,
    keyNumbersSection,
    buildSection({
      id: 'documents',
      title: m.financialStatement,
      children: [
        buildFileUploadField({
          id: 'attachment.file',
          title: m.upload,
          introduction: m.uploadIntro,
          description: m.uploadDescription,
          uploadMultiple: false,
          forImageUpload: false,
          doesNotRequireAnswer: true,
        }),
      ],
    }),
    overviewSection
  ],
})
}