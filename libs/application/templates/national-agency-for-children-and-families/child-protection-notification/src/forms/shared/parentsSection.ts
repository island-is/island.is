import {
  NO,
  YES,
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildCheckboxField,
  buildTextField,
} from '@island.is/application/core'
import {
  getAllCountryCodes,
  getAllLanguageCodes,
} from '@island.is/shared/utils'
import {
  childMessages,
  parentsMessages,
  sharedMessages,
} from '../../lib/messages'
import {
  doesNotKnowParentIds,
  isUnborn,
  knowsParentIds,
  isKnowsNationalId,
} from '../../utils/conditionUtils'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'

const buildParentFields = (parentKey: 'parent1' | 'parent2') => {
  const base = `parents.${parentKey}`

  return [
    // --- Já path: SSN lookup + email + phone ---
    buildNationalIdWithNameField({
      id: `${base}.nationalIdInfo`,
      required: false,
      searchPersons: true,
      condition: knowsParentIds,
    }),
    buildTextField({
      id: `${base}.nationalIdInfo.email`,
      title: childMessages.nationalIdLookup.email,
      variant: 'email',
      width: 'half',
      doesNotRequireAnswer: true,
      condition: knowsParentIds,
    }),
    buildPhoneField({
      id: `${base}.nationalIdInfo.phone`,
      title: childMessages.nationalIdLookup.phone,
      width: 'half',
      enableCountrySelector: true,
      doesNotRequireAnswer: true,
      condition: knowsParentIds,
    }),

    // --- Nei path: manual name/age/gender ---
    buildDescriptionField({
      id: `${base}.nameAgeGenderTitle`,
      title: ({ answers }) =>
        isUnborn(answers)
          ? parentsMessages.expectantParents.nameAgeGenderTitle
          : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
          ? parentsMessages.custodians.nameAgeGenderTitle
          : parentsMessages.guardians.nameAgeGenderTitle,
      titleVariant: 'h5',
      space: 4,
      condition: doesNotKnowParentIds,
    }),
    buildTextField({
      id: `${base}.name`,
      title: childMessages.manualInfo.name,
      doesNotRequireAnswer: true,
      condition: doesNotKnowParentIds,
    }),
    buildTextField({
      id: `${base}.age`,
      title: childMessages.manualInfo.age,
      width: 'half',
      variant: 'number',
      doesNotRequireAnswer: true,
      condition: doesNotKnowParentIds,
    }),
    buildSelectField({
      id: `${base}.gender`,
      title: childMessages.manualInfo.gender,
      placeholder: parentsMessages.shared.genderPlaceholder,
      width: 'half',
      doesNotRequireAnswer: true,
      options: ({ externalData }) => {
        const { genders } = getApplicationExternalData(externalData)
        return genders
          // Exclude child genders (3=Drengur, 4=Stúlka) and unborn (5=Ófætt)
          .filter((g) => !['3', '4', '5'].includes(g.value ?? ''))
          .map((g) => ({ value: g.value ?? '', label: g.label ?? '' }))
      },
      condition: doesNotKnowParentIds,
    }),

    // --- Nei path: address ---
    buildDescriptionField({
      id: `${base}.addressTitle`,
      title: ({ answers }) =>
        isUnborn(answers)
          ? parentsMessages.expectantParents.addressTitle
          : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
          ? parentsMessages.custodians.addressTitle
          : parentsMessages.guardians.addressTitle,
      titleVariant: 'h5',
      space: 4,
      condition: doesNotKnowParentIds,
    }),
    buildSelectField({
      id: `${base}.country`,
      title: childMessages.manualInfo.country,
      placeholder: parentsMessages.shared.countryPlaceholder,
      width: 'half',
      doesNotRequireAnswer: true,
      options: getAllCountryCodes().map((c) => ({
        value: c.code,
        label: c.name_is ?? c.name,
      })),
      condition: doesNotKnowParentIds,
    }),
    buildSelectField({
      id: `${base}.citizenship`,
      title: parentsMessages.shared.citizenship,
      placeholder: parentsMessages.shared.citizenshipPlaceholder,
      width: 'half',
      doesNotRequireAnswer: true,
      options: getAllCountryCodes().map((c) => ({
        value: c.code,
        label: c.code,
      })),
      condition: doesNotKnowParentIds,
    }),
    buildTextField({
      id: `${base}.address`,
      title: childMessages.manualInfo.address,
      doesNotRequireAnswer: true,
      condition: doesNotKnowParentIds,
    }),
    buildTextField({
      id: `${base}.postalCode`,
      title: childMessages.manualInfo.postalCode,
      width: 'half',
      doesNotRequireAnswer: true,
      condition: doesNotKnowParentIds,
    }),
    buildSelectField({
      id: `${base}.municipality`,
      title: childMessages.manualInfo.municipality,
      placeholder: parentsMessages.shared.municipalityPlaceholder,
      width: 'half',
      doesNotRequireAnswer: true,
      // TODO: replace with real municipality data when API is wired up
      options: [
        { value: 'reykjavik', label: 'Reykjavík' },
        { value: 'kopavogur', label: 'Kópavogur' },
        { value: 'hafnarfjordur', label: 'Hafnarfjörður' },
        { value: 'akureyri', label: 'Akureyri' },
      ],
      condition: doesNotKnowParentIds,
    }),
    buildCheckboxField({
      id: `${base}.needsInterpreter`,
      spacing: 0,
      options: [
        {
          value: YES,
          label: childMessages.manualInfo.needsInterpreter,
        },
      ],
      condition: (answers) => {
        const parent = getApplicationAnswers(answers)[`${parentKey}`]

        // Show only in the manual (does not know IDs) flow.
        // Interpreter is relevant only for non-Icelandic citizenship.
        return (
          doesNotKnowParentIds(answers) &&
          !!parent?.citizenship &&
          parent?.citizenship !== 'IS'
        )
      },
    }),
    buildSelectField({
      id: `${base}.preferredLanguage`,
      title: childMessages.manualInfo.language,
      placeholder: childMessages.manualInfo.languagePlaceholder,
      doesNotRequireAnswer: true,
      options: getAllLanguageCodes().map((l) => ({
        value: l.code,
        label: l.name,
      })),
      condition: (answers) => {
        const parent = getApplicationAnswers(answers)[`${parentKey}`]

        // Show only in the manual (does not know IDs) flow.
        // Preferred language is shown for non-Icelandic citizenship when interpreter support is requested.
        return (
          doesNotKnowParentIds(answers) &&
          !!parent?.citizenship &&
          parent?.citizenship !== 'IS' &&
          !!parent?.needsInterpreter?.includes(YES)
        )
      },
    }),
  ]
}

