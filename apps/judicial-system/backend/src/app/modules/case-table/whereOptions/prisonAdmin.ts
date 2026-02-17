import { fn, Op } from 'sequelize'

import {
  buildHasDefendantSentToPrisonAdminNotRegisteredCondition,
  buildHasDefendantSentToPrisonAdminRegisteredCondition,
} from './conditions'
import {
  prisonAdminIndictmentsAccessWhereOptions,
  prisonAdminRequestCasesAccessWhereOptions,
} from './access'

// Prison admin restriction cases

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

// Prison admin indictments (per-defendant registration with case-level fallback)

export const prisonAdminIndictmentsSentToPrisonAdminWhereOptions = () => ({
  [Op.and]: [
    prisonAdminIndictmentsAccessWhereOptions,
    buildHasDefendantSentToPrisonAdminNotRegisteredCondition(),
  ],
})

export const prisonAdminIndictmentsRegisteredRulingWhereOptions = () => ({
  [Op.and]: [
    prisonAdminIndictmentsAccessWhereOptions,
    buildHasDefendantSentToPrisonAdminRegisteredCondition(),
  ],
})
