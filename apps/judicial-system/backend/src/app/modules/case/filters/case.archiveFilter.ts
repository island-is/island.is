import { literal, Op } from 'sequelize'

import {
  CaseState,
  completedCaseStates,
  indictmentCases,
  investigationCases,
  restrictionCases,
} from '@island.is/judicial-system/types'

const lifetime = literal('current_date - 90')
const indictmentLifetime = literal('current_date - 180')

export const archiveFilter = {
  [Op.or]: [
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
        { state: completedCaseStates },
        { ruling_date: { [Op.lt]: lifetime } },
      ],
    },
    {
      [Op.and]: [
        { type: indictmentCases },
        { state: completedCaseStates },
        { ruling_date: { [Op.lt]: indictmentLifetime } },
      ],
    },
  ],
}
