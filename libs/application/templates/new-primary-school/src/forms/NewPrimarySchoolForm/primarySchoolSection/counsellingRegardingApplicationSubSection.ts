import {
  buildCustomField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  NO,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  hasSpecialEducationSubType,
  shouldShowReasonForApplicationPage,
} from '../../../utils/conditionUtils'
import { OptionsType } from '../../../utils/constants'

export const counsellingRegardingApplicationSubSection = buildSubSection({
  id: 'counsellingRegardingApplicationSubSection',
  title:
    newPrimarySchoolMessages.primarySchool
      .counsellingRegardingApplicationSubSectionTitle,
  condition: (answers, externalData) =>
    shouldShowReasonForApplicationPage(answers) &&
    hasSpecialEducationSubType(answers, externalData),
  children: [
    buildMultiField({
      id: 'counsellingRegardingApplication',
      title:
        newPrimarySchoolMessages.primarySchool
          .counsellingRegardingApplicationSubSectionTitle,
      description:
        newPrimarySchoolMessages.primarySchool
          .counsellingRegardingApplicationDescription,
      children: [
        buildCustomField(
          {
            id: 'counsellingRegardingApplication.counselling',
            title:
              newPrimarySchoolMessages.primarySchool
                .counsellingRegardingApplicationSubSectionTitle,
            component: 'FriggOptionsAsyncSelectField',
          },
          {
            optionsType: OptionsType.REASON_SPECIAL_EDUCATION,
            placeholder:
              newPrimarySchoolMessages.primarySchool
                .counsellingRegardingApplicationPlaceholder,
          },
        ),
        buildRadioField({
          id: 'counsellingRegardingApplication.hasVisitedSchool',
          title:
            newPrimarySchoolMessages.primarySchool
              .counsellingRegardingApplicationHasVisitedSchool,
          width: 'half',
          space: 4,
          required: true,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              value: NO,
            },
          ],
        }),
      ],
    }),
  ],
})
