import { getFakeUser } from '../../support/utils'
import fakeUsers from '../../fixtures/service-portal/users.json'

describe('Home page', () => {
  const fakeUser = getFakeUser(fakeUsers, 'María Sól Þí Torp')
  beforeEach(() => {
    cy.log('the fake user:', fakeUser)
    cy.idsLogin({ phoneNumber: fakeUser.phoneNumber })
  })

  it.skip('have clickable navigation bar', () => {
    cy.get('a:has(div[data-testid^="nav-"])').each((el) => {
      cy.wrap(el).click()
      cy.location('pathname').should('eq', el.attr('href'))
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
