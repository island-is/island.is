import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  getAllCountryCodes,
  getAllLanguageCodes,
} from '@island.is/shared/utils'
import { childMessages } from '../../lib/messages'
import { Gender, KnowsNationalId, Pronoun } from '../../utils/constants'

const isNoNationalId = (answers: Record<string, unknown>) =>
  getValueViaPath(answers, 'child.knowsNationalId') === KnowsNationalId.NO

export const childInfoManualSubSection = buildSubSection({
  id: 'childInfoManualSubSection',
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
          titleVariant: 'h4',
          space: 2,
        }),
        buildDescriptionField({
          id: 'childInfoManual.nameAgeGenderDescription',
          description: childMessages.manualInfo.nameAgeGenderDescription,
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
          placeholder: childMessages.nationalIdLookup.preferredNamePlaceholder,
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
          titleVariant: 'h4',
          space: 4,
        }),
        buildDescriptionField({
          id: 'childInfoManual.addressDescription',
          description: childMessages.manualInfo.addressDescription,
          space: 2,
        }),
        buildSelectField({
          id: 'child.manualInfo.country',
          title: childMessages.manualInfo.country,
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
