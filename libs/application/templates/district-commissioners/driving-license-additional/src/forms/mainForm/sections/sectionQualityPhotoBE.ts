import {
  buildMultiField,
  buildRadioField,
  buildSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import {
  getSelectLicensePhotoDefaultValue,
  getSelectLicensePhotoOptions,
} from '../../../utils/getPhotoOptions'

export const sectionQualityPhotoBE = buildSection({
  id: 'photoStepBE',
  title: m.photoSelectionTitle,
  children: [
    buildMultiField({
      id: 'selectPhoto',
      title: m.photoSelectionTitle,
      description: m.photoSelectionDescription,
      children: [
        buildRadioField({
          id: 'selectLicensePhoto',
          disabled: false,
          defaultValue: getSelectLicensePhotoDefaultValue,
          options: getSelectLicensePhotoOptions,
        }),
        buildDescriptionField({
          id: 'photoDescription',
        }),
      ],
    }),
  ],
})
