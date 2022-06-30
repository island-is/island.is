import {
  buildForm,
  buildSection,
  buildFileUploadField,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSelectField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { clientInfoSection } from './shared/about/clientInfoSection'
import { m } from '../../lib/messages'
import { keyNumbersSection } from './shared/keyNumbers/keyNumbersSection'
import { overviewSection } from './shared/overviewSection'
import { Logo } from '../../components'
import { PARTY, GREATER, LESS, INDIVIDUAL } from '../../lib/constants'
import { cemetryKeyNumbersSection } from './cemetry/cemetryKeyNumbers'

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
      buildSection({
        id: 'electionInfo',
        title: m.election,
        condition: (_answers, externalData) =>
          externalData?.currentUser?.data?.code === 'individual',
        children: [
          buildMultiField({
            id: 'election',
            title: m.election,
            description: m.fillOutAppopriate,
            children: [
              buildSelectField({
                id: 'election.selectElection',
                title: m.election,
                width: 'half',
                placeholder: m.pickElectionType,
                options: [
                  {
                    label: m.presidentalElection,
                    value: 'Forsetakosningar',
                  },
                  {
                    label: m.parliamentaryElection,
                    value: 'Alþingiskosningar',
                  },
                ],
              }),
              buildDescriptionField({
                id: 'election.electionDescription',
                title: m.campaignCost,
                titleVariant: 'h3',
                description: m.pleaseSelect,
                space: 5,
              }),
              buildRadioField({
                id: 'election.incomeLimit',
                title: '',
                options: [
                  { value: LESS, label: m.lessThanLimit },
                  { value: GREATER, label: m.moreThanLimit },
                ],
                width: 'full',
                largeButtons: true,
              }),
            ],
          }),
        ],
      }),
      cemetryKeyNumbersSection,
      // keyNumbersSection,
      buildSection({
        id: 'documents',
        title: m.financialStatement,
        condition: (answers, externalData) => {
          const userType = externalData?.currentUserType?.data?.code
          const incomeLimit = getValueViaPath(answers, 'election.incomeLimit')
          return incomeLimit === GREATER || userType !== INDIVIDUAL
        },
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
