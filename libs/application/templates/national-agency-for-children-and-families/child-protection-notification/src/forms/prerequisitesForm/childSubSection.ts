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
  coreMessages,
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
import { getYesNoDoNotKnowOptions } from '../../utils/childProtectionNotificationUtils'
import {
  isChildOver18,
  isDayCareProvider,
  isKnowsNationalId,
  isNoNationalId,
  isSchoolType,
  shouldShowAdultPersonalApplicantChildInfo,
} from '../../utils/conditionUtils'
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
          title: prerequisitesMessages.child.education,
          titleVariant: 'h4',
          marginTop: 4,
          marginBottom: 0,
          condition: (answers, _, user) =>
            shouldShowAdultPersonalApplicantChildInfo(
              answers,
              user?.profile?.nationalId,
            ),
        }),
        buildSelectField({
          id: 'child.nationalIdInfo.education.type',
          title: prerequisitesMessages.child.educationType,
          placeholder: prerequisitesMessages.child.educationTypePlaceholder,
          doesNotRequireAnswer: true,
          options: ({ externalData }) => {
            const { schoolTypes } = getApplicationExternalData(externalData)
            return schoolTypes.map((r) => ({
              value: r.value ?? '',
              label: r.label ?? '',
            }))
          },
          condition: (answers, _, user) =>
            shouldShowAdultPersonalApplicantChildInfo(
              answers,
              user?.profile?.nationalId,
            ),
        }),
        buildTextField({
          id: 'child.nationalIdInfo.education.schoolName',
          title: memmMessages.education.schoolName,
          doesNotRequireAnswer: true,
          condition: (answers, _, user) =>
            shouldShowAdultPersonalApplicantChildInfo(
              answers,
              user?.profile?.nationalId,
            ) &&
            isSchoolType(getApplicationAnswers(answers).childEducationType),
        }),
        buildTextField({
          id: 'child.nationalIdInfo.education.caregiverName',
          title: coreMessages.name,
          doesNotRequireAnswer: true,
          condition: (answers, _, user) =>
            shouldShowAdultPersonalApplicantChildInfo(
              answers,
              user?.profile?.nationalId,
            ) &&
            isDayCareProvider(
              getApplicationAnswers(answers).childEducationType,
            ),
        }),

        buildDescriptionField({
          id: 'child.nationalIdInfo.languageTitle',
          title: childMessages.manualInfo.languageTitle,
          titleVariant: 'h4',
          space: 4,
          condition: (answers, _, user) =>
            shouldShowAdultPersonalApplicantChildInfo(
              answers,
              user?.profile?.nationalId,
            ),
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
          condition: (answers, _, user) =>
            shouldShowAdultPersonalApplicantChildInfo(
              answers,
              user?.profile?.nationalId,
            ),
        }),
        buildRadioField({
          id: 'child.nationalIdInfo.needsInterpreter',
          title: sharedMessages.needsInterpreter,
          widthWithIllustration: '1/3',
          space: 4,
          options: getYesNoDoNotKnowOptions(),
          condition: (answers) => isKnowsNationalId(answers),
        }),

        buildAlertMessageField({
          id: 'child.fetchedDataInfo',
          alertType: 'info',
          message: childMessages.nationalIdLookup.fetchedDataInfo,
          marginTop: 4,
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
