import {
  buildCustomField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { fishingLicenseFurtherInformation } from '../../lib/messages'
import { FishingLicenseEnum } from '../../types'
import { licenseHasFileUploadField } from '../../utils/licenses'

export const fishingLicenseFurtherInfoSection = buildSection({
  id: 'fishingLicenseFurtherInformationSection',
  title: fishingLicenseFurtherInformation.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'fishingLicenseFurtherInformation',
      title: '',
      description: '',
      children: [
        buildCustomField({
          id: 'fishingLicenseFurtherInformation',
          title: '',
          doesNotRequireAnswer: true,
          component: 'FishingLicenseFurtherInfo',
        }),
        buildFileUploadField({
          id: 'attachments',
          title: fishingLicenseFurtherInformation.labels.attachments,
          condition: (formValue) => {
            const selectedLicenseType = getValueViaPath(
              formValue,
              'fishingLicense.license',
              '',
            ) as FishingLicenseEnum
            return licenseHasFileUploadField(selectedLicenseType)
          },
        }),
      ],
    }),
  ],
})
