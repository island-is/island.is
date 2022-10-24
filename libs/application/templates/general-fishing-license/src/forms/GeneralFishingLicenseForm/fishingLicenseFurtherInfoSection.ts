import {
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import { FishingLicenseEnum } from '../../types'
import {
  licenseHasAreaSelection,
  licenseHasFileUploadField,
  licenseHasRailNetAndRoeNetField,
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
          id: 'custom-section-title',
          title: '',
          doesNotRequireAnswer: true,
          component: 'FishingLicenseFurtherInfoTitleSection',
        }),
        // Date field is visible for all types of licenses
        buildDescriptionField({
          id: 'date-title',
          title: fishingLicenseFurtherInformation.labels.date,
          titleVariant: 'h5',
        }),
        buildDateField({
          id: 'date',
          title: fishingLicenseFurtherInformation.labels.date,
          minDate: new Date(),
          placeholder: fishingLicenseFurtherInformation.placeholders.date,
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
          id: 'attachments',
          title: fishingLicenseFurtherInformation.labels.attachments,
          condition: hasFileUpload,
        }),
        // Roe net and rail net information fields - only for selected license(s)
        buildCustomField({
          id: 'fishingLicenseFurtherInformation',
          title: '',
          doesNotRequireAnswer: true,
          component: 'RailNetAndRoeNetCalculations',
          condition: hasRailNetAndRoeNetField,
        }),
      ],
    }),
  ],
})
