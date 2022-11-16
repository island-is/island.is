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
import { cemetryKeyNumbersSection } from './cemetry/cemetryKeyNumbers'
import { partyKeyNumbersSection } from './party/partyKeyNumbers'
import { individualKeyNumbersSection } from './individual/individualKeyNumbers'
import { electionInfoSection } from './shared/electionInfo/electionInfo'
import { sectionCemetryCaretaker } from './cemetry/sectionCemetryCaretaker'
import {
  currencyStringToNumber,
  getCurrentUserType,
} from '../../lib/utils/helpers'
import { FSIUSERTYPE, LESS } from '../../types'

export const getApplication = (allowFakeData = false): Form => {
  return buildForm({
    id: 'FinancialStatementsInao',
    title: '',
    renderLastScreenButton: false,
    renderLastScreenBackButton: false,
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
                type: 'IdentityProvider',
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
            ],
          }),
        ],
      }),
      clientInfoSection,
      electionInfoSection,
      individualKeyNumbersSection,
      cemetryKeyNumbersSection,
      sectionCemetryCaretaker,
      partyKeyNumbersSection,
      buildSection({
        id: 'documents',
        title: m.financialStatement,
        condition: (answers, _externalData) => {
          const incomeLimit = getValueViaPath(answers, 'election.incomeLimit')
          return incomeLimit !== LESS
        },
        children: [
          buildFileUploadField({
            id: 'attachments.file',
            title: m.upload,
            condition: (answers, externalData) => {
              const userType = getCurrentUserType(answers, externalData)
              const applicationAnswers = answers as FinancialStatementsInao
              const careTakerLimit =
                applicationAnswers.cemetryOperation?.incomeLimit ?? '0'
              const currentAssets =
                applicationAnswers.cemetryAsset?.fixedAssetsTotal
              const isCemetry = userType === FSIUSERTYPE.CEMETRY
              const totalIncome = isCemetry
                ? applicationAnswers.operatingCost?.total
                : '0'
              const longTermDebt = applicationAnswers.cemetryLiability?.longTerm
              const isUnderLimit =
                currencyStringToNumber(totalIncome) < careTakerLimit

              if (
                isCemetry &&
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
            uploadButtonLabel: m.uploadButtonLabel,
            uploadMultiple: false,
            forImageUpload: false,
          }),
        ],
      }),
      overviewSection,
    ],
  })
}
