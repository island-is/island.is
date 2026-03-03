import { fn, Op } from 'sequelize'

import {
  prisonAdminIndictmentsAccessWhereOptions,
  prisonAdminRequestCasesAccessWhereOptions,
} from './access'
import {
  buildHasDefendantSentToPrisonAdminNotRegisteredCondition,
  buildHasDefendantSentToPrisonAdminRegisteredCondition,
} from './conditions'

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

// Prison admin indictments

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
