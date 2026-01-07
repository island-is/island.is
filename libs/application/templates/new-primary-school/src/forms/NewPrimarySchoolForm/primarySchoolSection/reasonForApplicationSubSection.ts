import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { primarySchoolMessages } from '../../../lib/messages'
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
  title: primarySchoolMessages.reasonForApplication.subSectionTitle,
  condition: (answers, externalData) =>
    shouldShowReasonForApplicationPage(answers) &&
    !hasSpecialEducationSubType(answers, externalData),
  children: [
    buildMultiField({
      id: 'reasonForApplication',
      title: primarySchoolMessages.reasonForApplication.subSectionTitle,
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
          return primarySchoolMessages.reasonForApplication
            .enrollmentDescription
        }

        return primarySchoolMessages.reasonForApplication.description
      },
      children: [
        buildCustomField(
          {
            id: 'reasonForApplication.reason',
            title: primarySchoolMessages.reasonForApplication.subSectionTitle,
            component: 'FriggOptionsAsyncSelectField',
          },
          {
            optionsType: (application: Application) =>
              getReasonOptionsType(
                application.answers,
                application.externalData,
              ),
            placeholder: primarySchoolMessages.reasonForApplication.placeholder,
            useIdAndKey: true,
          },
        ),
      ],
    }),
  ],
})
