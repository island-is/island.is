import {
  buildCheckboxField,
  buildMultiField,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { differentNeedsMessages } from '../../../lib/messages'
import { ApplicationFeatureKey } from '../../../utils/constants'
import { shouldShowPage } from '../../../utils/conditionUtils'

export const childCircumstancesSubSection = buildSubSection({
  id: 'childCircumstancesSubSection',
  title: differentNeedsMessages.childCircumstances.subSectionTitle,
  condition: (answers, externalData) =>
    shouldShowPage(
      answers,
      externalData,
      ApplicationFeatureKey.CHILD_CIRCUMSTANCES,
    ),
  children: [
    buildMultiField({
      id: 'childCircumstances',
      title: differentNeedsMessages.childCircumstances.subSectionTitle,
      description: differentNeedsMessages.childCircumstances.description,
      children: [
        buildCheckboxField({
          id: 'childCircumstances.onSiteObservation',
          title: differentNeedsMessages.childCircumstances.onSiteObservation,
          marginBottom: 'gutter',
          options: [
            {
              value: YES,
              label:
                differentNeedsMessages.childCircumstances
                  .approveOnsiteObservation,
            },
          ],
        }),
        buildCheckboxField({
          id: 'childCircumstances.onSiteObservationAdditionalInfo',
          title:
            differentNeedsMessages.childCircumstances
              .onSiteObservationAdditionalInfo,
          marginBottom: 'gutter',
          options: [
            {
              value: YES,
              label:
                differentNeedsMessages.childCircumstances
                  .approveOnSiteObservationAdditionalInfo,
            },
          ],
        }),
        buildCheckboxField({
          id: 'childCircumstances.callInExpert',
          title: differentNeedsMessages.childCircumstances.callInExpert,
          marginBottom: 'gutter',
          options: [
            {
              value: YES,
              label:
                differentNeedsMessages.childCircumstances.approveCallInExpert,
            },
          ],
        }),
        buildCheckboxField({
          id: 'childCircumstances.childViews',
          title: differentNeedsMessages.childCircumstances.childViews,
          options: [
            {
              value: YES,
              label:
                differentNeedsMessages.childCircumstances.approveChildViews,
            },
          ],
        }),
      ],
    }),
  ],
})
