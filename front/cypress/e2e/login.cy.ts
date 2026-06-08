describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept('GET', '/api/session', []).as('session');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`,
    );

    cy.url().should('include', '/sessions');
  });

  it('Login with wrong credentials shows error', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Unauthorized' },
    }).as('loginRequest');

    cy.get('input[formControlName=email]').type('wrong@test.com');
    cy.get('input[formControlName=password]').type('wrongpassword');
    cy.get('button[type=submit]').click();

    cy.wait('@loginRequest');
    cy.get('.error', { timeout: 10000 }).should('be.visible');
  });
});
