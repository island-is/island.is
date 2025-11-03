import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { ApplicantType } from '../../shared/constants'
import * as m from '../../lib/messages'

export const studentOrTouristSection = buildSection({
  id: 'studentOrTourist',
  title: m.application.studentOrTourist.sectionTitle,
  children: [
    buildMultiField({
      id: 'studentOrTouristMultiField',
      title: m.application.studentOrTourist.sectionDescription,
      children: [
        buildRadioField({
          id: 'studentOrTouristRadioFieldTourist',
          required: true,
          options: [
            {
              label: m.application.studentOrTourist.touristRadioFieldText,
              value: ApplicantType.TOURIST,
            },
            {
              label: m.application.studentOrTourist.studentRadioFieldText,
              value: ApplicantType.STUDENT,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'studentOrTouristAlertMessage',
          alertType: 'warning',
          title: 'Athugið',
          message:
            m.application.studentOrTourist.studentOrTouristAlertMessageText,
        }),
      ],
    }),
  ],
})
