import { fn, Op } from 'sequelize'

import { prisonStaffRequestCasesAccessWhereOptions } from './access'

// Prison staff request cases

export const prisonStaffRequestCasesActiveWhereOptions = () => ({
  [Op.and]: [
    prisonStaffRequestCasesAccessWhereOptions,
    { valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] } },
  ],
})

export const prisonStaffRequestCasesDoneWhereOptions = () => ({
  [Op.and]: [
    prisonStaffRequestCasesAccessWhereOptions,
    { valid_to_date: { [Op.lt]: fn('NOW') } },
  ],
})
