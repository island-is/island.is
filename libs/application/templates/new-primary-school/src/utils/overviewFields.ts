import { buildOverviewField, NO, YES } from '@island.is/application/core'
import { newPrimarySchoolMessages } from '../lib/messages'
import { ApplicationType, ReasonForApplicationOptions } from './constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from './newPrimarySchoolUtils'
import {
  childItems,
  currentNurseryItems,
  currentSchoolItems,
  guardiansItems,
  healthProtectionItems,
  languagesItems,
  reasonForApplicationItems,
  relativesTable,
  schoolItems,
  siblingsTable,
  supportItems,
} from './overviewItems'

const MAX_GUARDIANS = 2

const buildGuardianOverviewFields = (editable?: boolean) =>
  [...Array(MAX_GUARDIANS)].map((_key, index) => {
    return buildOverviewField({
      id: `overview.guardians.${index}`,
      title: {
        ...newPrimarySchoolMessages.overview.guardians,
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
      title: newPrimarySchoolMessages.overview.child,
      backId: editable ? 'childInfo' : undefined,
      loadItems: childItems,
    }),
    ...buildGuardianOverviewFields(editable),
    buildOverviewField({
      id: 'overview.relatives',
      title:
        newPrimarySchoolMessages.childrenNGuardians.relativesSubSectionTitle,
      backId: editable ? 'relatives' : undefined,
      loadTableData: relativesTable,
    }),
    buildOverviewField({
      id: 'overview.currentSchool',
      title:
        newPrimarySchoolMessages.primarySchool.currentSchoolSubSectionTitle,
      backId: (answers, externalData) => {
        const { primaryOrgId } = getApplicationExternalData(externalData)

        // If the primaryOrgId doesn't exists it means Frigg doesn't have the data
        // and applicant should be able to edit if editable
        return primaryOrgId ? undefined : editable ? 'currentSchool' : undefined
      },
      items: currentSchoolItems,
      condition: (answers) => {
        const { applicationType } = getApplicationAnswers(answers)

        return applicationType === ApplicationType.NEW_PRIMARY_SCHOOL
      },
    }),
    buildOverviewField({
      id: 'overview.currentNursery',
      title:
        newPrimarySchoolMessages.primarySchool.currentNurserySubSectionTitle,
      backId: editable ? 'currentNursery' : undefined,
      loadItems: currentNurseryItems,
      condition: (answers) => {
        const { applicationType } = getApplicationAnswers(answers)

        return applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL
      },
    }),
    buildOverviewField({
      id: 'overview.school',
      title: newPrimarySchoolMessages.overview.schoolTitle,
      backId: (answers) => {
        const { applyForPreferredSchool } = getApplicationAnswers(answers)

        return editable
          ? applyForPreferredSchool === YES
            ? 'school'
            : 'newSchool'
          : undefined
      },
      items: schoolItems,
    }),
    buildOverviewField({
      id: 'overview.reasonForApplication',
      backId: editable ? 'reasonForApplication' : undefined,
      loadItems: reasonForApplicationItems,
      condition: (answers) => {
        const { applicationType, applyForPreferredSchool } =
          getApplicationAnswers(answers)

        return (
          applicationType === ApplicationType.NEW_PRIMARY_SCHOOL ||
          (applicationType === ApplicationType.ENROLLMENT_IN_PRIMARY_SCHOOL &&
            applyForPreferredSchool === NO)
        )
      },
    }),
    buildOverviewField({
      id: 'overview.siblings',
      title: newPrimarySchoolMessages.primarySchool.siblingsTitle,
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
    }),
  ]
}
