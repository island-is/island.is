// import { idsLogin } from '../../support/commands'
import {
  aliasQuery,
  getFakeUser,
  getFamily,
  getBaseUrl,
  getDiscountData,
} from '../../support/utils'

describe('Home page', () => {
  const baseUrl = getBaseUrl(Cypress.config())

  const fakeUser = getFakeUser(Cypress.env('fakeUsers'), 'gervimaður afríka')
  const family = getFamily(fakeUser)

  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUser.phoneNumber,
      urlPath: '/min-rettindi',
    })
    cy.intercept('POST', `${baseUrl}/api/graphql`, (req) => {
      aliasQuery(req, 'DiscountsQuery')
    })
  })

  it(`should return discounts response array`, () => {
    cy.visit('/min-rettindi')
    cy.wait('@DiscountsQuery', { timeout: 20000 }).then((data) => {
      assert.isNotNull(
        data.response?.body.data.discounts,
        'Discounts response exists',
      )
    })
  })

  it(`should have user ${fakeUser.name} with valid discount code`, () => {
    cy.visit('/min-rettindi')
    cy.wait('@DiscountsQuery', { timeout: 20000 }).then((data) => {
      const { discountUser, discounts } = getDiscountData(
        fakeUser,
        data.response,
      )
      expect(
        discounts.map((e) => e.user.name),
        'Fake usernames and their children should exist in the discount codes response object',
      ).to.deep.equal(family.map((e) => e.name))

      cy.findByRole('region', { name: 'Mín réttindi' })
        .should('exist')
        .within(() => {
          cy.findByText(fakeUser.name).should('exist')
          cy.findByText(discountUser.discountCode).should('exist')
          cy.get('button').click()
        })
      cy.findByRole('alert').should('exist')
    })
  })
})
