import { MessageDescriptor, createIntl, createIntlCache } from '@formatjs/intl'
import {
  employerFormMessages,
  parentalLeaveFormMessages,
} from '@island.is/application/templates/parental-leave/messages'
import { coreMessages } from '@island.is/application/core'

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

function proceed() {
  cy.get('[data-testid="proceed"]').click()
}

describe('Parental leave', () => {
  const fakeUsers: FakeUser[] = Cypress.env('fakeUsers') || []
  const testEnvironment: TestEnvironment = Cypress.env('testEnvironment')
  const { authUrl }: Pick<TestConfig, 'authUrl'> = Cypress.env(testEnvironment)
  let employerEmail = 'not ready'

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

  const phaseEmployerApproval = () => {
    cy.findByRole('region', {
      name: label(employerFormMessages.employerNationalRegistryIdSection),
    })
      .findByRole('textbox')
      // eslint-disable-next-line local-rules/disallow-kennitalas
      .type('5402696029')
    proceed()

    cy.findByRole('button', {
      name: label(coreMessages.buttonApprove),
    }).click()
  }

  const primaryParentApplication = () => {
    cy.findByRole('heading', {
      name: label(parentalLeaveFormMessages.shared.mockDataUse),
    })
    cy.findByRole('radio', {
      name: label(parentalLeaveFormMessages.shared.noOptionLabel),
    }).click()

    proceed()

    cy.get("[data-testid='agree-to-data-providers']").click()
    proceed()

    cy.get("[data-testid='child-0']").click()
    cy.findByRole('button', {
      name: label(parentalLeaveFormMessages.selectChild.choose),
    }).click()

    cy.findByRole('textbox', {
      name: label(parentalLeaveFormMessages.applicant.email),
    })
      .click()
      .type('{selectall}noreply@island.is')

    cy.findByRole('textbox', {
      name: label(parentalLeaveFormMessages.applicant.phoneNumber),
    })
      .click()
      .type('{selectall}5555555')

    proceed()

    cy.findByRole('radio', {
      name: label(parentalLeaveFormMessages.shared.otherParentOption),
    }).click()

    cy.findByRole('textbox', {
      name: label(parentalLeaveFormMessages.shared.otherParentName),
    })
      .click()
      .type('{selectall}Gervimaður Ameríku')
    cy.findByRole('textbox', {
      name: label(parentalLeaveFormMessages.shared.otherParentID),
    })
      .click()
      // eslint-disable-next-line local-rules/disallow-kennitalas
      .type('{selectall}0101302989')
    proceed()

    cy.findByRole('radio', {
      name: label(parentalLeaveFormMessages.rightOfAccess.yesOption),
    }).click()
    proceed()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.shared.paymentInformationName),
    })

    cy.findByRole('textbox', {
      name: label(parentalLeaveFormMessages.shared.paymentInformationBank),
    })
      .click()
      .type('{selectall}051226054678')

    cy.findByRole('combobox', {
      name: `${label(parentalLeaveFormMessages.shared.pensionFund)} ${label(
        parentalLeaveFormMessages.shared.asyncSelectSearchableHint,
      )}`,
    })
      .focus()
      .type('{downArrow}')

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
    proceed()

    cy.get("[data-testid='use-personal-finance']").click()
    proceed()

    cy.get("[data-testid='use-as-much-as-possible']").click()
    proceed()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.personalAllowance.useFromSpouse),
    })
      .findByRole('radio', {
        name: label(parentalLeaveFormMessages.shared.noOptionLabel),
      })
      .click()
    proceed()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.selfEmployed.title),
    })
      .findByRole('radio', {
        name: label(parentalLeaveFormMessages.shared.noOptionLabel),
      })
      .click()
    proceed()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.employer.title),
    })
      .findByRole('textbox', {
        name: label(parentalLeaveFormMessages.employer.email),
      })
      .type(employerEmail)
    proceed()

    cy.findByRole('heading', {
      name: label(parentalLeaveFormMessages.shared.theseAreYourRights),
    })
    proceed()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.shared.transferRightsTitle),
    })
      .findByRole('radio', {
        name: label(parentalLeaveFormMessages.shared.transferRightsNone),
      })
      .click()
    proceed()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.shared.periodsImageTitle),
    })
    proceed()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.firstPeriodStart.title),
    })
      .findByRole('radio', {
        name: label(
          parentalLeaveFormMessages.firstPeriodStart.dateOfBirthOption,
        ),
      })
      .click()
    proceed()

    cy.findByRole('heading', {
      name: label(parentalLeaveFormMessages.duration.title),
    })
    cy.findByRole('radio', {
      name: label(parentalLeaveFormMessages.duration.monthsOption),
    }).click()
    proceed()

    cy.findByRole('region', {
      name: label(parentalLeaveFormMessages.duration.title),
    })
    cy.findByRole('button', {
      name: '6 months',
    }).click()
    proceed()

    cy.findByTestId('select-percentage-use').focus().type('50%{enter}')
    proceed()

    cy.findByRole('button', {
      name: label(parentalLeaveFormMessages.leavePlan.addAnother),
    })
    proceed()

    cy.findByRole('button', {
      name: label(parentalLeaveFormMessages.confirmation.title),
    }).click()
  }

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

    // phaseEmployerApproval()
    primaryParentApplication()

    // part 1 complete
    cy.task('getLastEmail', 6).then((email) => {
      // expect(email.text).to.be.a('string')
      expect(email.html).to.be.a('string')
      const employerUrl = email.html.match(/>(https?:.*)<\/p>/)[1]
      if (!employerUrl)
        throw new Error(
          `Could not find url for employer in email: ${email.html}`,
        )
      cy.visit(employerUrl)
      phaseEmployerApproval()
    })
  })
})
