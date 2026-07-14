import {
  buildAccordionField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
} from '@island.is/application/core'
import { reasonForNotificationMessages } from '../../../lib/messages'
import { getSelectedReasonForNotificationCategoryCodes } from '../../../utils/childProtectionNotificationUtils'
import {
  isUnborn,
  shouldShowBiggestConcernField,
  shouldShowReasonForNotificationSubCategoryDetails,
} from '../../../utils/conditionUtils'
import { RISK_TO_UNBORN } from '../../../utils/constants'
import { getApplicationExternalData } from '../../../utils/getApplicationExternalData'

export const reasonForNotificationSubSection = buildSubSection({
  id: 'reasonForNotificationSubSection',
  title: reasonForNotificationMessages.shared.sectionTitle,
  children: [
    buildMultiField({
      id: 'reasonForNotification',
      title: reasonForNotificationMessages.shared.sectionTitle,
      description: reasonForNotificationMessages.reason.description,
      children: [
        buildAccordionField({
          id: 'reasonForNotification',
          singleExpand: false,
          accordionItems: (application) => {
            const { categories } = getApplicationExternalData(
              application.externalData,
            )

            return categories
              .filter((category) => category.code !== RISK_TO_UNBORN)
              .filter(
                (category) =>
                  category.code !== 'ProtFactorChildSection' &&
                  category.code !== 'ProtFactorParentSection',
              ) // TODO: Remove filter? (Wait for confirmation)
              .map((category) => {
                return {
                  itemTitle: category.label,
                  children: (category.subCategories ?? []).flatMap(
                    (subCategory) => {
                      const subCategoryId = `reasonForNotification.${category.code}.${subCategory.code}`
                      return [
                        buildCheckboxField({
                          id: `${subCategoryId}.subCategory`,
                          spacing: 0,
                          options: [
                            {
                              value: subCategory.code,
                              label: subCategory.label,
                            },
                          ],
                        }),
                        buildSelectField({
                          id: `${subCategoryId}.subSubCategories`,
                          title: subCategory.label,
                          placeholder:
                            reasonForNotificationMessages.reason
                              .selectPlaceholder,
                          doesNotRequireAnswer: true,
                          isMulti: true,
                          options:
                            subCategory.subCategories?.map(
                              (subSubCategory) => ({
                                value: subSubCategory.code,
                                label: subSubCategory.label,
                              }),
                            ) ?? [],
                          condition: (answers) =>
                            shouldShowReasonForNotificationSubCategoryDetails(
                              answers,
                              category.code,
                              subCategory.code,
                              (subCategory.subCategories?.length ?? 0) > 0,
                            ),
                        }),
                      ]
                    },
                  ),
                }
              })
          },
          condition: (answers) => !isUnborn(answers),
        }),

        buildDescriptionField({
          id: 'reasonForNotification.biggestConcernTitle',
          title: reasonForNotificationMessages.reason.biggestConcern,
          description:
            reasonForNotificationMessages.reason.biggestConcernDescription,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => shouldShowBiggestConcernField(answers),
        }),
        buildSelectField({
          id: 'reasonForNotification.biggestConcern',
          title: reasonForNotificationMessages.reason.concerns,
          placeholder: reasonForNotificationMessages.shared.selectPlaceholder,
          options: (application) => {
            const { categories } = getApplicationExternalData(
              application.externalData,
            )

            const selectedCategoryCodes =
              getSelectedReasonForNotificationCategoryCodes(application.answers)

            return categories
              .filter((category) =>
                selectedCategoryCodes.includes(category.code),
              )
              .map((category) => ({
                value: category.code,
                label: category.label,
              }))
          },
          condition: (answers) => shouldShowBiggestConcernField(answers),
        }),

        buildCheckboxField({
          id: 'reasonForNotification.riskToUnborn',
          title: reasonForNotificationMessages.reason.unbornQuestion,
          options: (application) => {
            const { categories } = getApplicationExternalData(
              application.externalData,
            )
            const unbornCategory = categories.find(
              (c) => c.code === RISK_TO_UNBORN,
            )
            return (unbornCategory?.subCategories ?? []).map((category) => ({
              value: category.code,
              label: category.label,
            }))
          },
          condition: (answers) => isUnborn(answers),
        }),
      ],
    }),
  ],
})
