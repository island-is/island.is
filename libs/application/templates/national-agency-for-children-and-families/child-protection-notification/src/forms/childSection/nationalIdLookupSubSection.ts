import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildRadioField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import { childMessages, sharedMessages } from '../../lib/messages'
import {
  KnowsNationalId,
  NoNationalIdReason,
  Pronoun,
} from '../../utils/constants'

const knowsNationalId = (answers: Record<string, unknown>) =>
  getValueViaPath(answers, 'child.knowsNationalId') === KnowsNationalId.YES

export const nationalIdLookupSubSection = buildSubSection({
  id: 'nationalIdLookupSubSection',
  title: childMessages.shared.sectionTitle,
  children: [
    buildMultiField({
      id: 'nationalIdLookup',
      title: childMessages.shared.sectionTitle,
      nextButtonText: sharedMessages.nextButton,
      children: [
        buildDescriptionField({
          id: 'nationalIdLookup.intro',
          description: childMessages.nationalIdLookup.intro,
          space: 0,
        }),
        buildDescriptionField({
          id: 'nationalIdLookup.benefitDescription',
          description: childMessages.nationalIdLookup.benefitDescription,
          space: 2,
        }),
        buildDescriptionField({
          id: 'nationalIdLookup.fallbackDescription',
          description: childMessages.nationalIdLookup.fallbackDescription,
          space: 2,
        }),
        buildRadioField({
          id: 'child.knowsNationalId',
          title: childMessages.nationalIdLookup.radioLabel,
          required: true,
          widthWithIllustration: '1/3',
          options: [
            {
              value: KnowsNationalId.YES,
              label: childMessages.nationalIdLookup.radioOptionYes,
            },
            {
              value: KnowsNationalId.NO,
              label: childMessages.nationalIdLookup.radioOptionNo,
            },
            {
              value: KnowsNationalId.UNBORN,
              label: childMessages.nationalIdLookup.radioOptionUnborn,
            },
          ],
        }),
        buildSelectField({
          id: 'child.noNationalIdReason',
          title: childMessages.noNationalId.reasonLabel,
          placeholder: childMessages.noNationalId.reasonPlaceholder,
          doesNotRequireAnswer: true,
          condition: (answers) =>
            getValueViaPath(answers, 'child.knowsNationalId') ===
            KnowsNationalId.NO,
          options: [
            {
              value: NoNationalIdReason.EXPECTED_BUT_UNKNOWN,
              label: childMessages.noNationalId.reasonExpectedButUnknown,
            },
            {
              value: NoNationalIdReason.TRAVELER,
              label: childMessages.noNationalId.reasonTraveler,
            },
            {
              value: NoNationalIdReason.BORDER_RECEPTION,
              label: childMessages.noNationalId.reasonBorderReception,
            },
          ],
        }),
        buildDescriptionField({
          id: 'nationalIdLookup.childInfoTitle',
          title: childMessages.nationalIdLookup.childInfoTitle,
          titleVariant: 'h4',
          space: 4,
          condition: knowsNationalId,
        }),
        buildNationalIdWithNameField({
          id: 'child.nationalIdInfo',
          required: true,
          searchPersons: true,
          condition: knowsNationalId,
        }),
        buildTextField({
          id: 'child.nationalIdInfo.email',
          title: childMessages.nationalIdLookup.email,
          placeholder: childMessages.nationalIdLookup.emailPlaceholder,
          variant: 'email',
          width: 'half',
          doesNotRequireAnswer: true,
          condition: knowsNationalId,
        }),
        buildPhoneField({
          id: 'child.nationalIdInfo.phone',
          title: childMessages.nationalIdLookup.phone,
          width: 'half',
          enableCountrySelector: true,
          doesNotRequireAnswer: true,
          condition: knowsNationalId,
        }),
        buildCheckboxField({
          id: 'child.nationalIdInfo.usePronounAndPreferredName',
          spacing: 0,
          condition: knowsNationalId,
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
          id: 'child.nationalIdInfo.preferredName',
          title: childMessages.nationalIdLookup.preferredName,
          placeholder: childMessages.nationalIdLookup.preferredNamePlaceholder,
          doesNotRequireAnswer: true,
          condition: (answers) =>
            knowsNationalId(answers) &&
            (
              getValueViaPath<string[]>(
                answers,
                'child.nationalIdInfo.usePronounAndPreferredName',
              ) ?? []
            ).includes(YES),
        }),
        buildSelectField({
          id: 'child.nationalIdInfo.preferredPronoun',
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
            knowsNationalId(answers) &&
            (
              getValueViaPath<string[]>(
                answers,
                'child.nationalIdInfo.usePronounAndPreferredName',
              ) ?? []
            ).includes(YES),
        }),
        buildAlertMessageField({
          id: 'nationalIdLookup.fetchedDataInfo',
          alertType: 'info',
          message: childMessages.nationalIdLookup.fetchedDataInfo,
          condition: (answers) =>
            knowsNationalId(answers) &&
            !!getValueViaPath(answers, 'child.nationalIdInfo.name'),
        }),
      ],
    }),
  ],
})
