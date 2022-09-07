import { getFakeUser } from '../../../support/utils'
import fakeUsers from '../../../fixtures/service-portal/users.json'

describe('Home page', () => {
  const fakeUser = getFakeUser(fakeUsers, 'María Sól Þí Torp')
  beforeEach(() => {
    cy.log('the fake user:', fakeUser)
    cy.idsLogin({ phoneNumber: fakeUser.phoneNumber })
    cy.visit('/minarsidur')
  })

  it.only('should have clickable navigation bar', () => {
    cy.get('svg[data-testid^="icon-"]').each((el) => {
      cy.wrap(el)
        .parentsUntil('a')
        .then((a) => {
          cy.wrap(a).parent().click()
          cy.location('pathname').should('eq', a.attr('href'))
        })
    })
  })

  it(`should have user ${fakeUser.name} logged in`, () => {
    cy.visit('/minarsidur/')
    cy.contains(fakeUser.name)
  })

  it('should have Pósthólf', () => {
    cy.visit('/minarsidur/')
    cy.contains('Pósthólf')
  })
})
