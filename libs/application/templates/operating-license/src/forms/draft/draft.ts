import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
  Application,
  buildCustomField,
  buildDividerField,
  buildKeyValueField,
  buildCheckboxField,
  buildSubSection,
  buildFileUploadField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { format as formatKennitala } from 'kennitala'
import {
  APPLICATION_TYPES,
  YES,
  NO,
  ResturantTypes,
  HotelTypes,
  Operation,
  OPERATION_CATEGORY,
  UPLOAD_ACCEPT,
} from '../../lib/constants'
import { DefaultEvents, Answer } from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { useFormContext } from 'react-hook-form'
import { applicationInfo } from './sectionApplicationInfo'
import { subSectionOperationInfo } from './subSectionOperationInfo'
import { subSectionPropertyRepeater } from './subSectionPropertyRepeater'
import { subSectionOpeningHours } from './subSectionOpeningHours'
import { subSectionOtherInfo } from './subSectionOtherInfo'

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
            buildCustomField({
              id: 'bullets',
              title: '',
              component: 'Bullets',
            }),
            buildFileUploadField({
              id: 'attachments',
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
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overview,
          description: m.overviewDescription,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overview.infoTitle',
              title: m.infoTitle,
              titleVariant: 'h3',
              description: '',
              space: 'gutter',
            }),
            buildDescriptionField({
              id: 'overview.space',
              title: '',
              description: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.email,
              width: 'half',
              value: (application: Application) =>
                (application.answers.info as {
                  email?: string
                })?.email,
            }),
            buildKeyValueField({
              label: m.phoneNumber,
              width: 'half',
              value: (application: Application) => {
                const phone = (application.answers.info as {
                  phoneNumber?: string
                })?.phoneNumber

                return formatPhoneNumber(phone as string)
              },
            }),
          ],
        }),
      ],
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
