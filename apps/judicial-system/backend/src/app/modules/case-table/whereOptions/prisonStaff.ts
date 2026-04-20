import { fn, Op } from 'sequelize'

import { CaseWhereOptions } from '../caseTable.types'
import { prisonStaffRequestCasesAccessWhereOptions } from './access'

// Prison staff request cases

export const prisonStaffRequestCasesActiveWhereOptions =
  (): CaseWhereOptions => ({
    where: {
      [Op.and]: [
        prisonStaffRequestCasesAccessWhereOptions,
        { valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] } },
      ],
    },
  })

export const prisonStaffRequestCasesDoneWhereOptions =
  (): CaseWhereOptions => ({
    where: {
      [Op.and]: [
        prisonStaffRequestCasesAccessWhereOptions,
        { valid_to_date: { [Op.lt]: fn('NOW') } },
      ],
    },
  })
