import { MessageDescriptor, createIntl, createIntlCache } from '@formatjs/intl'
import { parentalLeaveFormMessages } from '@island.is/application/templates/parental-leave/messages'

//
// // Create the `intl` object
const cache = createIntlCache()
const intl = createIntl(
  {
    locale: 'is',
    onError: (err) => {
      console.error(err)
    },
  },
  cache,
)

const label = (l: MessageDescriptor) => intl.formatMessage(l)
describe('Parental leave', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers') || []
  const testEnvironment: TestEnvironment = Cypress.env('testEnvironment')
  const { authUrl }: Pick<TestConfig, 'authUrl'> = Cypress.env(testEnvironment)
  let employerEmail: string = 'not ready'

  before(() => {
    cy.task('getUserEmail').then((email) => {
      expect(email).to.be.a('string')
      employerEmail = email as string
    })
  })

  beforeEach(() => {
    cy.log('fakeUsers', fakeUsers)
    cy.log('authUrl', authUrl)
    cy.log('testEnvironment', testEnvironment)
    cy.idsLogin({
      phoneNumber: (
        fakeUsers.find((user) => user.name.endsWith('Afríka')) || {
          phoneNumber: '',
        }
      ).phoneNumber,
      url: '/umsoknir/faedingarorlof',
    })
  })

  it('should create an application', () => {
    cy.intercept(
      'POST',
      'http://localhost:4444/api/graphql?op=GetTranslations',
      {
        data: { getTranslations: {} },
      },
    )
    cy.visit('/umsoknir/faedingarorlof')

    cy.get('body').then((body) => {
      const newAppButton = body.find("[data-testid='create-new-application']")
      if (newAppButton.length > 0) {
        newAppButton.click()
      }
    })
    cy.findByRole('heading', {
      name: label(parentalLeaveFormMessages.shared.mockDataUse),
    })
    cy.findByRole('radio', {
      name: label(parentalLeaveFormMessages.shared.noOptionLabel),
    }).click()

    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='agree-to-data-providers']").click()
    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='child-0']").click()
    cy.get('[data-testid="select-child"]').click()
    cy.get("[data-testid='email']").click().type('{selectall}noreply@island.is')
    cy.get('[data-testid="phone"]').click().type('{selectall}5555555')
    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='other-parent']").click()
    cy.get('[data-testid="other-parent-name"]')
      .click()
      .type('{selectall}Gervimaður Afríka')
    cy.get('[data-testid="other-parent-kennitala"]')
      .click()
      .type('{selectall}0101303019')
    cy.get('[data-testid="proceed"]').click()

    cy.get('[data-testid="yes-option"]').click()
    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='bank-account-number']").type(
      '{selectall}051226054678',
    )
    cy.get("[data-testid='pension-fund']").focus().type('{downArrow}')
    cy.get('#react-select-payments\\.pensionFund-option-0').click()
    cy.get("[data-testid='use-union']").click()
    cy.get("[data-testid='payments-union']").focus().type('{downArrow}')
    cy.get('#react-select-payments\\.union-option-0').click()
    cy.get("[data-testid='use-private-pension-fund']").click()
    cy.get("[data-testid='private-pension-fund']").focus().type('{downArrow}')
    cy.get('#react-select-payments\\.privatePensionFund-option-0').click()
    cy.get("[data-testid='private-pension-fund-ratio']")
      .focus()
      .type('{downArrow}')
    cy.get(
      '#react-select-payments\\.privatePensionFundPercentage-option-0',
    ).click()
    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='use-personal-finance']").click()
    cy.get('[data-testid="proceed"]').click()

    cy.get("[data-testid='use-as-much-as-possible']").click()
    cy.get('[data-testid="proceed"]').click()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.personalAllowance.useFromSpouse),
    })
      .findByRole('radio', {
        name: label(parentalLeaveFormMessages.shared.noOptionLabel),
      })
      .click()
    cy.get('[data-testid="proceed"]').click()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.selfEmployed.title),
    })
      .findByRole('radio', {
        name: label(parentalLeaveFormMessages.shared.noOptionLabel),
      })
      .click()
    cy.get('[data-testid="proceed"]').click()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.employer.title),
    })
      .findByRole('textbox', {
        name: label(parentalLeaveFormMessages.employer.phoneNumber),
      })
      .type('6666666')

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.employer.title),
    })
      .findByRole('textbox', {
        name: label(parentalLeaveFormMessages.employer.email),
      })
      .type(employerEmail)
    cy.get('[data-testid="proceed"]').click()

    cy.findByRole('heading', {
      name: label(parentalLeaveFormMessages.shared.theseAreYourRights),
    })
    cy.get('[data-testid="proceed"]').click()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.shared.transferRightsTitle),
    })
      .findByRole('radio', {
        name: label(parentalLeaveFormMessages.shared.transferRightsNone),
      })
      .click()
    cy.get('[data-testid="proceed"]').click()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.shared.periodsImageTitle),
    })
    cy.get('[data-testid="proceed"]').click()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.firstPeriodStart.title),
    })
      .findByRole('radio', {
        name: label(
          parentalLeaveFormMessages.firstPeriodStart.dateOfBirthOption,
        ),
      })
      .click()
    cy.get('[data-testid="proceed"]').click()

    cy.findByRole('heading', {
      name: label(parentalLeaveFormMessages.duration.title),
    })
    cy.findByRole('radio', {
      name: label(parentalLeaveFormMessages.duration.monthsOption),
    }).click()
    cy.get('[data-testid="proceed"]').click()
  })
})
