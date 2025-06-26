import { fn, Op, Sequelize } from 'sequelize'

import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  IndictmentCaseReviewDecision,
  indictmentCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

// Prison admin restriction cases

const prisonAdminRequestCasesAccessWhereOptions = {
  is_archived: false,
  type: [...restrictionCases, CaseType.PAROLE_REVOCATION],
  state: CaseState.ACCEPTED,
}

export const prisonAdminRequestCasesActiveWhereOptions = () => ({
  [Op.and]: [
    prisonAdminRequestCasesAccessWhereOptions,
    { valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] } },
  ],
})

export const prisonAdminRequestCasesDoneWhereOptions = () => ({
  [Op.and]: [
    prisonAdminRequestCasesAccessWhereOptions,
    { valid_to_date: { [Op.lt]: fn('NOW') } },
  ],
})

// Prison admin indictments

const prisonAdminIndictmentsAccessWhereOptions = {
  is_archived: false,
  type: indictmentCases,
  state: CaseState.COMPLETED,
  indictment_ruling_decision: [
    CaseIndictmentRulingDecision.RULING,
    CaseIndictmentRulingDecision.FINE,
  ],
  indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
  id: {
    [Op.in]: Sequelize.literal(`
      (SELECT case_id
        FROM defendant
        WHERE is_sent_to_prison_admin = true)
    `),
  },
}

export const prisonAdminIndictmentsSentToPrisonAdminWhereOptions = () => ({
  [Op.and]: [
    prisonAdminIndictmentsAccessWhereOptions,
    { is_registered_in_prison_system: { [Op.not]: true } },
  ],
})

export const prisonAdminIndictmentsRegisteredRulingWhereOptions = () => ({
  [Op.and]: [
    prisonAdminIndictmentsAccessWhereOptions,
    { is_registered_in_prison_system: true },
  ],
})

export const prisonAdminCasesAccessWhereOptions = () => ({
  [Op.or]: [
    prisonAdminRequestCasesAccessWhereOptions,
    prisonAdminIndictmentsAccessWhereOptions,
  ],
})
