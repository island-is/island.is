import {
  buildAccordionField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { ProtectiveFactorSectionDto } from '@island.is/clients/national-agency-for-children-and-families'
import { FormValue } from '@island.is/application/types'
import { protectiveFactorsMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { isUnborn } from '../../utils/conditionUtils'

export const protectiveFactorsSection = buildSection({
  id: 'protectiveFactorsSection',
  title: protectiveFactorsMessages.shared.sectionTitle,
  children: [
    buildMultiField({
      id: 'protectiveFactors',
      title: protectiveFactorsMessages.shared.title,
      children: [
        buildDescriptionField({
          id: 'protectiveFactors.description',
          description: ({ answers }) =>
            isUnborn(answers)
              ? protectiveFactorsMessages.unborn.description
              : protectiveFactorsMessages.shared.description,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'protectiveFactors.selectionPrompt',
          description: ({ answers }) =>
            isUnborn(answers)
              ? protectiveFactorsMessages.unborn.selectionPrompt
              : protectiveFactorsMessages.shared.selectionPrompt,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'protectiveFactors.dontKnowInstruction',
          description: protectiveFactorsMessages.shared.dontKnowInstruction,
          marginBottom: 4,
          condition: (answers) => !isUnborn(answers),
        }),
        // TODO: When the API exposes unborn-specific questions, filter sections by child type here and remove the condition below.
        buildAccordionField({
          id: 'protectiveFactors.sections',
          condition: (answers) => !isUnborn(answers),
          accordionItems: (application) => {
            const sections =
              (
                application.externalData['protectiveFactors'] as
                  | { data?: ProtectiveFactorSectionDto[] }
                  | undefined
              )?.data ?? []

            return sections.map((section) => ({
              itemTitle: section.name ?? '',
              children: [
                ...(section.subCategories?.flatMap((subCategory, subIndex) => [
                  buildCheckboxField({
                    id: `protectiveFactors.${section.code}.sub${subIndex}`,
                    large: true,
                    doesNotRequireAnswer: true,
                    options: [{ value: 'yes', label: subCategory.name ?? '' }],
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
                      ]?.includes('yes')
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
