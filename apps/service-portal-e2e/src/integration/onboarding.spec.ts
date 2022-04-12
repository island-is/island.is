describe('service-portal', () => {
  it('should get onboarding modal and close without entering info', () => {
    cy.visit('/minarsidur')

    cy.get('button[aria-label="Loka glugga"]').click()
    cy.contains('Engar upplýsingar skráðar')
    cy.get('button').contains('Vil ekki skrá').click()
  })

  it('should get onboarding modal enter email and close on warning', () => {
    cy.visit('/minarsidur')

    cy.get('#user-onboarding-modal #email')
      .should('be.visible')
      .click()
      .type('test@test.is')
    cy.get('#user-onboarding-modal button').contains('Vista netfang').click()
    cy.get('#user-onboarding-modal #code').click().type('012345')
    cy.get('#user-onboarding-modal button').contains('Staðfesta').click()
    cy.get('#user-onboarding-modal #code').should('not.exist')
    cy.get(
      '#user-onboarding-modal #email-container svg[data-testid="icon-checkmark"]',
    ).should('exist')
    cy.get('button[aria-label="Loka glugga"]').click()

    cy.get('button').contains('Vil ekki skrá').click()
    cy.get('#user-onboarding-modal').should('not.be.visible')
  })

  it('should get onboarding modal enter tel and email and close without warning', () => {
    cy.visit('/minarsidur')

    // email
    cy.get('#user-onboarding-modal #email')
      .should('be.visible')
      .click()
      .type('test@test.is')
    cy.get('#user-onboarding-modal button').contains('Vista netfang').click()
    cy.get('#user-onboarding-modal #code').click().type('012345')
    cy.get('#user-onboarding-modal button').contains('Staðfesta').click()
    cy.get('#user-onboarding-modal #code').should('not.exist')
    cy.get(
      '#user-onboarding-modal #email-container svg[data-testid="icon-checkmark"]',
    ).should('exist')

    // phone nr
    cy.get('#user-onboarding-modal #tel').click().type('4265500')
    cy.get('#user-onboarding-modal button').contains('Vista símanúmer').click()
    cy.get('#user-onboarding-modal #code').click().type('012345')
    cy.get('#user-onboarding-modal button').contains('Staðfesta').click()
    cy.get('#user-onboarding-modal #code').should('not.exist')
    cy.get(
      '#user-onboarding-modal #tel-container svg[data-testid="icon-checkmark"]',
    ).should('exist')

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200)

    cy.get('button').contains('Halda áfram').click()
    cy.get('#user-onboarding-modal').should('not.be.visible')
  })
})
