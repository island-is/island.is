import {
  YES,
  buildAccordionField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { protectiveFactorsMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'
import { isUnborn } from '../../utils/conditionUtils'

export const protectiveFactorsSection = buildSection({
  id: 'protectiveFactorsSection',
  title: protectiveFactorsMessages.shared.sectionTitle,
  children: [
    buildMultiField({
      id: 'protectiveFactors',
      title: protectiveFactorsMessages.shared.sectionTitle,
      description: ({ answers }) =>
        isUnborn(answers)
          ? protectiveFactorsMessages.unborn.description
          : protectiveFactorsMessages.shared.description,
      children: [
        // TODO: Remove when the API exposes unborn-specific questions and the accordion below is extended to cover them.
        buildDescriptionField({
          id: 'protectiveFactors.unbornPlaceholder',
          title: '',
          description: '',
          doesNotRequireAnswer: true,
          condition: isUnborn,
        }),
        buildAccordionField({
          id: 'protectiveFactors',
          condition: (answers) => !isUnborn(answers),
          accordionItems: (application) => {
            const { protectiveFactorSections } = getApplicationExternalData(
              application.externalData,
            )

            return protectiveFactorSections.map((section) => ({
              itemTitle: section.name ?? '',
              children: [
                ...(section.subCategories?.flatMap((subCategory, subIndex) => [
                  buildCheckboxField({
                    id: `protectiveFactors.${section.code}.sub${subIndex}`,
                    large: true,
                    doesNotRequireAnswer: true,
                    options: [{ value: YES, label: subCategory.name ?? '' }],
                    spacing: 0,
                  }),
                  buildSelectField({
                    id: `protectiveFactors.${section.code}.sub${subIndex}Items`,
                    title: protectiveFactorsMessages.shared.itemsLabel,
                    placeholder:
                      protectiveFactorsMessages.shared.itemsPlaceholder,
                    isMulti: true,
                    condition: (answers: FormValue) => {
                      const { protectiveFactors } =
                        getApplicationAnswers(answers)
                      return !!protectiveFactors?.[section.code ?? '']?.[
                        `sub${subIndex}`
                      ]?.includes(YES)
                    },
                    options: (subCategory.items ?? []).map((item) => ({
                      value: item.code ?? '',
                      label: item.description ?? '',
                    })),
                  }),
                ]) ?? []),
                buildCheckboxField({
                  id: `protectiveFactors.${section.code}.dontKnow`,
                  large: true,
                  doesNotRequireAnswer: true,
                  spacing: 0,
                  options: [
                    {
                      value: section.dontKnowCode ?? '',
                      label: section.dontKnowDescription ?? '',
                    },
                  ],
                }),
              ],
            }))
          },
        }),
      ],
    }),
  ],
})
