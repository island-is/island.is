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
      children: [
        buildDescriptionField({
          id: 'protectiveFactors.description',
          description: ({ answers }) =>
            isUnborn(answers)
              ? protectiveFactorsMessages.unborn.description
              : protectiveFactorsMessages.shared.description,
        }),
        // TODO: When the API exposes unborn-specific questions, filter sections by child type here and remove the condition below.
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
                    isMulti: true,
                    doesNotRequireAnswer: true,
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
