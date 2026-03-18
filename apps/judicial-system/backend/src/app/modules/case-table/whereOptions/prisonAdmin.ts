import { fn, Op } from 'sequelize'

import { CaseWhereOptions } from '../caseTable.types'
import {
  prisonAdminIndictmentsAccessWhereOptions,
  prisonAdminRequestCasesAccessWhereOptions,
} from './access'

// Prison admin restriction cases

export const prisonAdminRequestCasesActiveWhereOptions =
  (): CaseWhereOptions => ({
    where: {
      [Op.and]: [
        prisonAdminRequestCasesAccessWhereOptions,
        { valid_to_date: { [Op.or]: [null, { [Op.gte]: fn('NOW') }] } },
      ],
    },
  })

export const prisonAdminRequestCasesDoneWhereOptions =
  (): CaseWhereOptions => ({
    where: {
      [Op.and]: [
        prisonAdminRequestCasesAccessWhereOptions,
        { valid_to_date: { [Op.lt]: fn('NOW') } },
      ],
    },
  })

// Prison admin indictments

export const prisonAdminIndictmentsSentToPrisonAdminWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          is_sent_to_prison_admin: true,
          indictment_review_decision: 'ACCEPT',
          is_registered_in_prison_system: { [Op.not]: true },
        },
      },
    },
    where: prisonAdminIndictmentsAccessWhereOptions,
  })

export const prisonAdminIndictmentsRegisteredRulingWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          is_sent_to_prison_admin: true,
          indictment_review_decision: 'ACCEPT',
          is_registered_in_prison_system: true,
        },
      },
    },
    where: prisonAdminIndictmentsAccessWhereOptions,
  })
