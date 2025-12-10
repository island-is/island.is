import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFileUploadField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages/messages'
import { EmploymentStatus, FILE_SIZE_LIMIT } from '../../utils/constants'
import { getYesNoOptions, statusTypeOptions } from '../../utils/options'
import { Application } from '@island.is/application/types'
import { ExternalDataNationalRegistry } from '../../utils/types'

export const statusAndChildrenSection = buildSection({
  id: 'statusAndChildrenSection',
  title: m.statusAndChildren,
  children: [
    buildMultiField({
      id: 'statusAndChildren',
      title: m.statusAndChildren,
      children: [
        buildHiddenInput({
          id: 'citizenship',
          defaultValue: (application: Application) => {
            const citizenship = (
              getValueViaPath(
                application.externalData,
                'nationalRegistry',
              ) as ExternalDataNationalRegistry
            )?.data?.citizenship

            return JSON.stringify(citizenship)
          },
        }),
        buildRadioField({
          id: 'status.type',
          description: m.statusDescription,
          width: 'half',
          required: true,
          largeButtons: true,
          options: statusTypeOptions,
        }),
        buildDescriptionField({
          id: 'confirmationOfStudiesDescription',
          description: m.confirmationOfStudies,
          tooltip: m.confirmationOfStudiesTooltip,
          condition: (answers) =>
            (answers.status as { type: string })?.type ===
            EmploymentStatus.STUDENT,
        }),
        buildFileUploadField({
          id: 'status.confirmationOfStudies',
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          uploadHeader: m.fileUploadHeader,
          uploadDescription: m.fileUploadDescription,
          uploadButtonLabel: m.fileUploadButton,
          condition: (answers) =>
            (answers.status as { type: string })?.type ===
            EmploymentStatus.STUDENT,
        }),
        buildRadioField({
          id: 'children',
          description: m.childrenDescription,
          width: 'half',
          largeButtons: true,
          required: true,
          options: getYesNoOptions({}),
        }),
        buildAlertMessageField({
          id: 'childrenInfo',
          title: m.childrenInfoMessageTitle,
          message: m.childrenInfoMessageText,
          alertType: 'info',
          condition: (answers) => answers.children === YES,
        }),
      ],
    }),
  ],
})
