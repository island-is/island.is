import {
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import { FishingLicenseEnum } from '../../types'
import {
  licenseHasAreaSelection,
  licenseHasFileUploadField,
  licenseHasRailNetAndRoeNetField,
  FILE_UPLOAD_ACCEPT,
} from '../../utils/licenses'

// Condition that determines whether given license has file upload field
const hasFileUpload = (formValue: FormValue) => {
  const selectedLicenseType = getValueViaPath(
    formValue,
    'fishingLicense.license',
    '',
  ) as FishingLicenseEnum
  return licenseHasFileUploadField(selectedLicenseType)
}

// Condition that determines whether given license has special fields
const hasRailNetAndRoeNetField = (formValue: FormValue) => {
  const selectedLicenseType = getValueViaPath(
    formValue,
    'fishingLicense.license',
    '',
  ) as FishingLicenseEnum
  return licenseHasRailNetAndRoeNetField(selectedLicenseType)
}

// Condition that determines whether given license has special fields
const hasAreaSelection = (formValue: FormValue) => {
  const selectedLicenseType = getValueViaPath(
    formValue,
    'fishingLicense.license',
    '',
  ) as FishingLicenseEnum
  return licenseHasAreaSelection(selectedLicenseType)
}

export const fishingLicenseFurtherInfoSection = buildSection({
  id: 'fishingLicenseFurtherInformationSection',
  title: fishingLicenseFurtherInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'fishingLicenseFurtherInformation',
      title: '',
      description: '',
      children: [
        // Custom field to replace section title
        // i.e. to make it dynamic
        buildCustomField({
          id: 'fishingLicenseFurtherInformation.customTitle',
          title: '',
          doesNotRequireAnswer: true,
          component: 'FishingLicenseFurtherInfoTitleSection',
        }),
        // Select fishing area field is visible for a subset of licenses
        buildDescriptionField({
          id: 'area-selection-title',
          space: 6,
          title: fishingLicenseFurtherInformation.labels.area,
          titleVariant: 'h5',
          doesNotRequireAnswer: true,
          condition: hasAreaSelection,
        }),
        buildCustomField({
          id: 'fishingLicenseFurtherInformation.areaWithDate',
          title: '',
          doesNotRequireAnswer: true,
          component: 'AreaWithDateSelection',
          condition: hasAreaSelection,
        }),
        // Date field is visible for all types of licenses
        // But this simplified input is hidden for licenses that have
        // area selection because in that case, min and max dates depend
        // on the area selected
        buildDescriptionField({
          id: 'date-title',
          space: 6,
          title: fishingLicenseFurtherInformation.labels.date,
          titleVariant: 'h5',
          doesNotRequireAnswer: true,
          condition: (formValue) => !hasAreaSelection(formValue),
        }),
        buildDateField({
          id: 'fishingLicenseFurtherInformation.date',
          title: fishingLicenseFurtherInformation.labels.date,
          minDate: new Date(),
          placeholder: fishingLicenseFurtherInformation.placeholders.date,
          condition: (formValue) => !hasAreaSelection(formValue),
        }),
        // File upload field is visible for a subset of licenses
        buildDescriptionField({
          id: 'attachments-title',
          space: 6,
          titleVariant: 'h5',
          title: fishingLicenseFurtherInformation.labels.attachments,
          description:
            fishingLicenseFurtherInformation.fieldInformation.attachments,
          condition: hasFileUpload,
        }),
        buildFileUploadField({
          id: 'fishingLicenseFurtherInformation.attachments',
          title: fishingLicenseFurtherInformation.labels.attachments,
          uploadHeader: fishingLicenseFurtherInformation.attachmentInfo.title,
          uploadDescription:
            fishingLicenseFurtherInformation.attachmentInfo.subtitle,
          uploadButtonLabel:
            fishingLicenseFurtherInformation.attachmentInfo.buttonLabel,
          uploadAccept: FILE_UPLOAD_ACCEPT,
          condition: hasFileUpload,
        }),
        // Roe net and rail net information fields - only for selected license(s)
        buildCustomField({
          id: 'fishingLicenseFurtherInformation.railAndRoeNet',
          title: '',
          component: 'RailNetAndRoeNetCalculations',
          condition: hasRailNetAndRoeNetField,
        }),
      ],
    }),
  ],
})