export const parentsSection = buildSection({
  id: 'parentsSection',
  title: ({ answers }) =>
    isUnborn(answers)
      ? parentsMessages.expectantParents.sectionTitle
      : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
      ? parentsMessages.custodians.sectionTitle
      : parentsMessages.guardians.sectionTitle,
  // TODO: Need to add condition here to check if kerfiskennitala if isKnowsNationalId()
  children: [
    buildMultiField({
      id: 'parents',
      title: ({ answers }) =>
        isUnborn(answers)
          ? parentsMessages.expectantParents.sectionTitle
          : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
          ? parentsMessages.custodians.title
          : parentsMessages.guardians.title,
      description: ({ answers }) =>
        isUnborn(answers)
          ? parentsMessages.expectantParents.description
          : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
          ? parentsMessages.custodians.description
          : parentsMessages.guardians.description,
      children: [
        buildRadioField({
          id: 'parents.knowsParentNationalIds',
          title: ({ answers }) =>
            isUnborn(answers)
              ? parentsMessages.expectantParents.radioLabel
              : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
              ? parentsMessages.custodians.radioLabel
              : parentsMessages.guardians.radioLabel,
          required: true,
          width: 'half',
          options: [
            {
              value: YES,
              label: sharedMessages.radioYes,
            },
            {
              value: NO,
              label: sharedMessages.radioNo,
            },
          ],
        }),
        buildDescriptionField({
          id: 'parents.parent1Title',
          title: ({ answers }) =>
            isUnborn(answers)
              ? parentsMessages.expectantParents.parent1Title
              : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
              ? parentsMessages.custodians.parent1Title
              : parentsMessages.guardians.parent1Title,
          titleVariant: 'h5',
          space: 4,
          condition: knowsParentIds,
        }),
        buildDescriptionField({
          id: 'parents.parent1Description',
          title: ({ answers }) =>
            isUnborn(answers)
              ? parentsMessages.expectantParents.parent1Title
              : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
              ? parentsMessages.custodians.parent1Title
              : parentsMessages.guardians.parent1Title,
          description: parentsMessages.shared.parentDescription,
          titleVariant: 'h3',
          space: 4,
          condition: doesNotKnowParentIds,
        }),
        ...buildParentFields('parent1'),
        buildDescriptionField({
          id: 'parents.parent2Title',
          title: ({ answers }) =>
            isUnborn(answers)
              ? parentsMessages.expectantParents.parent2Title
              : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
              ? parentsMessages.custodians.parent2Title
              : parentsMessages.guardians.parent2Title,
          titleVariant: 'h5',
          space: 4,
          condition: knowsParentIds,
        }),
        buildDescriptionField({
          id: 'parents.parent2Description',
          title: ({ answers }) =>
            isUnborn(answers)
              ? parentsMessages.expectantParents.parent2Title
              : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
              ? parentsMessages.custodians.parent2Title
              : parentsMessages.guardians.parent2Title,
          description: parentsMessages.shared.parentDescription,
          titleVariant: 'h3',
          space: 4,
          condition: doesNotKnowParentIds,
        }),
        ...buildParentFields('parent2'),
        buildAlertMessageField({
          id: 'parents.fetchedDataInfo',
          alertType: 'info',
          message: ({ answers }) =>
            isUnborn(answers)
              ? parentsMessages.expectantParents.fetchedDataInfo
              : isKnowsNationalId(answers) // TODO: Need to check if kerfiskennitala!
              ? parentsMessages.custodians.fetchedDataInfo
              : parentsMessages.guardians.fetchedDataInfo,
          condition: (answers) => {
            const { parent1, parent2 } = getApplicationAnswers(answers)
            return (
              knowsParentIds(answers) &&
              (!!parent1?.nationalIdInfo?.name ||
                !!parent2?.nationalIdInfo?.name)
            )
          },
        }),
      ],
    }),
  ],
})
