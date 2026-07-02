import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { getAllCountryCodes } from '@island.is/shared/utils'
import {
  childMessages,
  expectantParentsMessages,
  sharedMessages,
} from '../../lib/messages'
import {
  KnowsNationalId,
  KnowsParentNationalId,
  ParentGender,
} from '../../utils/constants'

const isUnborn = (answers: Record<string, unknown>) =>
  getValueViaPath(answers, 'child.knowsNationalId') === KnowsNationalId.UNBORN

const knowsParentIds = (answers: Record<string, unknown>) =>
  getValueViaPath(answers, 'expectantParents.knowsParentNationalIds') ===
  KnowsParentNationalId.YES

const doesNotKnowParentIds = (answers: Record<string, unknown>) =>
  getValueViaPath(answers, 'expectantParents.knowsParentNationalIds') ===
  KnowsParentNationalId.NO

const parentSectionVisible = (answers: Record<string, unknown>) =>
  knowsParentIds(answers) || doesNotKnowParentIds(answers)

const parentGenderOptions = [
  {
    value: ParentGender.FEMALE,
    label: expectantParentsMessages.shared.genderFemale,
  },
  {
    value: ParentGender.MALE,
    label: expectantParentsMessages.shared.genderMale,
  },
  {
    value: ParentGender.NON_BINARY,
    label: expectantParentsMessages.shared.genderNonBinary,
  },
]

const countryOptions = getAllCountryCodes().map((c) => ({
  value: c.code,
  label: c.name_is ?? c.name,
}))

const citizenshipOptions = getAllCountryCodes().map((c) => ({
  value: c.code,
  label: c.code,
}))

const municipalityOptions = [
  { value: 'reykjavik', label: 'Reykjavík' },
  { value: 'kopavogur', label: 'Kópavogur' },
  { value: 'hafnarfjordur', label: 'Hafnarfjörður' },
  { value: 'akureyri', label: 'Akureyri' },
]

const buildParentFields = (parentKey: 'parent1' | 'parent2') => {
  const base = `expectantParents.${parentKey}`

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
      placeholder: childMessages.nationalIdLookup.emailPlaceholder,
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
      title: expectantParentsMessages.shared.nameAgeGenderTitle,
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
      width: 'half',
      doesNotRequireAnswer: true,
      options: parentGenderOptions,
      condition: doesNotKnowParentIds,
    }),

    // --- Nei path: address ---
    buildDescriptionField({
      id: `${base}.addressTitle`,
      title: expectantParentsMessages.shared.addressTitle,
      titleVariant: 'h5',
      space: 4,
      condition: doesNotKnowParentIds,
    }),
    buildSelectField({
      id: `${base}.country`,
      title: childMessages.manualInfo.country,
      width: 'half',
      doesNotRequireAnswer: true,
      options: countryOptions,
      condition: doesNotKnowParentIds,
    }),
    buildSelectField({
      id: `${base}.citizenship`,
      title: expectantParentsMessages.shared.citizenship,
      width: 'half',
      doesNotRequireAnswer: true,
      options: citizenshipOptions,
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
      width: 'half',
      doesNotRequireAnswer: true,
      // TODO: replace with real municipality data when API is wired up
      options: municipalityOptions,
      condition: doesNotKnowParentIds,
    }),
  ]
}

export const expectantParentsSection = buildSection({
  id: 'expectantParentsSection',
  title: expectantParentsMessages.shared.sectionTitle,
  condition: isUnborn,
  children: [
    buildMultiField({
      id: 'expectantParents',
      title: expectantParentsMessages.shared.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'expectantParents.intro1',
          description: expectantParentsMessages.shared.intro1,
          space: 0,
        }),
        buildDescriptionField({
          id: 'expectantParents.intro2',
          description: expectantParentsMessages.shared.intro2,
          space: 2,
        }),
        buildRadioField({
          id: 'expectantParents.knowsParentNationalIds',
          title: expectantParentsMessages.shared.radioLabel,
          required: true,
          width: 'half',
          options: [
            {
              value: KnowsParentNationalId.YES,
              label: sharedMessages.radioYes,
            },
            {
              value: KnowsParentNationalId.NO,
              label: sharedMessages.radioNo,
            },
          ],
        }),
        buildDescriptionField({
          id: 'expectantParents.parent1Title',
          title: expectantParentsMessages.shared.parent1Title,
          titleVariant: 'h3',
          space: 4,
          condition: parentSectionVisible,
        }),
        buildDescriptionField({
          id: 'expectantParents.parent1Description',
          description: expectantParentsMessages.shared.parentDescription,
          space: 2,
          condition: doesNotKnowParentIds,
        }),
        ...buildParentFields('parent1'),
        buildDescriptionField({
          id: 'expectantParents.parent2Title',
          title: expectantParentsMessages.shared.parent2Title,
          titleVariant: 'h3',
          space: 4,
          condition: parentSectionVisible,
        }),
        buildDescriptionField({
          id: 'expectantParents.parent2Description',
          description: expectantParentsMessages.shared.parentDescription,
          space: 2,
          condition: doesNotKnowParentIds,
        }),
        ...buildParentFields('parent2'),
        buildAlertMessageField({
          id: 'expectantParents.fetchedDataInfo',
          alertType: 'info',
          message: expectantParentsMessages.shared.fetchedDataInfo,
          condition: knowsParentIds,
        }),
      ],
    }),
  ],
})
