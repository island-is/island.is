/// <reference path="../../support/index.d.ts" />

describe('applicant flow', () => {
  // describe('login', () => {
  //   it('should visit login page and have correct identifier', () => {
  //     cy.visit('/')
  //     cy.contains('Samband Íslenskra Sveitarfélaga - Fjárhagsaðstoð')
  //     cy.url().should('include', '@samband.is')
  //   })
  // })

  describe('application', () => {
    describe('/umsokn', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn')
      })

      it('should get error if data gathering is not accepted', () => {
        cy.contains('Þú þarft að samþykkja gagnaöflun').should('not.exist')
        cy.getByTestId('continueButton').click()
        cy.contains('Þú þarft að samþykkja gagnaöflun')
      })

      it('should go to next page after terms have been accepted', () => {
        cy.contains(
          'Ég skil að ofangreindra gagna verður aflað í umsóknar- og staðfestingarferlinu',
        ).click()

        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/rettur')
      })

      describe('/umsokn/rettur', () => {
        beforeEach(() => {
          cy.stubAPIResponses()
          cy.visit('/umsokn/rettur')
        })

        it('should have gdpr information hidden', () => {
          cy.contains('Tilgangur vinnslu og lagagrundvöllur').should(
            'not.exist',
          )
          cy.contains('Hvaða upplýsingar er unnið með?').should('not.exist')
        })

        it('should expand gdpr information', () => {
          cy.contains(
            'Nánar um persónuverndarstefnu þíns sveitarfélags',
          ).click()
          cy.contains('Tilgangur vinnslu og lagagrundvöllur')
          cy.contains('Hvaða upplýsingar er unnið með?')
        })

        it('should go to next page when continue button is clicked', () => {
          cy.getByTestId('continueButton').click()
          cy.url().should('include', '/umsokn/hjuskaparstada')
        })
      })

      describe('/umsokn/hjuskaparstada', () => {
        beforeEach(() => {
          cy.stubAPIResponses()
          cy.visit('/umsokn/hjuskaparstada')
        })

        it('should show error if no relationship status is selected', () => {
          cy.getByTestId('showErrorMessage').should('not.exist')
          cy.getByTestId('continueButton').click()
          cy.getByTestId('showErrorMessage')
        })

        it('should show no inputs when not cohabitation is selected', () => {
          cy.get('[value=NotCohabitation]').click()
          cy.getByTestId('spouseInfo').should('not.exist')
          cy.getByTestId('nationalIdSpouse').should('not.exist')
          cy.getByTestId('emailSpouse').should('not.exist')
        })

        it('should be able to continue when not cohabitation is selected and route to correct page', () => {
          cy.get('[value=NotCohabitation]').click()
          cy.getByTestId('continueButton').click()
          cy.url().should('include', '/umsokn/buseta')
        })

        it('should show extra inputs when unregistered cohabitation is selected', () => {
          cy.get('[value=UnregisteredCohabitation]').click()
          cy.getByTestId('spouseInfo')
          cy.getByTestId('nationalIdSpouse')
          cy.getByTestId('emailSpouse')
        })

        it('should show error message when unregistered cohabitation is selected and user tries to continues with out filling them', () => {
          cy.contains(
            'Athugaðu hvort kennitalan sé rétt slegin inn, gild kennitala er 10 stafir',
          ).should('not.exist')
          cy.contains('Athugaðu hvort netfang sé rétt slegið inn').should(
            'not.exist',
          )
          cy.contains('Verður að samþykkja').should('not.exist')

          cy.get('[value=UnregisteredCohabitation]').click()
          cy.getByTestId('continueButton').click()

          cy.contains(
            'Athugaðu hvort kennitalan sé rétt slegin inn, gild kennitala er 10 stafir',
          )
          cy.contains('Athugaðu hvort netfang sé rétt slegið inn')
          cy.contains('Verður að samþykkja')
          const nationalIdSpouse = 'nationalIdSpouse'
          cy.getByTestId(nationalIdSpouse).focus()
          cy.getByTestId(nationalIdSpouse).type('0000000000')

          cy.contains(
            'Athugaðu hvort kennitalan sé rétt slegin inn, gild kennitala er 10 stafir',
          ).should('not.exist')
          cy.contains(
            'Athugaðu hvort kennitalan sé rétt slegin inn, gild kennitala er 10 stafir',
          ).should('not.exist')
          cy.contains('Verður að samþykkja').should('not.exist')
        })

        it('should be able to continue when unregistered cohabitation is selected and needed inputs filled', () => {
          cy.get('[value=UnregisteredCohabitation]').click()
          const nationalIdSpouse = 'nationalIdSpouse'
          cy.getByTestId(nationalIdSpouse).focus()
          cy.getByTestId(nationalIdSpouse).type('0000000000')
          const emailSpouse = 'emailSpouse'
          cy.getByTestId(emailSpouse).focus()
          cy.getByTestId(emailSpouse).type('test@test.test')
          cy.getByTestId('acceptSpouseTerms').click()
          cy.getByTestId('continueButton').click()
          cy.url().should('include', '/umsokn/buseta')
        })
      })
    })

    describe('/umsokn/buseta', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/buseta')
      })

      it('should show error message when no option is selected and user tries to continue', () => {
        cy.getByTestId('errorMessage').should('not.exist')
        cy.getByTestId('continueButton').click()
        cy.getByTestId('errorMessage')
      })

      it('should hide error message once option is selected', () => {
        cy.getByTestId('continueButton').click()
        cy.getByTestId('errorMessage')
        cy.get('[value=WithParents]').click()
        cy.getByTestId('errorMessage').should('not.exist')
      })

      it('should show text area when other option is selected', () => {
        cy.get('[name=homeCircumstancesCustom]').should('not.exist')
        cy.get('[value=Other]').click()
        cy.get('[name=homeCircumstancesCustom]')
      })

      it('should route to next page when input is valid', () => {
        cy.get('[value=WithParents]').click()
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/nam')
      })
    })

    describe('/umsokn/nam', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/nam')
      })

      it('should show error when no option is selected', () => {
        cy.getByTestId('noOptionSelectedErrorMessage').should('not.exist')
        cy.getByTestId('continueButton').click()
        cy.getByTestId('noOptionSelectedErrorMessage')
      })

      it('should show error when no option is selected', () => {
        cy.getByTestId('noOptionSelectedErrorMessage').should('not.exist')
        cy.getByTestId('continueButton').click()
        cy.getByTestId('noOptionSelectedErrorMessage')
      })

      it('should show input when yes option is selected', () => {
        cy.getByTestId('studyExample').should('not.exist')
        cy.get('[value=1]').click()
        cy.getByTestId('studyExample')
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/nam')
      })

      it('should route to next page when input is valid', () => {
        cy.get('[value=0]').click()
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/atvinna')
      })
    })

    describe('/umsokn/atvinna', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/atvinna')
      })

      it('should show error when no option is selected', () => {
        cy.getByTestId('noOptionSelectedErrorMessage').should('not.exist')
        cy.getByTestId('continueButton').click()
        cy.getByTestId('noOptionSelectedErrorMessage')
      })

      it('should show text area when other option is selected', () => {
        cy.get('[name=employmentCustom]').should('not.exist')
        cy.get('[value=Other]').click()
        cy.get('[name=employmentCustom]')
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/atvinna')
      })

      it('should route to next page when input is valid', () => {
        cy.get('[value=Working]').click()
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/tekjur')
      })
    })

    describe('/umsokn/tekjur', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/tekjur')
      })

      it('should show error when no option is selected', () => {
        cy.getByTestId('noOptionSelectedErrorMessage').should('not.exist')
        cy.getByTestId('continueButton').click()
        cy.getByTestId('noOptionSelectedErrorMessage')
      })

      it('should route to next page when input is valid', () => {
        cy.get('[value=1]').click()
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/gogn')
      })
    })

    describe('/umsokn/gogn', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/gogn')
      })

      // This test is currently broken since the page doesn't exist in the
      // navigation until the user has answered another question indicating that
      // they have income in the previous month. Thus, the logic to send the
      // user to the "next" page is broken.
      it.skip('should route to correct page', () => {
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/skattagogn')
      })
    })

    describe('/umsokn/skattagogn', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/skattagogn')
      })

      it('should route to correct page', () => {
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/personuafslattur')
      })
    })

    describe('/umsokn/personuafslattur', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/personuafslattur')
      })

      it('should show error when no option is selected', () => {
        cy.getByTestId('noOptionSelectedErrorMessage').should('not.exist')
        cy.getByTestId('continueButton').click()
        cy.getByTestId('noOptionSelectedErrorMessage')
      })

      it('should route to next page when input is valid', () => {
        cy.get('[value=1]').click()
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/bankaupplysingar')
      })
    })

    describe('/umsokn/bankaupplysingar', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/bankaupplysingar')
      })

      it('should have bank inputs and be able to navigate to next page', () => {
        cy.get('[id=bankNumber]')
        cy.get('[id=ledger]')
        cy.get('[id=accountNumber]')
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/samskipti')
      })
    })

    describe('/umsokn/samskipti', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/samskipti')
      })

      it('should not route when input is filled', () => {
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/samskipti')
      })

      it('should route when input is filled', () => {
        cy.get('[name=email]').focus()
        cy.get('[name=email]').type('test@test.test')
        cy.get('[name=phoneNumber]').focus()
        cy.get('[name=phoneNumber]').type('0000000')
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/yfirlit')
      })
    })

    describe('/umsokn/yfirlit', () => {
      beforeEach(() => {
        cy.stubAPIResponses()
        cy.visit('/umsokn/yfirlit')
      })

      it('should route to correct page on continue', () => {
        cy.getByTestId('continueButton').click()
        cy.url().should('include', '/umsokn/stadfesting')
      })
    })
  })
})
