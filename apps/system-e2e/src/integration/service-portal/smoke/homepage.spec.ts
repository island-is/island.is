import { getFakeUser } from '../../../support/utils'
import fakeUsers from '../../../fixtures/service-portal/users.json'
import { Timeout } from '../../../lib/types'

describe('Home page', () => {
  const fakeUser = getFakeUser(fakeUsers, 'María Sól Þí Torp')
  beforeEach(() => {
    cy.log('the fake user:', fakeUser)
    cy.idsLogin({ phoneNumber: fakeUser.phoneNumber, urlPath: '/minarsidur' })
    cy.visit('/minarsidur')
    // Workaround for late-loaded service portal
    cy.wait(Timeout.short)
  })

  it('should have clickable navigation bar', () => {
    cy.get('a[href^="/minarsidur/"]:has(svg):visible')
      .should('have.length.gt', 2)
      .each((el) => {
        cy.log('Element:', el)
        cy.wrap(el).click()
        cy.location('pathname').should('eq', el.attr('href'))
      })
  })

  it(`should have user ${fakeUser.name} logged in`, () => {
    cy.visit('/minarsidur/')
    cy.contains(fakeUser.name)
  })
})
