import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
  YES,
} from '@island.is/application/core'
import {
  getAllCountryCodes,
  getAllLanguageCodes,
} from '@island.is/shared/utils'
import { childMessages } from '../../lib/messages'
import { isNoNationalId } from '../../utils/conditionUtils'
import { IS } from '../../utils/constants'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'

export const childInfoManualSection = buildSection({
  id: 'childInfoManualSection',
  title: childMessages.manualInfo.sectionTitle,
  condition: isNoNationalId,
  children: [
    buildMultiField({
      id: 'childInfoManual',
      title: childMessages.manualInfo.sectionTitle,
      description: childMessages.manualInfo.intro,
      children: [
        buildDescriptionField({
          id: 'childInfoManual.nameAgeGenderTitle',
          title: childMessages.manualInfo.nameAgeGenderTitle,
          description: childMessages.manualInfo.nameAgeGenderDescription,
          titleVariant: 'h4',
          space: 2,
        }),
        buildTextField({
          id: 'child.manualInfo.name',
          title: childMessages.manualInfo.name,
          doesNotRequireAnswer: true,
        }),
        buildTextField({
          id: 'child.manualInfo.age',
          title: childMessages.manualInfo.age,
          width: 'half',
          variant: 'number',
          doesNotRequireAnswer: true,
        }),
        buildSelectField({
          id: 'child.manualInfo.gender',
          title: childMessages.manualInfo.gender,
          placeholder: childMessages.manualInfo.genderPlaceholder,
          width: 'half',
          doesNotRequireAnswer: true,
          options: ({ externalData }) => {
            const { genders } = getApplicationExternalData(externalData)
            return (
              genders
                // Exclude adult genders (1=Karlmaður, 2=Kona) and unborn (5=Ófætt)
                .filter((g) => !['1', '2', '5'].includes(g.value ?? ''))
                .map((g) => ({ value: g.value ?? '', label: g.label ?? '' }))
            )
          },
        }),
        buildCheckboxField({
          id: 'child.manualInfo.usePronounAndPreferredName',
          spacing: 0,
          options: [
            {
              value: YES,
              label: childMessages.nationalIdLookup.usePronounAndPreferredName,
              tooltip:
                childMessages.nationalIdLookup
                  .usePronounAndPreferredNameTooltip,
            },
          ],
        }),
        buildTextField({
          id: 'child.manualInfo.preferredName',
          title: childMessages.nationalIdLookup.preferredName,
          doesNotRequireAnswer: true,
          condition: (answers) =>
            isNoNationalId(answers) &&
            getApplicationAnswers(
              answers,
            ).childManualUsePronounAndPreferredName?.includes(YES),
        }),
        buildSelectField({
          id: 'child.manualInfo.preferredPronoun',
          title: childMessages.nationalIdLookup.preferredPronoun,
          placeholder:
            childMessages.nationalIdLookup.preferredPronounPlaceholder,
          doesNotRequireAnswer: true,
          isMulti: true,
          options: ({ externalData }) => {
            const { pronounOptions } = getApplicationExternalData(externalData)
            return pronounOptions.map((p) => ({
              value: p.value ?? '',
              label: p.label ?? '',
            }))
          },
          condition: (answers) =>
            isNoNationalId(answers) &&
            getApplicationAnswers(
              answers,
            ).childManualUsePronounAndPreferredName?.includes(YES),
        }),
        buildDescriptionField({
          id: 'childInfoManual.addressTitle',
          title: childMessages.manualInfo.addressTitle,
          description: childMessages.manualInfo.addressDescription,
          titleVariant: 'h4',
          space: 4,
        }),
        buildSelectField({
          id: 'child.manualInfo.country',
          title: childMessages.manualInfo.country,
          placeholder: childMessages.manualInfo.countryPlaceholder,
          width: 'half',
          doesNotRequireAnswer: true,
          options: getAllCountryCodes().map((c) => ({
            value: c.code,
            label: c.name_is ?? c.name,
          })),
        }),
        buildTextField({
          id: 'child.manualInfo.address',
          title: childMessages.manualInfo.address,
          width: 'half',
          doesNotRequireAnswer: true,
        }),
        buildTextField({
          id: 'child.manualInfo.postalCode',
          title: childMessages.manualInfo.postalCode,
          width: 'half',
          doesNotRequireAnswer: true,
          condition: (answers) => {
            const { childManualCountry } = getApplicationAnswers(answers)
            return !!childManualCountry && childManualCountry !== IS
          },
        }),
        buildTextField({
          id: 'child.manualInfo.municipality',
          title: childMessages.manualInfo.municipality,
          width: 'half',
          doesNotRequireAnswer: true,
          condition: (answers) => {
            const { childManualCountry } = getApplicationAnswers(answers)
            return !!childManualCountry && childManualCountry !== IS
          },
        }),
        buildSelectField({
          id: 'child.manualInfo.municipalityPostalCode',
          title: childMessages.manualInfo.municipality,
          placeholder: childMessages.manualInfo.municipalityPlaceholder,
          doesNotRequireAnswer: true,
          options: ({ externalData }) => {
            const { postalCodes } = getApplicationExternalData(externalData)
            return postalCodes.map((p) => ({
              value: p.value ?? '',
              label: p.label ?? '',
            }))
          },
          condition: (answers) => {
            const { childManualCountry } = getApplicationAnswers(answers)
            return !!childManualCountry && childManualCountry === IS
          },
        }),
        buildDescriptionField({
          id: 'childInfoManual.languageTitle',
          title: childMessages.manualInfo.languageTitle,
          titleVariant: 'h4',
          space: 4,
        }),
        buildSelectField({
          id: 'child.manualInfo.language',
          title: childMessages.manualInfo.language,
          placeholder: childMessages.manualInfo.languagePlaceholder,
          doesNotRequireAnswer: true,
          options: getAllLanguageCodes().map((l) => ({
            value: l.code,
            label: l.name,
          })),
        }),
        buildCheckboxField({
          id: 'child.manualInfo.needsInterpreter',
          spacing: 0,
          options: [
            {
              value: YES,
              label: childMessages.manualInfo.needsInterpreter,
            },
          ],
        }),
      ],
    }),
  ],
})
