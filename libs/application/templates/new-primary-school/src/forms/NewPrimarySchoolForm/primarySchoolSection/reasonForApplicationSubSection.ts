import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import {
  hasSpecialEducationSubType,
  shouldShowReasonForApplicationPage,
} from '../../../utils/conditionUtils'
import {
  ApplicationType,
  OrganizationSector,
  OrganizationSubType,
} from '../../../utils/constants'
import {
  getApplicationAnswers,
  getReasonOptionsType,
  getSelectedSchoolSector,
  getSelectedSchoolSubType,
} from '../../../utils/newPrimarySchoolUtils'

export const reasonForApplicationSubSection = buildSubSection({
  id: 'reasonForApplicationSubSection',
  title:
    newPrimarySchoolMessages.primarySchool.reasonForApplicationSubSectionTitle,
  condition: (answers, externalData) =>
    shouldShowReasonForApplicationPage(answers) &&
    !hasSpecialEducationSubType(answers, externalData),
  children: [
    buildMultiField({
      id: 'reasonForApplication',
      title:
        newPrimarySchoolMessages.primarySchool
          .reasonForApplicationSubSectionTitle,
      description: (application) => {
        const { applicationType } = getApplicationAnswers(application.answers)
        const selectedSchoolSector = getSelectedSchoolSector(
          application.answers,
          application.externalData,
        )
        const selectedSchoolSubType = getSelectedSchoolSubType(
          application.answers,
          application.externalData,
        )

        if (
          applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
          selectedSchoolSector === OrganizationSector.PUBLIC &&
          selectedSchoolSubType === OrganizationSubType.GENERAL_SCHOOL
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
            optionsType: (application: Application) =>
              getReasonOptionsType(
                application.answers,
                application.externalData,
              ),
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
