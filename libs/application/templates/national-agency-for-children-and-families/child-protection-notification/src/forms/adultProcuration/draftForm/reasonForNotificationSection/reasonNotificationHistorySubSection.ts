import {
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import {
  reasonForNotificationMessages,
  sharedMessages,
} from '../../../../lib/messages'
import {
  getAreParentsInformedTitle,
  getHasDiscussedWithParentsTitle,
} from '../../../../utils/childProtectionNotificationUtils'
import { getApplicationAnswers } from '../../../../utils/getApplicationAnswers'

export const reasonNotificationHistorySubSection = buildSubSection({
  id: 'reasonNotificationHistorySubSection',
  title: reasonForNotificationMessages.notificationHistory.subSectionTitle,
  children: [
    buildMultiField({
      id: 'reasonNotificationHistory',
      title: reasonForNotificationMessages.notificationHistory.subSectionTitle,
      children: [
        buildRadioField({
          id: 'reasonNotificationHistory.hasReportedBefore',
          title:
            reasonForNotificationMessages.notificationHistory.hasReportedBefore,
          required: true,
          width: 'half',
          options: [
            {
              value: YES,
              label: sharedMessages.radioYes,
            },
            {
              value: NO,
              label: sharedMessages.radioNo,
            },
          ],
        }),
        buildRadioField({
          id: 'reasonNotificationHistory.hasDiscussedWithParents',
          title: ({ answers }) => getHasDiscussedWithParentsTitle(answers),
          required: true,
          width: 'half',
          space: 4,
          options: [
            {
              value: YES,
              label: sharedMessages.radioYes,
            },
            {
              value: NO,
              label: sharedMessages.radioNo,
            },
          ],
        }),
        buildRadioField({
          id: 'reasonNotificationHistory.areParentsInformed',
          title: ({ answers }) => getAreParentsInformedTitle(answers),
          required: true,
          width: 'half',
          space: 4,
          options: [
            {
              value: YES,
              label: sharedMessages.radioYes,
            },
            {
              value: NO,
              label: sharedMessages.radioNo,
            },
          ],
        }),
        buildSelectField({
          id: 'reasonNotificationHistory.biggestConcern',
          title: reasonForNotificationMessages.description.subSectionTitle,
          placeholder: reasonForNotificationMessages.shared.selectPlaceholder,
          // TODO: Update to call endpoint for services when implemented
          options: [
            { value: '1', label: 'Valmöguleiki 1' },
            { value: '2', label: 'Valmöguleiki 2' },
            { value: '3', label: 'Valmöguleiki 3' },
          ],
          condition: (answers) => {
            const { areParentsInformed } = getApplicationAnswers(answers)
            return areParentsInformed === NO
          },
        }),
      ],
    }),
  ],
})
