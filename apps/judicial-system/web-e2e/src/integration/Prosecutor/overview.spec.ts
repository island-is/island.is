describe('/krafa/stadfesta/:id', () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.visit('/krafa/stadfesta/test_id_stadfesta')
  })

  it('should have an overview of the current case', () => {
    cy.getByTestid('infoCard').contains(
      'Batman Robinsson, kt. 000000-0000, Batcave 1337',
    )
    cy.getByTestid('infoCardDataContainer1').contains('Héraðsdómur Reykjavíkur')
    cy.getByTestid('infoCardDataContainer2').contains(
      'Lögreglan á Höfuðborgarsvæðinu',
    )
    cy.getByTestid('infoCardDataContainer3').contains(
      'Miðvikud. 16. september 2020 eftir kl. 19:50',
    )
    cy.getByTestid('infoCardDataContainer4').contains('Áki Ákærandi')
    cy.getByTestid('infoCardDataContainer5').contains(
      'Miðvikud. 16. september 2020 kl. 19:50',
    )
    cy.getByTestid('demands').contains(
      'Þess er krafist að Batman Robinsson, kt. 000000-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til miðvikudagsins 16. september 2020, kl. 19:50, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  it('should have a button that links to a pdf of the case', () => {
    cy.contains('button', 'Opna PDF kröfu')
  })

  it.skip('should navigate to /krofur on successful confirmation', () => {
    cy.getByTestid('continueButton').click()
    cy.getByTestid('modalSecondaryButton').click()
    cy.url().should('contain', '/krofur')

    /**
     * This is practically considered bad(ish) practice since we're not testing
     * the overview in isolation anymore. Leaving this here until a better
     * way presents itself.
     */
    cy.getByTestid('tdTag').should('contain', 'Krafa móttekin')
  })
})
