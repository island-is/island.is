import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import { FishingLicenseEnum } from '../../types'
import { ATTACHMENTS_FIELD_ID, DATE_FIELD_ID } from '../../utils/fields'
import {
  licenseHasAreaSelection,
  licenseHasFileUploadField,
  licenseHasRailNetAndRoeNetField,
  FILE_UPLOAD_ACCEPT,
  FILE_SIZE_LIMIT,
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
      description: '',
      children: [
        // Custom field to replace section title
        // i.e. to make it dynamic
        buildCustomField({
          id: 'fishingLicenseFurtherInformation.customTitle',
          doesNotRequireAnswer: true,
          component: 'FishingLicenseFurtherInfoTitleSection',
        }),
        // Select fishing area field is visible for a subset of licenses
        buildDescriptionField({
          id: 'fishingLicenseFurtherInformation.areaSectionTitle',
          space: 6,
          title: fishingLicenseFurtherInformation.labels.area,
          titleVariant: 'h5',
          doesNotRequireAnswer: true,
          condition: hasAreaSelection,
        }),
        buildCustomField({
          id: 'fishingLicenseFurtherInformation.areaWithDate',
          component: 'AreaWithDateSelection',
          condition: hasAreaSelection,
        }),
        // Date field is visible for all types of licenses
        // But this simplified input is hidden for licenses that have
        // area selection because in that case, min and max dates depend
        // on the area selected
        buildDescriptionField({
          id: 'fishingLicenseFurtherInformation.dateTitle',
          space: 6,
          title: fishingLicenseFurtherInformation.labels.date,
          titleVariant: 'h5',
          doesNotRequireAnswer: true,
          condition: (formValue) => !hasAreaSelection(formValue),
        }),
        // Custom field for date, needs to be a custom field
        // So that dynamic date limitations from the API can be respected
        buildCustomField({
          id: DATE_FIELD_ID,
          title: fishingLicenseFurtherInformation.labels.date,
          description:
            fishingLicenseFurtherInformation.fieldInformation.attachments,
          component: 'DateWithContraintsSelection',
          condition: (formValue) => !hasAreaSelection(formValue),
        }),
        // Custom field to replace file upload section title
        // It needs to be custom because description message is dynamic
        // depending on which license user is currenty applying for
        buildCustomField({
          id: 'fishingLicenseFurtherInformation.customAttachmentsTitle',
          doesNotRequireAnswer: true,
          description:
            fishingLicenseFurtherInformation.fieldInformation.attachments,
          component: 'AttachmentsTitleSection',
          condition: hasFileUpload,
        }),
        buildFileUploadField({
          id: ATTACHMENTS_FIELD_ID,
          title: fishingLicenseFurtherInformation.labels.attachments,
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText:
            fishingLicenseFurtherInformation.errorMessages
              .attachmentMaxSizeError,
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
          component: 'RailNetAndRoeNetCalculations',
          condition: hasRailNetAndRoeNetField,
        }),
      ],
    }),
  ],
})
