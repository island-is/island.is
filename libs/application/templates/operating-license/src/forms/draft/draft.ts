import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildCustomField,
  buildFileUploadField,
  buildDescriptionField,
} from '@island.is/application/core'
import { attachmentNames, m } from '../../lib/messages'
import { UPLOAD_ACCEPT } from '../../lib/constants'
import {
  DefaultEvents,
  Form,
  FormModes,
  UserProfileApi,
} from '@island.is/application/types'
import { applicationInfo } from './sectionApplicationInfo'
import { subSectionOperationInfo } from './subSectionOperationInfo'
import { subSectionPropertyRepeater } from './subSectionPropertyRepeater'
import { subSectionOpeningHours } from './subSectionOpeningHours'
import { subSectionOtherInfo } from './subSectionOtherInfo'
import { sectionOverview } from './sectionOverview'
import {
  JudicialAdministrationApi,
  CriminalRecordApi,
  NoDebtCertificateApi,
  SyslumadurPaymentCatalogApi,
} from '../../dataProviders'
import { fakeDataSection } from './fakeDataSection'

export const getApplication = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'OperatingLicenseApplicationDraftForm',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      ...(allowFakeData ? [fakeDataSection] : []),
      buildSection({
        id: 'externalData',
        title: m.dataCollectionTitle,
        children: [
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: m.formName,
            subTitle: m.dataCollectionSubtitle,
            checkboxLabel: m.dataCollectionCheckboxLabel,
            dataProviders: [
              buildDataProviderItem({
                provider: UserProfileApi,
                title: m.dataCollectionUserProfileTitle,
                subTitle: m.dataCollectionUserProfileSubtitle,
              }),
              buildDataProviderItem({
                provider: NoDebtCertificateApi,
                title: m.dataCollectionDebtStatusTitle,
                subTitle: m.dataCollectionDebtStatusSubtitle,
              }),
              buildDataProviderItem({
                provider: JudicialAdministrationApi,
                title: m.dataCollectionNonBankruptcyDisclosureTitle,
                subTitle: m.dataCollectionNonBankruptcyDisclosureSubtitle,
              }),
              buildDataProviderItem({
                provider: CriminalRecordApi,
                title: m.dataCollectionCriminalRecordTitle,
                subTitle: m.dataCollectionCriminalRecordSubtitle,
              }),
              buildDataProviderItem({
                provider: SyslumadurPaymentCatalogApi,
                title: '',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'applicationInfo',
        title: m.operationTitle,
        children: [applicationInfo],
      }),
      buildSection({
        id: 'info',
        title: m.infoTitle,
        children: [
          subSectionOperationInfo,
          subSectionPropertyRepeater,
          subSectionOpeningHours,
          subSectionOtherInfo,
        ],
      }),
      buildSection({
        id: 'attachmentsScreen',
        title: m.attachments,
        children: [
          buildMultiField({
            id: 'attachmentsScreen',
            title: m.attachments,
            description: m.attachmentsDescription,
            children: [
              buildDescriptionField({
                id: 'overview.attachments.three',
                title: attachmentNames.three,
                titleVariant: 'h4',
                space: 'gutter',
              }),
              buildFileUploadField({
                id: 'attachments.houseBlueprints.file',
                uploadAccept: UPLOAD_ACCEPT,
                uploadHeader: m.uploadHeader,
                uploadDescription: m.uploadDescription,
                uploadButtonLabel: m.uploadButtonLabel,
              }),
              buildDescriptionField({
                id: 'overview.attachments.one',
                title: attachmentNames.one,
                titleVariant: 'h4',
                space: 'containerGutter',
              }),
              buildFileUploadField({
                id: 'attachments.healthLicense.file',
                uploadAccept: UPLOAD_ACCEPT,
                uploadHeader: m.uploadHeader,
                uploadDescription: m.uploadDescription,
                uploadButtonLabel: m.uploadButtonLabel,
              }),
              buildDescriptionField({
                id: 'overview.attachments.two',
                title: attachmentNames.two,
                titleVariant: 'h4',
                space: 'containerGutter',
              }),
              buildFileUploadField({
                id: 'attachments.formerLicenseHolderConfirmation.file',
                uploadAccept: UPLOAD_ACCEPT,
                uploadHeader: m.uploadHeader,
                uploadDescription: m.uploadDescription,
                uploadButtonLabel: m.uploadButtonLabel,
              }),
              buildDescriptionField({
                id: 'overview.attachments.four',
                title: attachmentNames.four,
                titleVariant: 'h4',
                space: 'containerGutter',
              }),
              buildFileUploadField({
                id: 'attachments.outsideBlueprints.file',
                uploadAccept: UPLOAD_ACCEPT,
                uploadHeader: m.uploadHeader,
                uploadDescription: m.uploadDescription,
                uploadButtonLabel: m.uploadButtonLabel,
              }),
              buildDescriptionField({
                id: 'overview.attachments.five',
                title: attachmentNames.five,
                titleVariant: 'h4',
                space: 'containerGutter',
              }),
              buildFileUploadField({
                id: 'attachments.otherFiles.file',
                uploadAccept: UPLOAD_ACCEPT,
                uploadHeader: m.uploadHeader,
                uploadDescription: m.uploadDescription,
                uploadButtonLabel: m.uploadButtonLabel,
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'overview',
        title: m.overview,
        children: [sectionOverview],
      }),
      buildSection({
        id: 'payment',
        title: m.paymentSection,
        children: [
          buildMultiField({
            id: 'payment',
            title: m.paymentSectionTitle,
            children: [
              buildCustomField({
                id: 'paymentCharge',
                component: 'PaymentCharge',
                doesNotRequireAnswer: true,
              }),
              buildSubmitField({
                id: 'payment',
                placement: 'footer',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.PAYMENT,
                    name: m.proceedToPayment,
                    type: 'primary',
                  },
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
