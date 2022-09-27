import {
  aliasQuery,
  getFakeUser,
  getDiscountData,
  getEnvironmentBaseUrl,
} from '../../../support/utils'
import { FixtureUser, BaseAuthority } from '../../../lib/types'

import fakeUsers from '../../../fixtures/air-discount-scheme/users.json'

describe.skip('Air discount scheme', () => {
  const testEnvironment = Cypress.env('testEnvironment')

  const fakeUser: FixtureUser = getFakeUser(fakeUsers, 'gervimaður afríka')

  beforeEach(() => {
    // FIXME: https://github.com/island-is/island.is/issues/7906
    if (testEnvironment !== 'local') {
      const baseUrl = getEnvironmentBaseUrl(BaseAuthority.ads)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Cypress.config('baseUrl', baseUrl)
    }

    const baseUrl = Cypress.config('baseUrl')

    cy.idsLogin({
      phoneNumber: fakeUser.phoneNumber,
      baseUrl: baseUrl,
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

  it(`should have ${fakeUser.name} in the api response`, () => {
    cy.visit('/min-rettindi')
    cy.wait('@DiscountsQuery', { timeout: 20000 }).then((data) => {
      const { user } = getDiscountData(fakeUser, data.response)
      expect(
        user.user.name,
        'Fake user should exist in the discount codes response object',
      ).to.eq(fakeUser.name)
    })
  })

  it.skip(`should have ${fakeUser.name} child in the api response`, () => {
    cy.log(`Skip test until ${fakeUser.name} gets is daughter back`)
    cy.visit('/min-rettindi')
    cy.wait('@DiscountsQuery', { timeout: 20000 }).then((data) => {
      const { discounts } = getDiscountData(fakeUser, data.response)
      cy.log('discounts', discounts)
      // expect(
      //   discounts.map((e) => e.user.name),
      //   'Fake user and their children should exist in the discount codes response object',
      // ).to.deep.equal(family.map((e) => e.name))
    })
  })

  it(`should have user ${fakeUser.name} with valid discount code`, () => {
    cy.visit('/min-rettindi')
    cy.wait('@DiscountsQuery', { timeout: 20000 }).then((data) => {
      const { user } = getDiscountData(fakeUser, data.response)
      cy.findByRole('region', { name: 'Mín réttindi' })
        .should('exist')
        .within(() => {
          cy.findByText(fakeUser.name).should('exist')
          cy.findByText(user.discountCode).should('exist')
          cy.get('button').click()
        })
      cy.findByRole('alert').should('exist')
    })
  })
})
