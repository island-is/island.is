import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import {
  employment as employmentMessages,
  application as applicationMessages,
} from '../../../lib/messages'
import { needsMedicalReport } from '../../../utils/needsMedicalReport'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../../shared/constants'
import { GaldurDomainModelsSettingsWorkingCapacityWorkingCapacityDTO } from '@island.is/clients/vmst-unemployment'

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
          options: (application, _, locale) => {
            const workingCapacities =
              getValueViaPath<
                Array<GaldurDomainModelsSettingsWorkingCapacityWorkingCapacityDTO>
              >(
                application.externalData,
                'unemploymentApplication.data.supportData.workingCapacities',
                [],
              ) || []
            return workingCapacities.map((x) => {
              return {
                label: locale === 'is' ? x.name || '' : x.english || '',
                value: x.id || '',
              }
            })
          },
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
