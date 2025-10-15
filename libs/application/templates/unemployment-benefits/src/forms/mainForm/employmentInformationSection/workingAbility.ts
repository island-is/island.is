import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import {
  employment as employmentMessages,
  application as applicationMessages,
} from '../../../lib/messages'
import { WorkingAbility } from '../../../shared'
import { needsMedicalReport } from '../../../utils/needsMedicalReport'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../../shared/constants'

export const workingAbilitySubSection = buildSubSection({
  id: 'workingAbilitySubSection',
  title: employmentMessages.workingAbility.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'workingAbilitySubSection',
      title: employmentMessages.workingAbility.general.pageTitle,
      children: [
        buildDescriptionField({
          id: 'workingAbilityDescription',
          title:
            employmentMessages.workingAbility.labels.workingAbilityDescription,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: 'workingAbility.status',
          title: employmentMessages.workingAbility.labels.workingAbilityLabel,
          backgroundColor: 'blue',
          required: true,
          options: [
            {
              value: WorkingAbility.ABLE,
              label: employmentMessages.workingAbility.labels.optionFullTime,
            },
            {
              value: WorkingAbility.PARTLY_ABLE,
              label: employmentMessages.workingAbility.labels.optionPartTime,
            },
            {
              value: WorkingAbility.DISABILITY,
              label: employmentMessages.workingAbility.labels.optionDisability,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'workingAbilityAlertMessage',
          message: employmentMessages.workingAbility.labels.partTimeInfoBox,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: needsMedicalReport,
        }),
        buildFileUploadField({
          id: 'workingAbility.medicalReport',
          title:
            employmentMessages.workingAbility.labels.partTimeFileUploadLabel,
          uploadHeader:
            employmentMessages.workingAbility.labels.partTimeFileUploadLabel,
          uploadDescription: applicationMessages.fileUploadAcceptFiles,
          uploadAccept: UPLOAD_ACCEPT,
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          condition: needsMedicalReport,
        }),
      ],
    }),
  ],
})
