import faker from 'faker'

import { CREATE_INVESTIGATION_CASE_ROUTE } from '@island.is/judicial-system/consts'
import { UserRole } from '@island.is/judicial-system/types'

describe(CREATE_INVESTIGATION_CASE_ROUTE, () => {
  beforeEach(() => {
    cy.stubAPIResponses()
    cy.login(UserRole.PROSECUTOR)
    cy.visit(CREATE_INVESTIGATION_CASE_ROUTE)
  })

  it('should require valid data', () => {
    const policeCaseNumbersId = '#policeCaseNumbers'
    // Police case number
    cy.get(policeCaseNumbersId).type('0')
    cy.get(policeCaseNumbersId).type('{enter}')
    cy.getByTestid('noPoliceCaseNumbersAssignedMessage').should('exist')
    cy.getByTestid('policeCaseNumbers-list').should('not.exist')
    cy.get(policeCaseNumbersId).clear()
    cy.get(policeCaseNumbersId).blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.get(policeCaseNumbersId).type('007202201')
    cy.get(policeCaseNumbersId).type('{enter}')
    cy.getByTestid('noPoliceCaseNumbersAssignedMessage').should('not.exist')
    cy.getByTestid('policeCaseNumbers-list').children().should('have.length', 1)
    cy.getByTestid('inputErrorMessage').should('not.exist')

    // National id
    const nationalId = 'nationalId'
    cy.getByTestid(nationalId).type('0')
    cy.getByTestid(nationalId).blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 000000-0000')
    cy.getByTestid(nationalId).clear()
    cy.getByTestid(nationalId).blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid(nationalId).clear()
    cy.getByTestid(nationalId).type('0000000000')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // Birthday
    cy.get('[type="checkbox"]').check()
    cy.getByTestid(nationalId).type('0')
    cy.getByTestid(nationalId).blur()
    cy.getByTestid('inputErrorMessage').contains('Dæmi: 00.00.0000')
    cy.getByTestid(nationalId).clear()
    cy.getByTestid(nationalId).type('01.01.2000')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // Address
    const accusedAddress = 'accusedAddress'
    cy.getByTestid(accusedAddress).clear()
    cy.getByTestid(accusedAddress).blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid(accusedAddress).clear()
    cy.getByTestid(accusedAddress).type('Sidwellssongata 300')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')
    //
    // Name
    cy.getByTestid('accusedName').clear()
    cy.getByTestid('accusedName').blur()
    cy.getByTestid('inputErrorMessage').contains('Reitur má ekki vera tómur')
    cy.getByTestid('accusedName').clear()
    cy.getByTestid('accusedName').type('Sidwell Sidwellsson')
    cy.getByTestid('inputErrorMessage').should('not.exist')
    cy.getByTestid('continueButton').should('be.disabled')

    // Case type
    cy.getByTestid('select-type').click()
    cy.get('[id="react-select-type-option-1"]').click()
    cy.getByTestid('continueButton').should('not.be.disabled')
  })

  it('should have a disabled gender and citizenship if the defendant has a business national id', () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    cy.getByTestid('nationalId').type('5555555555')
    cy.wait('@getBusinessesByNationalId')
    cy.get('#defendantGender').should(
      'have.class',
      'island-select--is-disabled',
    )
    cy.get('#defendantCitizenship').should('be.disabled')
  })

  it('should not have a disabled gender and citizenship if the defendant has a person national id', () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    cy.getByTestid('nationalId').type('1111111111')
    cy.wait('@getPersonByNationalId')
    cy.get('#defendantGender').should(
      'not.have.class',
      'island-select--is-disabled',
    )
    cy.get('#defendantCitizenship').should('not.be.disabled')
  })

  it('should autofill name, address and gender after getting person by national id in national registry', () => {
    // eslint-disable-next-line local-rules/disallow-kennitalas
    cy.getByTestid('nationalId').type('1111111111')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('accusedAddress').should('have.value', 'Jokersway 90')
    cy.getByTestid('accusedName').should('have.value', 'The Joker')
    cy.getByTestid('select-defendantGender').should('contain', 'Karl')
  })

  it('should not allow users to move forward if they entered an invalid defender email address or an invalid defender phonenumber', () => {
    cy.get('#policeCaseNumbers').type('00000000000')
    cy.get('#policeCaseNumbers').type('{enter}')
    cy.getByTestid('select-type').click()
    cy.get('[id="react-select-type-option-5-6"]').click()

    cy.getByTestid('nationalId').type('0000000000')
    cy.wait('@getPersonByNationalId')
    cy.getByTestid('nationalId').blur()
    cy.getByTestid('accusedName').type('Donald Duck')
    cy.getByTestid('accusedAddress').type('Batcave 1337')
    cy.getByTestid('select-defendantGender').click()
    cy.get('#react-select-defendantGender-option-0').click()
    cy.getByTestid('continueButton').should('not.be.disabled')

    cy.getByTestid('defenderEmail').type('ill formed email address')
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('defenderEmail').clear()
    cy.getByTestid('defenderPhoneNumber').type('000')
    cy.getByTestid('continueButton').should('be.disabled')
    cy.getByTestid('defenderPhoneNumber').clear()
    cy.getByTestid('defenderPhoneNumber').type('1234567')
    cy.get('#react-select-defenderName-input').type('John Doe')
    cy.get('#react-select-defenderName-input').type('{enter}')
    cy.get("[name='defender-access']").check()
    cy.getByTestid('continueButton').should('not.be.disabled')
  })

  it('should be able to select defender', () => {
    cy.wait('@lawyers')

    cy.getByTestid('creatable-select-defenderName').click()
    cy.getByTestid('creatable-select-defenderName')
      .find('input')
      .get('.island-select__option')
      .should('contain', 'Logmadur')
    cy.getByTestid('creatable-select-defenderName')
      .find('input')
      .get('.island-select__option')
      .click()
    cy.getByTestid('defenderEmail').should('have.value', 'logmadur@logmenn.is')
    cy.getByTestid('defenderPhoneNumber').should('have.value', '666-6666')
    cy.getByTestid('defenderNotFound').should('not.exist')

    cy.get('#react-select-defenderName-input').type('click', { force: true })
    cy.get('#react-select-defenderName-input').type('{enter}')
    cy.getByTestid('defenderNotFound').should('exist')
  })

  it('should have a button for deleting defendants', () => {
    cy.getByTestid('deleteDefendantButton').should('not.exist')
    cy.getByTestid('select-type').click()
    cy.get('[id="react-select-type-option-1"]').click()
    cy.get('[type="checkbox"]').check()
    cy.getByTestid('nationalId').type('01.01.2000')
    cy.getByTestid('accusedName').type(faker.name.firstName())
    cy.getByTestid('accusedAddress').type(faker.address.streetAddress())
    cy.getByTestid('select-defendantGender').click()
    cy.get('#react-select-defendantGender-option-0').click()
    cy.getByTestid('addDefendantButton').click()
    cy.getByTestid('deleteDefendantButton').should('exist')
  })
})
