import { regex as uuidRegex } from 'uuidv4'
import { getFakeUser } from '../../support/utils'
import { FakeUser } from '../../lib/types'
import fakeUsers from '../../fixtures/service-portal/users.json'

const fakeUser: FakeUser = getFakeUser(
  fakeUsers as FakeUser[],
  'Gervimaður Afríka',
)

describe('P-sign', function () {
  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUser.phoneNumber,
      urlPath: '/umsoknir/p-merki',
    })
  })

  it('should be able to create application', () => {
    cy.visit('/umsoknir/p-merki')
    cy.bypassApplicationEntry('Afríka')

    // Select new application if there are already other applications open giving us a list
    // of open applications
    cy.get('button[text="Ny umsókn"]').then((button) => {
      console.log('BUTTON', button)
    })

    // First page load takes a long time
    cy.contains('Gagnaöflun', { timeout: 10000 })
    cy.pathUuid().should('match', uuidRegex.v4)

    // Data collection
    cy.get('input[name="approveExternalData"]').click()
    cy.get('button[type="submit"]').click()

    // Information
    cy.contains('sími')
    cy.get('input').type('blablabla')
  })
})
