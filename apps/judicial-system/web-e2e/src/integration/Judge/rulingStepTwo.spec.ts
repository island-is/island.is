describe('/domur/urskurdarord/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
  })
  it('should format conclusion for a rejected case', () => {
    cy.visit('/domur/urskurdarord/conclusion_rejected')
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Jon Harring, kt. string, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  it('should format conclusion for an accepted case without isolation', () => {
    cy.visit('/domur/urskurdarord/conclusion_accepted_without_isolation')
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for an accepted case with isolation', () => {
    cy.visit('/domur/urskurdarord/conclusion_accepted_with_isolation')
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.',
    )
  })

  it('should format conclusion for an accepted case with isolation and the isolation ends before the custody does', () => {
    cy.visit(
      '/domur/urskurdarord/conclusion_accepted_with_isolation_isolation_ends_before_custody',
    )
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun ekki lengur en til sunnudagsins 20. desember 2020, kl. 15:39.',
    )
  })

  it('should format conclusion for a case where custody is rejected, but alternative travel ban accepted', () => {
    cy.visit(
      '/domur/urskurdarord/conclusion_rejected_with_alternative_travel_ban',
    )
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta farbanni, þó ekki lengur en til föstudagsins 29. janúar 2021, kl. 13:03.',
    )
  })

  it('should format conclusion for rejected extension', () => {
    cy.visit('/domur/urskurdarord/conclusion_rejected_extension')
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti áframhaldandi gæsluvarðhaldi er hafnað.',
    )
  })

  it('should format conclusion for rejected extension when previous ruling was travel ban', () => {
    cy.visit(
      '/domur/urskurdarord/conclusion_rejected_extension_previous_decision_travel_ban',
    )
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  it('should format conclusion for accepted extension', () => {
    cy.visit('/domur/urskurdarord/conclusion_accepted_extension')
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta áframhaldandi gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for accepted extension when previous ruling was travel ban', () => {
    cy.visit(
      '/domur/urskurdarord/conclusion_accepted_extension_previous_decision_travel_ban',
    )
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for rejected extension when alternative travel ban accepted', () => {
    cy.visit(
      '/domur/urskurdarord/conclusion_rejected_extension_accepted_alternative_travel_ban',
    )
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for rejected extension when alternative travel ban accepted and previous ruling was travel ban', () => {
    cy.visit(
      '/domur/urskurdarord/conclusion_rejected_extension_accepted_alternative_travel_ban_previous_decision_travel_ban',
    )
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta áframhaldandi farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should format conclusion for a rejected travel ban', () => {
    cy.visit('/domur/urskurdarord/conclusion_rejected_travel_ban')
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti farbanni er hafnað.',
    )
  })

  it('should format conclusion for an accepted travel ban', () => {
    cy.visit('/domur/urskurdarord/conclusion_accepted_travel_ban')
    cy.getByTestid('conclusion').should(
      'have.value',
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  it('should require a accused and prosecutor appeal decisions to be made', () => {
    cy.visit('/domur/urskurdarord/test_id_stadfest')

    cy.getByTestid('continueButton').should('be.disabled')
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').should('not.be.disabled')
  })

  it('should navigate to the next step when all input data is valid and the continue button is clicked', () => {
    cy.visit('/domur/urskurdarord/test_id_stadfest')
    cy.get('#prosecutor-appeal').check()
    cy.get('#accused-appeal').check()
    cy.getByTestid('courtEndTime').type('11:00')
    cy.getByTestid('continueButton').click()
    cy.url().should('include', '/domur/stadfesta/test_id_stadfest')
  })
})
