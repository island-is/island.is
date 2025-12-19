import { buildOverviewField, YES } from '@island.is/application/core'
import {
  childrenNGuardiansMessages,
  differentNeedsMessages,
  overviewMessages,
  primarySchoolMessages,
} from '../lib/messages'
import {
  hasSpecialEducationSubType,
  shouldShowPage,
  shouldShowReasonForApplicationPage,
} from './conditionUtils'
import {
  ApplicationFeatureKey,
  ApplicationType,
  ReasonForApplicationOptions,
} from './constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from './newPrimarySchoolUtils'
import {
  attachmentItems,
  childItems,
  counsellingRegardingApplicationItems,
  currentNurseryItems,
  currentSchoolItems,
  guardiansItems,
  healthProtectionItems,
  languagesItems,
  payerItems,
  reasonForApplicationItems,
  relativesTable,
  schoolItems,
  siblingsTable,
  specialEducationSupportItems,
  supportItems,
} from './overviewItems'

const MAX_GUARDIANS = 2

const buildGuardianOverviewFields = (editable?: boolean) =>
  [...Array(MAX_GUARDIANS)].map((_key, index) => {
    return buildOverviewField({
      id: `overview.guardians.${index}`,
      title: {
        ...overviewMessages.guardians,
        values: { index: index + 1 },
      },
      backId: editable ? 'guardians' : undefined,
      items: (answers, externalData, userNationalId) =>
        guardiansItems(answers, externalData, userNationalId, index),
      condition: (answers) => {
        const { guardians } = getApplicationAnswers(answers)
        return guardians.length > index
      },
    })
  })

export const overviewFields = (editable?: boolean) => {
  return [
    buildOverviewField({
      id: 'overview.childInfo',
      title: overviewMessages.child,
      backId: editable ? 'childInfo' : undefined,
      loadItems: childItems,
    }),
    ...buildGuardianOverviewFields(editable),
    buildOverviewField({
      id: 'overview.relatives',
      title: childrenNGuardiansMessages.relatives.subSectionTitle,
      backId: editable ? 'relatives' : undefined,
      loadTableData: relativesTable,
    }),
    buildOverviewField({
      id: 'overview.currentSchool',
      title: primarySchoolMessages.currentSchool.subSectionTitle,
      backId: (_, externalData) => {
        const { primaryOrgId } = getApplicationExternalData(externalData)

        // If the primaryOrgId doesn't exists it means Frigg doesn't have the data
        // and applicant should be able to edit if editable
        return primaryOrgId ? undefined : editable ? 'currentSchool' : undefined
      },
      items: currentSchoolItems,
      condition: (answers) => {
        const { applicationType } = getApplicationAnswers(answers)

        return (
          applicationType === ApplicationType.NEW_PRIMARY_SCHOOL ||
          applicationType === ApplicationType.CONTINUING_ENROLLMENT
        )
      },
    }),
    buildOverviewField({
      id: 'overview.currentNursery',
      title: primarySchoolMessages.currentNursery.subSectionTitle,
      backId: editable ? 'currentNursery' : undefined,
      loadItems: currentNurseryItems,
      condition: (answers) => {
        const { applicationType } = getApplicationAnswers(answers)

        return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
      },
    }),
    buildOverviewField({
      id: 'overview.school',
      title: overviewMessages.schoolTitle,
      backId: (answers) => {
        const { applyForPreferredSchool } = getApplicationAnswers(answers)

        return editable
          ? applyForPreferredSchool === YES
            ? 'school'
            : 'newSchool'
          : undefined
      },
      items: schoolItems,
      condition: (answers) => {
        const { applicationType } = getApplicationAnswers(answers)

        return (
          applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL ||
          applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
        )
      },
    }),
    buildOverviewField({
      id: 'overview.reasonForApplication',
      backId: editable ? 'reasonForApplication' : undefined,
      loadItems: reasonForApplicationItems,
      condition: (answers, externalData) =>
        shouldShowReasonForApplicationPage(answers) &&
        !hasSpecialEducationSubType(answers, externalData),
    }),
    buildOverviewField({
      id: 'overview.counsellingRegardingApplication',
      backId: editable ? 'counsellingRegardingApplication' : undefined,
      loadItems: counsellingRegardingApplicationItems,
      condition: (answers, externalData) =>
        shouldShowReasonForApplicationPage(answers) &&
        hasSpecialEducationSubType(answers, externalData),
    }),
    buildOverviewField({
      id: 'overview.siblings',
      title: primarySchoolMessages.siblings.title,
      backId: editable ? 'siblings' : undefined,
      tableData: siblingsTable,
      condition: (answers) => {
        const { reasonForApplication } = getApplicationAnswers(answers)

        return (
          reasonForApplication ===
          ReasonForApplicationOptions.SIBLINGS_IN_SAME_SCHOOL
        )
      },
    }),
    buildOverviewField({
      id: 'overview.languages',
      backId: editable ? 'languages' : undefined,
      loadItems: languagesItems,
    }),
    buildOverviewField({
      id: 'overview.healthProtection',
      backId: editable ? 'healthProtection' : undefined,
      loadItems: healthProtectionItems,
    }),
    buildOverviewField({
      id: 'overview.support',
      backId: editable ? 'support' : undefined,
      items: supportItems,
      condition: (answers, externalData) =>
        !hasSpecialEducationSubType(answers, externalData),
    }),
    buildOverviewField({
      id: 'overview.specialEducationSupport',
      backId: editable ? 'specialEducationSupport' : undefined,
      loadItems: specialEducationSupportItems,
      condition: (answers, externalData) =>
        hasSpecialEducationSubType(answers, externalData),
    }),
    buildOverviewField({
      id: 'overview.payer',
      title: differentNeedsMessages.payer.subSectionTitle,
      backId: editable ? 'payer' : undefined,
      items: payerItems,
      condition: (answers, externalData) =>
        shouldShowPage(
          answers,
          externalData,
          ApplicationFeatureKey.PAYMENT_INFO,
        ),
    }),
    buildOverviewField({
      id: 'overview.attachments',
      title: differentNeedsMessages.attachments.subSectionTitle,
      attachments: attachmentItems,
      hideIfEmpty: true,
    }),
  ]
}
