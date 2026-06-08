describe('Me spec', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
      },
    });
    cy.intercept('GET', '/api/session', []);
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/sessions');
  });

  it('Displays user info', () => {
    cy.intercept('GET', '/api/user/1', {
      id: 1,
      email: 'yoga@studio.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    });

    cy.contains('Account').click();
    cy.contains('John');
    cy.contains('DOE');
    cy.contains('yoga@studio.com');
  });

  it('Deletes user account', () => {
    cy.intercept('GET', '/api/user/1', {
      id: 1,
      email: 'yoga@studio.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
    });
    cy.intercept('DELETE', '/api/user/1', { statusCode: 200, body: {} });

    cy.contains('Account').click();
    cy.contains('Detail').click();
    cy.url().should('include', '/login');
  });
});
