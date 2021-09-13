// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { CyHttpMessages } from 'cypress/types/net-stubbing'

const getFixtureFor = (graphqlRequest: CyHttpMessages.IncomingHttpRequest) => {
  if (graphqlRequest.body.hasOwnProperty('query')) {
    if (graphqlRequest.body.query.includes('CasesQuery')) {
      return {
        fixture: 'cases',
      }
    } else if (
      graphqlRequest.body.hasOwnProperty('variables') &&
      graphqlRequest.body.query.includes('CaseQuery')
    ) {
      if (graphqlRequest.body.variables.input.id === 'test_id') {
        return {
          fixture: 'case',
        }
      } else if (
        graphqlRequest.body.variables.input.id === 'test_id_stadfesta'
      ) {
        return {
          fixture: 'confirmCase',
        }
      } else if (
        graphqlRequest.body.variables.input.id === 'test_id_stadfest'
      ) {
        return {
          fixture: 'confirmedCaseJudge',
        }
      } else if (
        graphqlRequest.body.variables.input.id === 'test_id_stadfesting'
      ) {
        return {
          fixture: 'confirmingCaseJudge',
        }
      } else if (
        graphqlRequest.body.variables.input.id === 'conclusion_rejected'
      ) {
        return {
          fixture: 'conclusion/rejected',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_accepted_without_isolation'
      ) {
        return {
          fixture: 'conclusion/acceptedWithoutIsolation',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_accepted_with_isolation'
      ) {
        return {
          fixture: 'conclusion/acceptedWithIsolation',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_accepted_with_isolation_isolation_ends_before_custody'
      ) {
        return {
          fixture: 'conclusion/acceptedWithIsolationIsolationEndsBeforeCustody',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_rejected_with_alternative_travel_ban'
      ) {
        return {
          fixture: 'conclusion/rejectedWithAlternativeTravelBan',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_rejected_extension'
      ) {
        return {
          fixture: 'conclusion/rejectedExtension',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_rejected_extension_previous_decision_travel_ban'
      ) {
        return {
          fixture: 'conclusion/rejectedExtensionPreviousDecisionTravelBan',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_accepted_extension'
      ) {
        return {
          fixture: 'conclusion/acceptedExtension',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_accepted_extension_previous_decision_travel_ban'
      ) {
        return {
          fixture: 'conclusion/acceptedExtensionPreviousDecisionTravelBan',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_rejected_extension_accepted_alternative_travel_ban'
      ) {
        return {
          fixture: 'conclusion/rejectedExtensionAcceptedAlternativeTravelBan',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_rejected_extension_accepted_alternative_travel_ban_previous_decision_travel_ban'
      ) {
        return {
          fixture:
            'conclusion/rejectedExtensionAcceptedAlternativeTravelBanPreviousDecisionTravelBan',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_rejected_travel_ban'
      ) {
        return {
          fixture: 'conclusion/rejectedTravelBan',
        }
      } else if (
        graphqlRequest.body.variables.input.id ===
        'conclusion_accepted_travel_ban'
      ) {
        return {
          fixture: 'conclusion/acceptedTravelBan',
        }
      } else if (
        graphqlRequest.body.variables.input.id === 'test_id_without_decision'
      ) {
        return {
          fixture: 'withoutDecision',
        }
      }
    } else if (graphqlRequest.body.query.includes('TransitionCaseMutation')) {
      return {
        fixture: 'transitionCaseMutationResponse',
      }
    } else if (graphqlRequest.body.query.includes('SendNotificationMutation')) {
      return {
        fixture: 'sendNotificationMutationResponse',
      }
    } else if (graphqlRequest.body.query.includes('CurrentUserQuery')) {
      if (graphqlRequest.headers.referer.includes('/domur')) {
        return { fixture: 'judgeUser' }
      } else {
        return { fixture: 'prosecutorUser' }
      }
    } else if (graphqlRequest.body.query.includes('UsersQuery')) {
      if (graphqlRequest.headers.referer.includes('/domur')) {
        return {
          fixture: 'judgeUsers',
        }
      } else {
        return {
          fixture: 'prosecutorUsers',
        }
      }
    } else if (graphqlRequest.body.query.includes('UpdateCaseMutation')) {
      graphqlRequest.alias = 'gqlUpdateCaseMutatation'

      return { fixture: 'updateCaseMutationResponse' }
    } else if (graphqlRequest.body.query.includes('RequestSignatureMutation')) {
      graphqlRequest.alias = 'gqlRequsestSignatureMutation'

      return { fixture: 'requestSignatureMutationResponse' }
    } else if (
      graphqlRequest.body.query.includes('SignatureConfirmationQuery')
    ) {
      graphqlRequest.alias = 'gqlSignatureConfirmationResponse'

      return { fixture: 'signatureConfirmationResponse' }
    } else if (graphqlRequest.body.query.includes('InstitutionsQuery')) {
      graphqlRequest.alias = 'gqlInstitutionsQuery'

      return { fixture: 'institutionsQueryResponse' }
    }
  }
}

Cypress.Commands.add('stubAPIResponses', () => {
  cy.intercept('POST', '**/api/graphql', (req) => {
    req.reply(getFixtureFor(req))
  })
})

Cypress.Commands.add('getByTestid', (selector) => {
  return cy.get(`[data-testid=${selector}]`)
})

// Credit: https://stackoverflow.com/a/65561176
Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0) //0,0 here are the x and y coordinates
})
