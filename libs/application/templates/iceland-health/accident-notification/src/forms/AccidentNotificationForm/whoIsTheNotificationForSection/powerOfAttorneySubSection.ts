import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { powerOfAttorney } from '../../../lib/messages'
import { PowerOfAttorneyUploadEnum } from '../../../utils/enums'
import { isPowerOfAttorney } from '../../../utils/miscUtils'

export const powerOfAttorneySubSection = buildSubSection({
  id: 'powerOfAttorney.type.section',
  title: powerOfAttorney.type.sectionTitle,
  children: [
    buildMultiField({
      id: 'powerOfAttorney.type.multifield',
      title: powerOfAttorney.type.heading,
      description: powerOfAttorney.type.description,
      children: [
        buildRadioField({
          id: 'powerOfAttorney.type',
          options: [
            {
              value: PowerOfAttorneyUploadEnum.UPLOADNOW,
              label: powerOfAttorney.labels.uploadNow,
            },
            {
              value: PowerOfAttorneyUploadEnum.UPLOADLATER,
              label: powerOfAttorney.labels.uploadLater,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'attachments.injuryCertificate.alert',
          title: powerOfAttorney.alertMessage.title,
          message: powerOfAttorney.alertMessage.description,
          alertType: 'warning',
          doesNotRequireAnswer: true,
          condition: (formValue) =>
            getValueViaPath(formValue, 'powerOfAttorney.type') ===
            PowerOfAttorneyUploadEnum.UPLOADLATER,
        }),
      ],
    }),
  ],
  condition: (formValue) => isPowerOfAttorney(formValue),
})
