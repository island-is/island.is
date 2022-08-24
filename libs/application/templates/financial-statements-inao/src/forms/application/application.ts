import {
  buildForm,
  buildSection,
  buildFileUploadField,
  buildExternalDataProvider,
  buildDataProviderItem,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { clientInfoSection } from './shared/about/clientInfoSection'
import { m } from '../../lib/messages'
import { overviewSection } from './shared/overviewSection'
import { Logo } from '../../components'
import {
  CARETAKERLIMIT,
  CEMETRY,
  GREATER,
  INDIVIDUAL,
} from '../../lib/constants'
import { cemetryKeyNumbersSection } from './cemetry/cemetryKeyNumbers'
import { partyKeyNumbersSection } from './party/partyKeyNumbers'
import { individualKeyNumbersSection } from './individual/individualKeyNumbers'
import { electionInfoSection } from './shared/electionInfo/electionInfo'
import { cemetryCaretaker } from './cemetry/cemetryCareTaker'

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
      electionInfoSection,
      individualKeyNumbersSection,
      cemetryKeyNumbersSection,
      cemetryCaretaker,
      partyKeyNumbersSection,
      buildSection({
        id: 'documents',
        title: m.financialStatement,
        condition: (answers, externalData) => {
          /* @ts-ignore */
          const userType = externalData?.currentUserType?.data?.code
          const incomeLimit = getValueViaPath(answers, 'election.incomeLimit')
          return incomeLimit === GREATER || userType !== INDIVIDUAL
        },
        children: [
          buildFileUploadField({
            id: 'attachment.file',
            title: m.upload,
            condition: (answers, externalData) => {
              // @ts-ignore
              const userType = externalData?.currentUserType?.data?.code
              const applicationAnswers = <FinancialStatementsInao>answers
              const currentAssets = applicationAnswers.cemetryAsset?.current
              const totalIncome = applicationAnswers.cemetryIncome?.total
              const longTermDebt = applicationAnswers.cemetryLiability?.longTerm
              const isUnderLimit = parseInt(totalIncome, 10) < CARETAKERLIMIT
              if (
                userType === CEMETRY &&
                isUnderLimit &&
                currentAssets === '0' &&
                longTermDebt === '0'
              ) {
                return false
              }
              return true
            },
            introduction: m.uploadIntro,
            description: m.uploadDescription,
            uploadHeader: m.uploadHeader,
            uploadAccept: '.pdf',
            uploadDescription: m.uploadAccept,
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
