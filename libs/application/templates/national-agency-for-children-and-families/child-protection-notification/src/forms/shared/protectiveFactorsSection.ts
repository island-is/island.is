import {
  YES,
  buildAccordionField,
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { protectiveFactorsMessages } from '../../lib/messages'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'
import {
  isUnborn,
  shouldShowProtectiveFactorSubItems,
} from '../../utils/conditionUtils'
import { PROT_FACTOR_UNBORN_SECTION } from '../../utils/constants'

export const protectiveFactorsSection = buildSection({
  id: 'protectiveFactorsSection',
  title: protectiveFactorsMessages.sectionTitle,
  condition: (answers) => !isUnborn(answers),
  children: [
    buildMultiField({
      id: 'protectiveFactors',
      title: protectiveFactorsMessages.sectionTitle,
      description: protectiveFactorsMessages.description,
      children: [
        buildAccordionField({
          id: 'protectiveFactors',
          singleExpand: false,
          accordionItems: (application) => {
            const { protectiveFactorSections } = getApplicationExternalData(
              application.externalData,
            )

            const visibleSections = protectiveFactorSections.filter(
              (section) => section.code !== PROT_FACTOR_UNBORN_SECTION,
            )

            return visibleSections.map((section) => ({
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
                    title: protectiveFactorsMessages.itemsLabel,
                    placeholder: protectiveFactorsMessages.itemsPlaceholder,
                    isMulti: true,
                    condition: (answers) =>
                      shouldShowProtectiveFactorSubItems(
                        answers,
                        section.code ?? '',
                        subIndex,
                      ),
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
