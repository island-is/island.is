import {
  employerFormMessages,
  parentalLeaveFormMessages,
} from '@island.is/application/templates/parental-leave/messages'
import { coreMessages } from '@island.is/application/core/messages'
import { getFakeUser } from '../../../support/utils'
import fakeUsers from '../../../fixtures/applications/users.json'
import { label } from '../../../lib/i18n-messages'

function proceed() {
  cy.get('[data-testid="proceed"]').click()
}

describe('Parental leave', () => {
  const fakeUser = getFakeUser(fakeUsers, 'Gervimaður Afríka')
  let employerEmail = 'not ready'
  let applicantEmail = 'not ready'
  const employer = 'employer' // user reference for the employer email account

  before(() => {
    cy.task('createEmailAccount', 'applicant').then((email) => {
      expect(email).to.be.a('string')
      applicantEmail = email as string
    })
    cy.task('createEmailAccount', employer).then((email) => {
      expect(email).to.be.a('string')
      employerEmail = email as string
    })
  })

  beforeEach(() => {
    cy.idsLogin({
      phoneNumber: fakeUser.phoneNumber,
      baseUrl: Cypress.config('baseUrl'),
      urlPath: '/umsoknir/faedingarorlof',
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
      .type(`{selectall}${applicantEmail}`)

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
    cy.findByRole('textbox', {
      name: label(parentalLeaveFormMessages.employer.email),
    }).type(employerEmail)
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

    // primary parent application complete
    primaryParentApplication()

    // now completing the employer confirmation part
    cy.task('getLastEmail', { name: employer, retries: 6 }).then(
      (emailInfo) => {
        const email = emailInfo as { html: string }
        expect(email.html).to.be.a('string')
        const employerUrlMatch = email.html.match(/>(https?:.*)<\/p>/)
        if (employerUrlMatch?.length != 2)
          throw new Error(
            'Email does not contain the url to approve the parental leave application',
          )
        const employerUrl = employerUrlMatch[1]
        if (!employerUrl)
          throw new Error(
            `Could not find url for employer in email: ${email.html}`,
          )
        cy.visit(employerUrl)
        phaseEmployerApproval()
      },
    )
  })
})
