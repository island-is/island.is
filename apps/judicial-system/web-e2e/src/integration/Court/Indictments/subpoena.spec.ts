import { CaseState, CaseType, UserRole } from '@island.is/judicial-system/types'
import { INDICTMENTS_SUBPOENA_ROUTE } from '@island.is/judicial-system/consts'

import {
  makeCourt,
  intercept,
  hasOperationName,
  Operation,
  makeJudge,
  mockCase,
} from '../../../utils'

describe(`${INDICTMENTS_SUBPOENA_ROUTE}/:id`, () => {
  beforeEach(() => {
    const caseData = mockCase(CaseType.MAJOR_ASSAULT)

    const caseDataAddition = {
      ...caseData,
      state: CaseState.RECEIVED,
      court: makeCourt(),
      courtDate: '2020-09-16T19:50:08.033Z',
    }

    cy.login(UserRole.JUDGE)
    cy.stubAPIResponses()
    intercept(caseDataAddition)
    cy.visit(`${INDICTMENTS_SUBPOENA_ROUTE}/test`)
  })

  it('should enable continue button when required fields are valid', () => {
    cy.intercept('POST', '**/api/graphql', (req) => {
      if (hasOperationName(req, Operation.UpdateCaseMutation)) {
        const { body } = req

        req.reply({
          data: {
            updateCase: {
              ...body.variables?.input,
              judge: makeJudge(),
              __typename: 'Case',
            },
          },
        })
      }
    })

    cy.getByTestid('continueButton').should('not.be.enabled')
    cy.get('#subpoenaTypeAbsenceSummons').click()
    cy.getByTestid('continueButton').should('be.enabled')
  })
})
