import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { ApplicationFeatureKey } from '../../../utils/constants'
import { shouldShowPage } from '../../../utils/conditionUtils'

export const childCircumstancesSubSection = buildSubSection({
  id: 'childCircumstancesSubSection',
  title:
    newPrimarySchoolMessages.differentNeeds.childCircumstancesSubSectionTitle,
  condition: (answers, externalData) =>
    shouldShowPage(
      answers,
      externalData,
      ApplicationFeatureKey.CHILD_CIRCUMSTANCES,
    ),
  children: [
    buildMultiField({
      id: 'childCircumstances',
      title:
        newPrimarySchoolMessages.differentNeeds
          .childCircumstancesSubSectionTitle,
      description:
        newPrimarySchoolMessages.differentNeeds
          .childCircumstancesSubSectionDescription,
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
