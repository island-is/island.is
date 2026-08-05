import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildOverviewField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages/messages'
import { FILE_SIZE_LIMIT } from '../../utils/constants'
import { Comparators } from '@island.is/application/types'
import { getYesNoOptions } from '../../utils/options'
import {
  applicantOverviewItems,
  emailPhonOverviewItems,
  extraInformationAttachmentsOverviewItems,
  extraInformationOverviewItems,
  formerInsuranceAttachmentsOverviewItems,
  formerInsuranceOverviewItems,
  statusAndChildrenOverviewItems,
  statusAttachmentsOverviewItems,
} from '../../utils/overviewUtils'

export const overviewSection = buildSection({
  id: 'confirm',
  title: m.confirmationSection,
  children: [
    buildMultiField({
      id: '',
      title: m.confirmationTitle,
      children: [
        buildOverviewField({
          id: 'applicantOverview',
          title: m.applicantInfoSection,
          items: applicantOverviewItems,
          bottomLine: false,
          backId: 'applicant',
        }),
        buildAlertMessageField({
          id: 'applicantMessage',
          message: m.editNationalRegistryData,
          alertType: 'info',
        }),
        buildOverviewField({
          id: 'emailPhoneOverview',
          items: emailPhonOverviewItems,
        }),
        buildAlertMessageField({
          id: 'applicantMessage',
          message: m.editDigitalIslandData,
          alertType: 'info',
        }),
        buildOverviewField({
          id: 'statusAndChildrenOverview',
          title: m.statusAndChildren,
          items: statusAndChildrenOverviewItems,
          attachments: statusAttachmentsOverviewItems,
          backId: 'statusAndChildren',
        }),
        buildOverviewField({
          id: 'formerInsuranceOverview',
          title: m.formerInsuranceTitle,
          items: formerInsuranceOverviewItems,
          attachments: formerInsuranceAttachmentsOverviewItems,
          backId: 'formerInsurance',
        }),
        buildOverviewField({
          condition: (answers) => {
            const additionalRemarks = getValueViaPath<string>(
              answers,
              'additionalRemarks',
            )
            const additionalFiles = getValueViaPath<Array<File>>(
              answers,
              'additionalFiles',
            )
            return Boolean(additionalRemarks) || Boolean(additionalFiles)
          },
          id: 'extraInformationOverview',
          title: m.extraInformationSectionTitle,
          items: extraInformationOverviewItems,
          attachments: extraInformationAttachmentsOverviewItems,
          backId: 'extraInformationMultiField',
        }),
        buildCheckboxField({
          id: 'confirmCorrectInfo',
          marginTop: 3,
          required: true,
          options: [
            {
              value: YES,
              label: m.confirmCorrectInfo,
            },
          ],
        }),
        buildSubmitField({
          id: 'submit',
          title: m.submitLabel,
          refetchApplicationAfterSubmit: true,
          placement: 'footer',
          actions: [{ event: 'SUBMIT', name: m.submitLabel, type: 'primary' }],
        }),
      ],
    }),
  ],
})
