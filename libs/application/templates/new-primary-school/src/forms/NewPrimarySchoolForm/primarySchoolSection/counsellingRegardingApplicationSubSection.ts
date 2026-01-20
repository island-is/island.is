import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { primarySchoolMessages, sharedMessages } from '../../../lib/messages'
import {
  hasSpecialEducationSubType,
  shouldShowReasonForApplicationAndNewSchoolPages,
} from '../../../utils/conditionUtils'
import { OptionsType } from '../../../utils/constants'

export const counsellingRegardingApplicationSubSection = buildSubSection({
  id: 'counsellingRegardingApplicationSubSection',
  title: primarySchoolMessages.counsellingRegardingApplication.subSectionTitle,
  condition: (answers, externalData) =>
    shouldShowReasonForApplicationAndNewSchoolPages(answers, externalData) &&
    hasSpecialEducationSubType(answers, externalData),
  children: [
    buildMultiField({
      id: 'counsellingRegardingApplication',
      title:
        primarySchoolMessages.counsellingRegardingApplication.subSectionTitle,
      description:
        primarySchoolMessages.counsellingRegardingApplication.description,
      children: [
        buildCustomField(
          {
            id: 'counsellingRegardingApplication.counselling',
            title:
              primarySchoolMessages.counsellingRegardingApplication
                .subSectionTitle,
            component: 'FriggOptionsAsyncSelectField',
          },
          {
            optionsType: OptionsType.REASON_SPECIAL_EDUCATION,
            placeholder:
              primarySchoolMessages.counsellingRegardingApplication.placeholder,
          },
        ),
        buildRadioField({
          id: 'counsellingRegardingApplication.hasVisitedSchool',
          title:
            primarySchoolMessages.counsellingRegardingApplication
              .hasVisitedSchool,
          width: 'half',
          space: 4,
          required: true,
          options: [
            {
              label: sharedMessages.yes,
              value: YES,
            },
            {
              label: sharedMessages.no,
              value: NO,
            },
          ],
        }),
      ],
    }),
  ],
})
