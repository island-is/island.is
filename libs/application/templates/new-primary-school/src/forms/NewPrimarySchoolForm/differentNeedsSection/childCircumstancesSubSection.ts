import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { getSelectedSchoolSubType } from '../../../utils/newPrimarySchoolUtils'
import { OrganizationSubType } from '../../../utils/constants'

export const childCircumstancesSubSection = buildSubSection({
  id: 'childCircumstancesSubSection',
  title:
    newPrimarySchoolMessages.differentNeeds.childCircumstancesSubSectionTitle,
  condition: (answers, externalData) => {
    const subType = getSelectedSchoolSubType(answers, externalData)

    return (
      subType === OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_DEPARTMENT ||
      subType === OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL ||
      subType === OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_DEPARTMENT ||
      subType === OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_SCHOOL
    )
  },
  children: [
    buildMultiField({
      id: 'childCircumstances',
      title:
        newPrimarySchoolMessages.differentNeeds
          .childCircumstancesSubSectionTitle,
      children: [
        buildCheckboxField({
          id: 'childCircumstances.onSiteObservation',
          title: newPrimarySchoolMessages.differentNeeds.onSiteObservation,
          marginBottom: 'gutter',
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .approveOnsiteObservation,
            },
          ],
        }),
        buildCheckboxField({
          id: 'childCircumstances.onSiteObservationAdditionalInfo',
          title:
            newPrimarySchoolMessages.differentNeeds
              .onSiteObservationAdditionalInfo,
          marginBottom: 'gutter',
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds
                  .approveOnSiteObservationAdditionalInfo,
            },
          ],
        }),
        buildCheckboxField({
          id: 'childCircumstances.callInExpert',
          title: newPrimarySchoolMessages.differentNeeds.callInExpert,
          marginBottom: 'gutter',
          options: [
            {
              value: YES,
              label:
                newPrimarySchoolMessages.differentNeeds.approveCallInExpert,
            },
          ],
          condition: (answers, externalData) => {
            const subType = getSelectedSchoolSubType(answers, externalData)

            return (
              subType ===
                OrganizationSubType.SPECIAL_EDUCATION_DISABILITY_SCHOOL ||
              subType === OrganizationSubType.SPECIAL_EDUCATION_BEHAVIOR_SCHOOL
            )
          },
        }),
        buildCheckboxField({
          id: 'childCircumstances.childViews',
          title: newPrimarySchoolMessages.differentNeeds.childViews,

          options: [
            {
              value: YES,
              label: newPrimarySchoolMessages.differentNeeds.approveChildViews,
            },
          ],
        }),
      ],
    }),
  ],
})
