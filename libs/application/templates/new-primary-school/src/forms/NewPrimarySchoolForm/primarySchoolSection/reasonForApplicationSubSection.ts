import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
  NO,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  ApplicationType,
  OptionsType,
  OrganizationSector,
  OrganizationSubType,
} from '../../../utils/constants'
import {
  getApplicationAnswers,
  getSelectedSchoolSector,
  getSelectedSchoolSubType,
} from '../../../utils/newPrimarySchoolUtils'

export const reasonForApplicationSubSection = buildSubSection({
  id: 'reasonForApplicationSubSection',
  title:
    newPrimarySchoolMessages.primarySchool.reasonForApplicationSubSectionTitle,
  condition: (answers) => {
    const { applyForPreferredSchool, applicationType } =
      getApplicationAnswers(answers)
    return (
      applicationType === ApplicationType.NEW_PRIMARY_SCHOOL ||
      (applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
        applyForPreferredSchool === NO)
    )
  },
  children: [
    buildMultiField({
      id: 'reasonForApplication',
      title:
        newPrimarySchoolMessages.primarySchool
          .reasonForApplicationSubSectionTitle,
      description: (application) => {
        const { applicationType } = getApplicationAnswers(application.answers)

        if (
          applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
          getSelectedSchoolSector(
            application.answers,
            application.externalData,
          ) === OrganizationSector.PUBLIC &&
          getSelectedSchoolSubType(
            application.answers,
            application.externalData,
          ) === OrganizationSubType.GENERAL_SCHOOL
        ) {
          return newPrimarySchoolMessages.primarySchool
            .reasonForApplicationEnrollmentDescription
        }

        return newPrimarySchoolMessages.primarySchool
          .reasonForApplicationDescription
      },
      children: [
        buildCustomField(
          {
            id: 'reasonForApplication.reason',
            title:
              newPrimarySchoolMessages.primarySchool
                .reasonForApplicationSubSectionTitle,
            component: 'FriggOptionsAsyncSelectField',
          },
          {
            optionsType: (application: Application) => {
              return getSelectedSchoolSector(
                application.answers,
                application.externalData,
              ) === OrganizationSector.PRIVATE
                ? OptionsType.REASON_PRIVATE_SCHOOL
                : getSelectedSchoolSubType(
                    application.answers,
                    application.externalData,
                  ) === OrganizationSubType.INTERNATIONAL_SCHOOL
                ? OptionsType.REASON_INTERNATIONAL_SCHOOL
                : OptionsType.REASON
            },
            placeholder:
              newPrimarySchoolMessages.primarySchool
                .reasonForApplicationPlaceholder,
            useIdAndKey: true,
          },
        ),
      ],
    }),
  ],
})
