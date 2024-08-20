import { literal, Op, WhereOptions } from 'sequelize'

import {
  CaseState,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

const lifetime = literal('current_date - 90')

export const archiveFilter: WhereOptions = {
  [Op.and]: [
    { isArchived: false },
    {
      [Op.or]: [
        {
          [Op.and]: [
            { type: [...restrictionCases, ...investigationCases] },
            { state: CaseState.DELETED },
          ],
        },
        {
          [Op.and]: [
            { type: [...restrictionCases, ...investigationCases] },
            {
              state: [
                CaseState.NEW,
                CaseState.DRAFT,
                CaseState.SUBMITTED,
                CaseState.RECEIVED,
              ],
            },
            { created: { [Op.lt]: lifetime } },
          ],
        },
        {
          [Op.and]: [
            { type: restrictionCases },
            { state: [CaseState.REJECTED, CaseState.DISMISSED] },
            { ruling_date: { [Op.lt]: lifetime } },
          ],
        },
        {
          [Op.and]: [
            { type: restrictionCases },
            { state: CaseState.ACCEPTED },
            { valid_to_date: { [Op.lt]: lifetime } },
          ],
        },
        {
          [Op.and]: [
            { type: investigationCases },
            {
              state: [
                CaseState.ACCEPTED,
                CaseState.REJECTED,
                CaseState.DISMISSED,
              ],
            },
            { ruling_date: { [Op.lt]: lifetime } },
          ],
        },
      ],
    },
  ],
}
