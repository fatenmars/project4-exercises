describe('Register spec', () => {
  it('Register successfull', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {},
    });

    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('john.doe@test.com');
    cy.get('input[formControlName=password]').type('password123{enter}');

    cy.url().should('include', '/login');
  });

  it('Register with error', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 400,
      body: { message: 'Error' },
    });

    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('john.doe@test.com');
    cy.get('input[formControlName=password]').type('password123{enter}');

    cy.get('.error').should('be.visible');
  });
});
