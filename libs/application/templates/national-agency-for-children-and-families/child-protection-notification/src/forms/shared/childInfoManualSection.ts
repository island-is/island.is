import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  getAllCountryCodes,
  getAllLanguageCodes,
} from '@island.is/shared/utils'
import { childMessages } from '../../lib/messages'
import { Gender, Pronoun } from '../../utils/constants'
import { isNoNationalId } from '../../utils/conditionUtils'

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
          options: [
            { value: Gender.GIRL, label: childMessages.manualInfo.genderGirl },
            { value: Gender.BOY, label: childMessages.manualInfo.genderBoy },
            {
              value: Gender.OTHER,
              label: childMessages.manualInfo.genderOther,
            },
          ],
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
            (
              getValueViaPath<string[]>(
                answers,
                'child.manualInfo.usePronounAndPreferredName',
              ) ?? []
            ).includes(YES),
        }),
        buildSelectField({
          id: 'child.manualInfo.preferredPronoun',
          title: childMessages.nationalIdLookup.preferredPronoun,
          placeholder:
            childMessages.nationalIdLookup.preferredPronounPlaceholder,
          doesNotRequireAnswer: true,
          options: [
            {
              value: Pronoun.HANN,
              label: childMessages.nationalIdLookup.pronounHann,
            },
            {
              value: Pronoun.HUN,
              label: childMessages.nationalIdLookup.pronounHun,
            },
            {
              value: Pronoun.HAN,
              label: childMessages.nationalIdLookup.pronounHan,
            },
          ],
          condition: (answers) =>
            isNoNationalId(answers) &&
            (
              getValueViaPath<string[]>(
                answers,
                'child.manualInfo.usePronounAndPreferredName',
              ) ?? []
            ).includes(YES),
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
        }),
        buildSelectField({
          id: 'child.manualInfo.municipality',
          title: childMessages.manualInfo.municipality,
          placeholder: childMessages.manualInfo.municipalityPlaceholder,
          width: 'half',
          doesNotRequireAnswer: true,
          // TODO: replace with real municipality data when API is wired up
          options: [
            { value: 'reykjavik', label: 'Reykjavík' },
            { value: 'kopavogur', label: 'Kópavogur' },
            { value: 'hafnarfjordur', label: 'Hafnarfjörður' },
            { value: 'akureyri', label: 'Akureyri' },
          ],
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
