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
  where: {
    [Op.and]: [
      prisonAdminRequestCasesAccessWhereOptions,
      { valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] } },
    ],
  },
})

export const prisonAdminRequestCasesDoneWhereOptions = () => ({
  where: {
    [Op.and]: [
      prisonAdminRequestCasesAccessWhereOptions,
      { valid_to_date: { [Op.lt]: fn('NOW') } },
    ],
  },
})

// Prison admin indictments

export const prisonAdminIndictmentsSentToPrisonAdminWhereOptions = () => ({
  where: {
    [Op.and]: [
      prisonAdminIndictmentsAccessWhereOptions,
      buildHasDefendantSentToPrisonAdminNotRegisteredCondition(),
    ],
  },
})

export const prisonAdminIndictmentsRegisteredRulingWhereOptions = () => ({
  where: {
    [Op.and]: [
      prisonAdminIndictmentsAccessWhereOptions,
      buildHasDefendantSentToPrisonAdminRegisteredCondition(),
    ],
  },
})
