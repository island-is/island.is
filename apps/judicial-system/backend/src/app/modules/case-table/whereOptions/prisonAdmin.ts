import { fn, Op } from 'sequelize'

import { IndictmentCaseReviewDecision } from '@island.is/judicial-system/types'

import {
  prisonAdminIndictmentsAccessWhereOptions,
  prisonAdminRequestCasesAccessWhereOptions,
} from './access'

// Prison admin request cases

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

export const prisonAdminIndictmentsSentToPrisonAdminWhereOptions = () =>
  prisonAdminIndictmentsAccessWhereOptions

export const prisonAdminIndictmentsRegisteredRulingWhereOptions = () =>
  prisonAdminIndictmentsAccessWhereOptions

// Prison admin indictments defendant-level filters

export const prisonAdminIndictmentsSentToPrisonAdminDefendantWhereOptions = {
  isSentToPrisonAdmin: true,
  indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
  isRegisteredInPrisonSystem: { [Op.not]: true },
}

export const prisonAdminIndictmentsRegisteredRulingDefendantWhereOptions = {
  isSentToPrisonAdmin: true,
  indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
  isRegisteredInPrisonSystem: true,
}
