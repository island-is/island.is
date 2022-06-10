import {
  buildForm,
  buildSection,
  buildFileUploadField,
  buildExternalDataProvider,
  buildDataProviderItem,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { clientInfoSection } from './personalElection/clientInfoSection'
import { m } from '../../lib/messages'
import { keyNumbersSection } from './shared/keyNumbers/keyNumbersSection'
import { overviewSection } from './shared/overviewSection'
import { Logo } from '../../components'
import { GREATER } from '../../lib/constants'

export const getApplication = (): Form => {
  return buildForm({
    id: 'FinancialStatementsInao',
    title: '',
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    mode: FormModes.APPLYING,
    logo: Logo,
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
              buildDataProviderItem({
                id: 'currentUserType',
                type: 'CurrentUserTypeProvider',
                title: '',
                subTitle: '',
              }),
              buildDataProviderItem({
                id: 'clientTypes',
                type: 'ClientTypesProvider',
                title: '',
                subTitle: '',
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
        condition: (answers) =>
        getValueViaPath(answers, 'electionInfo.incomeLimit') === GREATER,
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
      overviewSection,
    ],
  })
}
