import {
  buildMultiField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  NO,
} from '@island.is/application/core'
import { reasonForNotificationMessages } from '../../../../lib/messages'
import {
  getAreParentsInformedTitle,
  getHasDiscussedWithParentsTitle,
  getYesNoOptions,
} from '../../../../utils/childProtectionNotificationUtils'
import { getApplicationAnswers } from '../../../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../../../utils/getApplicationExternalData'

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
          options: getYesNoOptions(),
        }),
        buildRadioField({
          id: 'reasonNotificationHistory.hasDiscussedWithParents',
          title: ({ answers, externalData }) =>
            getHasDiscussedWithParentsTitle(answers, externalData),
          required: true,
          width: 'half',
          space: 4,
          options: getYesNoOptions(),
        }),
        buildRadioField({
          id: 'reasonNotificationHistory.areParentsInformed',
          title: ({ answers, externalData }) =>
            getAreParentsInformedTitle(answers, externalData),
          required: true,
          width: 'half',
          space: 4,
          options: getYesNoOptions(),
        }),
        buildSelectField({
          id: 'reasonNotificationHistory.biggestConcern',
          title: reasonForNotificationMessages.notificationHistory.explanation,
          placeholder: reasonForNotificationMessages.notificationHistory.explanationPlaceholder,
          options: ({ externalData }) => {
            const { guardianNotAwareReasons } =
              getApplicationExternalData(externalData)
            return guardianNotAwareReasons.map((reason) => ({
              label: reason.label ?? '',
              value: reason.value ?? '',
            }))
          },
          condition: (answers) => {
            const { areParentsInformed } = getApplicationAnswers(answers)
            return areParentsInformed === NO
          },
        }),
      ],
    }),
  ],
})
