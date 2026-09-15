import {
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
  coreMessages,
} from '@island.is/application/core'
import {
  getAllCountryCodes,
  getAllLanguageCodes,
} from '@island.is/shared/utils'
import { parentsMessages, sharedMessages } from '../../lib/messages'
import {
  getParentMessages,
  getYesNoDoNotKnowOptions,
  getYesNoOptions,
} from '../../utils/childProtectionNotificationUtils'
import {
  doesNotKnowParentIds,
  isKnowsNationalId,
  isUnborn,
  knowsParentIds,
  showParentsSection,
} from '../../utils/conditionUtils'
import { IS } from '../../utils/constants'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'
import { ParentKey } from '../../utils/types'

const buildParentFields = (parentKey: ParentKey) => {
  const base = `parents.${parentKey}`
  const knows = knowsParentIds(parentKey)
  const doesNotKnow = doesNotKnowParentIds(parentKey)
  const titleKey = parentKey === 'parent1' ? 'parent1Title' : 'parent2Title'

  return [
    buildDescriptionField({
      id: `${base}.title`,
      title: ({ answers }) => getParentMessages(answers)[titleKey],
      titleVariant: 'h3',
      space: parentKey === 'parent2' ? 4 : 0,
    }),
    buildRadioField({
      id: `${base}.knowsNationalId`,
      title: ({ answers }) => getParentMessages(answers).radioLabel,
      required: true,
      width: 'half',
      options: getYesNoOptions(),
    }),

    // --- Já path: SSN lookup + email + phone ---
    buildNationalIdWithNameField({
      id: `${base}.nationalIdInfo`,
      required: false,
      searchPersons: true,
      condition: knows,
    }),
    buildTextField({
      id: `${base}.nationalIdInfo.email`,
      title: sharedMessages.email,
      variant: 'email',
      width: 'half',
      doesNotRequireAnswer: true,
      condition: knows,
    }),
    buildPhoneField({
      id: `${base}.nationalIdInfo.phone`,
      title: sharedMessages.phone,
      width: 'half',
      enableCountrySelector: true,
      doesNotRequireAnswer: true,
      condition: knows,
    }),
    buildAlertMessageField({
      id: `${base}.fetchedDataInfo`,
      alertType: 'info',
      message: ({ answers }) => getParentMessages(answers).fetchedDataInfo,
      condition: (answers) =>
        knows(answers) &&
        !!getApplicationAnswers(answers)[parentKey]?.nationalIdInfo?.name,
    }),

    // --- Nei path: manual name/age/gender ---
    buildDescriptionField({
      id: `${base}.nameAgeGenderTitle`,
      title: ({ answers }) => getParentMessages(answers).nameAgeGenderTitle,
      titleVariant: 'h5',
      space: 4,
      condition: doesNotKnow,
    }),
    buildTextField({
      id: `${base}.name`,
      title: coreMessages.name,
      doesNotRequireAnswer: true,
      condition: doesNotKnow,
    }),
    buildTextField({
      id: `${base}.age`,
      title: sharedMessages.age,
      width: 'half',
      variant: 'number',
      doesNotRequireAnswer: true,
      condition: doesNotKnow,
    }),
    buildSelectField({
      id: `${base}.gender`,
      title: sharedMessages.gender,
      placeholder: sharedMessages.genderPlaceholder,
      width: 'half',
      doesNotRequireAnswer: true,
      options: ({ externalData }) => {
        const { genders } = getApplicationExternalData(externalData)
        return (
          genders
            // Exclude child genders (3=Drengur, 4=Stúlka) and unborn (5=Ófætt)
            .filter((g) => !['3', '4', '5'].includes(g.value ?? ''))
            .map((g) => ({ value: g.value ?? '', label: g.label ?? '' }))
        )
      },
      condition: doesNotKnow,
    }),

    // --- Nei path: address ---
    buildDescriptionField({
      id: `${base}.addressTitle`,
      title: ({ answers }) => getParentMessages(answers).addressTitle,
      titleVariant: 'h5',
      space: 4,
      condition: doesNotKnow,
    }),
    buildSelectField({
      id: `${base}.country`,
      title: sharedMessages.country,
      placeholder: sharedMessages.countryPlaceholder,
      width: 'half',
      doesNotRequireAnswer: true,
      options: getAllCountryCodes().map((c) => ({
        value: c.code,
        label: c.name_is ?? c.name,
      })),
      condition: doesNotKnow,
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
      condition: doesNotKnow,
    }),
    buildTextField({
      id: `${base}.address`,
      title: sharedMessages.address,
      doesNotRequireAnswer: true,
      condition: doesNotKnow,
    }),
    buildTextField({
      id: `${base}.postalCode`,
      title: sharedMessages.postalCode,
      width: 'half',
      doesNotRequireAnswer: true,
      condition: (answers) => {
        const parent = getApplicationAnswers(answers)[parentKey]

        return (
          doesNotKnow(answers) && !!parent?.country && parent?.country !== IS
        )
      },
    }),
    buildTextField({
      id: `${base}.municipality`,
      title: sharedMessages.municipality,
      width: 'half',
      doesNotRequireAnswer: true,
      condition: (answers) => {
        const parent = getApplicationAnswers(answers)[parentKey]

        return (
          doesNotKnow(answers) && !!parent?.country && parent?.country !== IS
        )
      },
    }),
    buildSelectField({
      id: `${base}.municipalityPostalCode`,
      title: sharedMessages.municipality,
      placeholder: sharedMessages.municipalityPlaceholder,
      doesNotRequireAnswer: true,
      options: ({ externalData }) => {
        const { postalCodes } = getApplicationExternalData(externalData)
        return postalCodes.map((p) => ({
          value: p.value ?? '',
          label: p.label ?? '',
        }))
      },
      condition: (answers) => {
        const parent = getApplicationAnswers(answers)[parentKey]

        return (
          doesNotKnow(answers) && !!parent?.country && parent?.country === IS
        )
      },
    }),
    buildRadioField({
      id: `${base}.needsInterpreter`,
      title: sharedMessages.needsInterpreter,
      titleVariant: 'h5',
      widthWithIllustration: '1/3',
      space: 4,
      options: getYesNoDoNotKnowOptions(),
      condition: (answers) => {
        const parent = getApplicationAnswers(answers)[parentKey]

        // Show only in the manual (does not know IDs) flow.
        // Interpreter is relevant only for non-Icelandic citizenship.
        return (
          doesNotKnow(answers) &&
          !!parent?.citizenship &&
          parent?.citizenship !== IS
        )
      },
    }),
    buildSelectField({
      id: `${base}.preferredLanguage`,
      title: sharedMessages.language,
      placeholder: sharedMessages.languagePlaceholder,
      doesNotRequireAnswer: true,
      options: getAllLanguageCodes().map((l) => ({
        value: l.code,
        label: l.name,
      })),
      condition: (answers) => {
        const parent = getApplicationAnswers(answers)[parentKey]

        // Show only in the manual (does not know IDs) flow.
        // Preferred language is shown for non-Icelandic citizenship when interpreter support is requested.
        return (
          doesNotKnow(answers) &&
          !!parent?.citizenship &&
          parent?.citizenship !== IS &&
          parent?.needsInterpreter === YES
        )
      },
    }),
  ]
}

export const parentsSection = buildSection({
  id: 'parentsSection',
  title: ({ answers }) => getParentMessages(answers).sectionTitle,
  condition: showParentsSection,
  children: [
    buildMultiField({
      id: 'parents',
      title: ({ answers }) =>
        isUnborn(answers)
          ? parentsMessages.expectantParents.sectionTitle
          : isKnowsNationalId(answers)
          ? parentsMessages.custodians.title
          : parentsMessages.guardians.title,
      description: ({ answers }) => getParentMessages(answers).description,
      children: [
        ...buildParentFields('parent1'),
        ...buildParentFields('parent2'),
      ],
    }),
  ],
})
