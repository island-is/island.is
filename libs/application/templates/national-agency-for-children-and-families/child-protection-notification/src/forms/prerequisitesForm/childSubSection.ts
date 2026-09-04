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
  buildTitleField,
  YES,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { getAllLanguageCodes } from '@island.is/shared/utils'
import {
  childMessages,
  memmMessages,
  prerequisitesMessages,
  sharedMessages,
} from '../../lib/messages'
import {
  isChildOver18,
  isKnowsNationalId,
  isNoNationalId,
  shouldShowNonPrimarySchoolAgeChildInfo,
} from '../../utils/conditionUtils'
import { KnowsNationalId, Roles } from '../../utils/constants'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'
import { getApplicantRole } from '../../utils/roleUtils'

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

        buildTitleField({
          title: prerequisitesMessages.child.school,
          titleVariant: 'h4',
          marginTop: 4,
          marginBottom: 0,
          condition: (answers, _, user) => {
            const role = getApplicantRole(user?.profile?.nationalId ?? '')
            return (
              shouldShowNonPrimarySchoolAgeChildInfo(answers) &&
              role === Roles.ADULT_PERSONAL_APPLICANT
            )
          },
        }),
        buildSelectField({
          id: 'child.nationalIdInfo.schoolType',
          title: prerequisitesMessages.child.schoolType,
          placeholder: prerequisitesMessages.child.schoolTypePlaceholder,
          doesNotRequireAnswer: true,
          options: () => {
            // TODO: Replace with values from barnaverndargatt API when available.
            return [
              {
                value: 'Valmöguleiki 1',
                label: 'Valmöguleiki 1',
              },
              {
                value: 'Valmöguleiki 2',
                label: 'Valmöguleiki 2',
              },
              {
                value: 'Valmöguleiki 3',
                label: 'Valmöguleiki 3',
              },
            ]
          },
          condition: (answers, _, user) => {
            const role = getApplicantRole(user?.profile?.nationalId ?? '')
            return (
              shouldShowNonPrimarySchoolAgeChildInfo(answers) &&
              role === Roles.ADULT_PERSONAL_APPLICANT
            )
          },
        }),
        buildTextField({
          id: 'child.nationalIdInfo.schoolName',
          title: memmMessages.education.schoolName,
          doesNotRequireAnswer: true,
          condition: (answers, _, user) => {
            // TODO: Look into when this field should be displayed
            const role = getApplicantRole(user?.profile?.nationalId ?? '')
            return (
              shouldShowNonPrimarySchoolAgeChildInfo(answers) &&
              role === Roles.ADULT_PERSONAL_APPLICANT &&
              !!getApplicationAnswers(answers).childSchoolType
            )
          },
        }),

        buildDescriptionField({
          id: 'child.nationalIdInfo.languageTitle',
          title: childMessages.manualInfo.languageTitle,
          titleVariant: 'h4',
          space: 4,
          condition: (answers, _, user) => {
            const role = getApplicantRole(user?.profile?.nationalId ?? '')
            return (
              shouldShowNonPrimarySchoolAgeChildInfo(answers) &&
              role === Roles.ADULT_PERSONAL_APPLICANT
            )
          },
        }),
        buildSelectField({
          id: 'child.nationalIdInfo.language',
          title: sharedMessages.language,
          placeholder: sharedMessages.languagePlaceholder,
          doesNotRequireAnswer: true,
          options: getAllLanguageCodes().map((l) => ({
            value: l.code,
            label: l.name,
          })),
          condition: (answers, _, user) => {
            const role = getApplicantRole(user?.profile?.nationalId ?? '')
            return (
              shouldShowNonPrimarySchoolAgeChildInfo(answers) &&
              role === Roles.ADULT_PERSONAL_APPLICANT
            )
          },
        }),
        buildCheckboxField({
          id: 'child.nationalIdInfo.needsInterpreter',
          spacing: 0,
          options: [
            {
              value: YES,
              label: sharedMessages.needsInterpreter,
            },
          ],
          condition: (answers, _, user) => {
            const role = getApplicantRole(user?.profile?.nationalId ?? '')
            return (
              shouldShowNonPrimarySchoolAgeChildInfo(answers) &&
              role === Roles.ADULT_PERSONAL_APPLICANT
            )
          },
        }),

        buildAlertMessageField({
          id: 'child.fetchedDataInfo',
          alertType: 'info',
          message: childMessages.nationalIdLookup.fetchedDataInfo,
          condition: (answers) =>
            isKnowsNationalId(answers) &&
            !!getApplicationAnswers(answers).childName,
        }),
        buildAlertMessageField({
          id: 'child.over18Error',
          alertType: 'error',
          message: childMessages.nationalIdLookup.childOver18Error,
          marginTop: 0,
          condition: (answers) =>
            isKnowsNationalId(answers) && isChildOver18(answers),
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: prerequisitesMessages.child.startNotification,
              type: 'primary',
              condition: (answers) =>
                !(isKnowsNationalId(answers) && isChildOver18(answers)),
            },
          ],
        }),
      ],
    }),
  ],
})
