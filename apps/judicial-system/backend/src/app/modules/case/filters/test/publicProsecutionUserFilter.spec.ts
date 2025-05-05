import { uuid } from 'uuidv4'

import {
  CaseState,
  completedCaseStates,
  indictmentCases,
  InstitutionType,
  investigationCases,
  publicProsecutionOfficeRoles,
  restrictionCases,
  User,
} from '@island.is/judicial-system/types'

import { Case } from '../../models/case.model'
import { verifyNoAccess } from './verify'

describe.each(publicProsecutionOfficeRoles)(
  'public prosecutor user %s',
  (role) => {
    const user = {
      role,
      institution: {
        id: uuid(),
        type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
      },
    } as User

    describe.each([...restrictionCases, ...investigationCases])(
      'inaccessible case type %s',
      (type) => {
        const theCase = {
          type,
        } as Case

        verifyNoAccess(theCase, user)
      },
    )

    describe.each(indictmentCases)('accessible case type %s', (type) => {
      const accessibleCaseStates = completedCaseStates

      describe.each(
        Object.values(CaseState).filter(
          (state) => !accessibleCaseStates.includes(state),
        ),
      )('inaccessible case state %s', (state) => {
        const theCase = {
          type,
          state,
        } as Case

        verifyNoAccess(theCase, user)
      })
    })
  },
)
