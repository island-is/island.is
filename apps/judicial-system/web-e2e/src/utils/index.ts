import { Case } from '@island.is/judicial-system/types'
import { CyHttpMessages } from 'cypress/types/net-stubbing'

export const intercept = (res: Case) => {
  cy.intercept('POST', '**/api/graphql', (req) => {
    if (hasOperationName(req, 'CaseQuery')) {
      req.reply({
        data: {
          case: res,
        },
      })
    }
  })
}

export const hasOperationName = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  const { body } = req
  return (
    body.hasOwnProperty('operationName') && body.operationName === operationName
  )
}

// Alias query if operationName matches
export const aliasQuery = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`
  }
}

// Alias mutation if operationName matches
export const aliasMutation = (
  req: CyHttpMessages.IncomingHttpRequest,
  operationName: string,
) => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`
  }
}
