import { getGreeting } from '../support/app.po'

// describe('unemployment', () => {
//   beforeEach(() => cy.visit('/'))

//   it('should display welcome message', () => {
//     // Custom command example, see `../support/commands.ts` file
//     cy.login('my-email@something.com', 'myPassword')

//     // Function helper example, see `../support/app.po.ts` file
//     getGreeting().contains('Welcome to unemployment!')
//   })
// })

describe("VMST UI TESTS", () =>{
  it("Welcome page 0", () => {
      cy.visit("http://localhost:4200/");
      cy.get('[data-cy=tel]').should("be.visible");
      cy.get('[data-cy=tel]').type('1234567');
      cy.get('[data-cy=tel]').should("have.value","1234567");
      cy.get('[data-cy=login-btn]').should("be.visible");
      cy.get('[data-cy=login-btn]').click();
      cy.get('[data-cy=personalinfo-next-step-btn]').should("be.visible");
  });
  it("Communication page 1", () => {
      cy.visit("http://localhost:4200/application/1");
      cy.get('[data-cy=email]').should("be.visible");
      cy.get('[data-cy=email]').should("not.be.null");        
      cy.get('[data-cy=email]').clear();
      cy.get('[data-cy=email]').type('test@test.is');
      cy.get('[data-cy=email]').should("have.value","test@test.is");
      cy.get('[data-cy=mobile]').should("be.visible");
      cy.get('[data-cy=email]').should("not.be.null");        
      cy.get('[data-cy=mobile]').clear();
      cy.get('[data-cy=mobile]').type('7654321');
      cy.get('[data-cy=mobile]').should("have.value","7654321");
      cy.get('[data-cy=personalinfo-next-step-btn]').click();
  });  
  it("Communication page 2", () => {
      cy.visit("http://localhost:4200/application/2");
      cy.get('.Input-style_2eJUh').should("contain","Frá hvaða dag hefur þú verið atvinnulaus");
      // cy.get('[data-cy=email]').clear();
      // cy.get('[data-cy=email]').type('test@test.is');
      // cy.get('[data-cy=mobile]').clear();
      // cy.get('[data-cy=mobile]').type('7654321');
      // cy.get('[data-cy=personalinfo-next-step-btn]').click();        
  });  


});