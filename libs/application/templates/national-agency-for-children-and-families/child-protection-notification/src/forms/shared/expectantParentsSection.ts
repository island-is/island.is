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
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { getAllCountryCodes } from '@island.is/shared/utils'
import {
  childMessages,
  expectantParentsMessages,
  sharedMessages,
} from '../../lib/messages'
import { ParentGender } from '../../utils/constants'
import {
  doesNotKnowParentIds,
  isUnborn,
  knowsParentIds,
} from '../../utils/conditionUtils'

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
      title: expectantParentsMessages.nameAgeGenderTitle,
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
      placeholder: expectantParentsMessages.genderPlaceholder,
      width: 'half',
      doesNotRequireAnswer: true,
      options: [
        {
          value: ParentGender.FEMALE,
          label: expectantParentsMessages.genderFemale,
        },
        {
          value: ParentGender.MALE,
          label: expectantParentsMessages.genderMale,
        },
        {
          value: ParentGender.NON_BINARY,
          label: expectantParentsMessages.genderNonBinary,
        },
      ],
      condition: doesNotKnowParentIds,
    }),

    // --- Nei path: address ---
    buildDescriptionField({
      id: `${base}.addressTitle`,
      title: expectantParentsMessages.addressTitle,
      titleVariant: 'h5',
      space: 4,
      condition: doesNotKnowParentIds,
    }),
    buildSelectField({
      id: `${base}.country`,
      title: childMessages.manualInfo.country,
      placeholder: expectantParentsMessages.countryPlaceholder,
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
      title: expectantParentsMessages.citizenship,
      placeholder: expectantParentsMessages.citizenshipPlaceholder,
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
      placeholder: expectantParentsMessages.municipalityPlaceholder,
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
  ]
}

export const expectantParentsSection = buildSection({
  id: 'expectantParentsSection',
  title: expectantParentsMessages.sectionTitle,
  condition: isUnborn,
  children: [
    buildMultiField({
      id: 'expectantParents',
      title: expectantParentsMessages.sectionTitle,
      description: expectantParentsMessages.description,
      children: [
        buildRadioField({
          id: 'expectantParents.knowsParentNationalIds',
          title: expectantParentsMessages.radioLabel,
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
          id: 'expectantParents.parent1Title',
          title: expectantParentsMessages.parent1Title,
          titleVariant: 'h5',
          space: 4,
          condition: knowsParentIds,
        }),
        buildDescriptionField({
          id: 'expectantParents.parent1Description',
          title: expectantParentsMessages.parent1Title,
          description: expectantParentsMessages.parentDescription,
          titleVariant: 'h3',
          space: 4,
          condition: doesNotKnowParentIds,
        }),
        ...buildParentFields('parent1'),
        buildDescriptionField({
          id: 'expectantParents.parent2Title',
          title: expectantParentsMessages.parent2Title,
          titleVariant: 'h5',
          space: 4,
          condition: knowsParentIds,
        }),
        buildDescriptionField({
          id: 'expectantParents.parent2Description',
          title: expectantParentsMessages.parent2Title,
          description: expectantParentsMessages.parentDescription,
          titleVariant: 'h3',
          space: 4,
          condition: doesNotKnowParentIds,
        }),
        ...buildParentFields('parent2'),
        buildAlertMessageField({
          id: 'expectantParents.fetchedDataInfo',
          alertType: 'info',
          message: expectantParentsMessages.fetchedDataInfo,
          condition: (answers) =>
            !!getValueViaPath(
              answers,
              'expectantParents.parent1.nationalIdInfo.name',
            ) ||
            !!getValueViaPath(
              answers,
              'expectantParents.parent2.nationalIdInfo.name',
            ),
        }),
      ],
    }),
  ],
})
