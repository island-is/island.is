import { CREATE_INDICTMENT_ROUTE } from '@island.is/judicial-system/consts'

describe('Prosecutor flow', () => {
  before(() => {
    cy.visit('http://localhost:4200/api/auth/login?nationalId=0000000009')
  })

  describe('Indictments', () => {
    describe('Happy path', () => {
      it('should be able to create a case', () => {
        cy.getByTestid('createCaseDropdown').click()
        cy.get(`a[href="${CREATE_INDICTMENT_ROUTE}"]`).click()
        cy.url().should('contain', CREATE_INDICTMENT_ROUTE)
      })
    })
  })
})
