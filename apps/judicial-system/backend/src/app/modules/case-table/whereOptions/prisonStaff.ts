import { fn, Op } from 'sequelize'

import { prisonStaffRequestCasesAccessWhereOptions } from './access'

// Prison staff request cases

export const prisonStaffRequestCasesActiveWhereOptions = () => ({
  where: {
    [Op.and]: [
      prisonStaffRequestCasesAccessWhereOptions,
      { valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] } },
    ],
  },
})

export const prisonStaffRequestCasesDoneWhereOptions = () => ({
  where: {
    [Op.and]: [
      prisonStaffRequestCasesAccessWhereOptions,
      { valid_to_date: { [Op.lt]: fn('NOW') } },
    ],
  },
})
