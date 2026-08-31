import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildPhoneField,
  buildRadioField,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import {
  childMessages,
  prerequisitesMessages,
  sharedMessages,
} from '../../lib/messages'
import { isKnowsNationalId, isNoNationalId } from '../../utils/conditionUtils'
import { KnowsNationalId } from '../../utils/constants'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'

export const childSubSection = buildSubSection({
  id: 'childSubSection',
  title: childMessages.shared.sectionTitle,
  children: [
    buildMultiField({
      id: 'child',
      title: childMessages.shared.sectionTitle,
      description: childMessages.nationalIdLookup.description,
      children: [
        buildRadioField({
          id: 'child.knowsNationalId',
          title: childMessages.nationalIdLookup.radioLabel,
          required: true,
          widthWithIllustration: '1/3',
          options: [
            {
              value: KnowsNationalId.YES,
              label: sharedMessages.radioYes,
            },
            {
              value: KnowsNationalId.NO,
              label: sharedMessages.radioNo,
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
          condition: isNoNationalId,
          options: ({ externalData }) => {
            const { childUnknownNationalIdStates } =
              getApplicationExternalData(externalData)
            return childUnknownNationalIdStates.map((r) => ({
              value: r.value ?? '',
              label: r.label ?? '',
            }))
          },
        }),
        buildDescriptionField({
          id: 'child.childInfoTitle',
          title: childMessages.nationalIdLookup.childInfoTitle,
          titleVariant: 'h4',
          space: 4,
          condition: isKnowsNationalId,
        }),
        buildNationalIdWithNameField({
          id: 'child.nationalIdInfo',
          required: true,
          searchPersons: true,
          condition: isKnowsNationalId,
        }),
        buildPhoneField({
          id: 'child.nationalIdInfo.phone',
          title: sharedMessages.phone,
          enableCountrySelector: true,
          doesNotRequireAnswer: true,
          condition: isKnowsNationalId,
        }),
        buildCheckboxField({
          id: 'child.nationalIdInfo.usePronounAndPreferredName',
          spacing: 0,
          condition: isKnowsNationalId,
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
          doesNotRequireAnswer: true,
          condition: (answers) =>
            isKnowsNationalId(answers) &&
            getApplicationAnswers(
              answers,
            ).childUsePronounAndPreferredName?.includes(YES),
        }),
        buildSelectField({
          id: 'child.nationalIdInfo.preferredPronoun',
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
            isKnowsNationalId(answers) &&
            getApplicationAnswers(
              answers,
            ).childUsePronounAndPreferredName?.includes(YES),
        }),
        buildAlertMessageField({
          id: 'child.fetchedDataInfo',
          alertType: 'info',
          message: childMessages.nationalIdLookup.fetchedDataInfo,
          condition: (answers) =>
            isKnowsNationalId(answers) &&
            !!getApplicationAnswers(answers).childName,
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: prerequisitesMessages.child.startNotification,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
