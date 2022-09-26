// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('getByTestid', (selector) => {
  return cy.get(`[data-testid=${selector}]`)
})

// Credit: https://stackoverflow.com/a/65561176
Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0) //0,0 here are the x and y coordinates
})
