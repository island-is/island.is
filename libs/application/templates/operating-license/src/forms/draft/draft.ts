import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  buildCustomField,
  buildFileUploadField,
  Application,
  buildKeyValueField,
  buildDescriptionField,
} from '@island.is/application/core'
import { attachmentNames, m } from '../../lib/messages'
import {
  APPLICATION_TYPES,
  Operation,
  UPLOAD_ACCEPT,
} from '../../lib/constants'
import { DefaultEvents } from '@island.is/application/core'
import { applicationInfo } from './sectionApplicationInfo'
import { subSectionOperationInfo } from './subSectionOperationInfo'
import { subSectionPropertyRepeater } from './subSectionPropertyRepeater'
import { subSectionOpeningHours } from './subSectionOpeningHours'
import { subSectionOtherInfo } from './subSectionOtherInfo'
import { sectionOverview } from './sectionOverview'

export const Draft: Form = buildForm({
  id: 'OperatingLicenseApplicationDraftForm',
  title: m.formName,
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
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
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
            buildDataProviderItem({
              id: 'payment',
              type: 'FeeInfoProvider',
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
              id: 'overview.attachments.one',
              title: attachmentNames.one,
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildFileUploadField({
              id: 'attachments.healthLicense.file',
              title: '',
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: m.uploadHeader,
              uploadDescription: m.uploadDescription,
              uploadButtonLabel: m.uploadButtonLabel,
            }),
            buildDescriptionField({
              id: 'overview.attachments.two',
              title: attachmentNames.two,
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildFileUploadField({
              id: 'attachments.formerLicenseHolderConfirmation.file',
              title: '',
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: m.uploadHeader,
              uploadDescription: m.uploadDescription,
              uploadButtonLabel: m.uploadButtonLabel,
            }),
            buildDescriptionField({
              id: 'overview.attachments.three',
              title: attachmentNames.three,
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildFileUploadField({
              id: 'attachments.houseBlueprints.file',
              title: '',
              uploadAccept: UPLOAD_ACCEPT,
              uploadHeader: m.uploadHeader,
              uploadDescription: m.uploadDescription,
              uploadButtonLabel: m.uploadButtonLabel,
            }),
            buildDescriptionField({
              id: 'overview.attachments.four',
              title: attachmentNames.four,
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildFileUploadField({
              id: 'attachments.outsideBlueprints.file',
              title: '',
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
              title: '',
              component: 'PaymentCharge',
            }),
            buildSubmitField({
              id: 'payment',
              placement: 'footer',
              title: '',
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
