describe('Session form spec', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'Admin',
        lastName: 'Admin',
        admin: true,
      },
    });
    cy.intercept('GET', '/api/session', [
      {
        id: 1,
        name: 'Yoga Beginner',
        description: 'Yoga for beginners',
        date: '2026-12-01T00:00:00.000Z',
        teacher_id: 1,
        users: [],
      },
    ]);
    cy.intercept('GET', '/api/teacher', [
      { id: 1, firstName: 'John', lastName: 'Doe' },
    ]);
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234');
    cy.get('button[type=submit]').click();
  });

  it('Creates a new session', () => {
    cy.intercept('POST', '/api/session', { statusCode: 200, body: {} });

    cy.contains('Create').click();
    cy.url().should('include', '/sessions/create');

    cy.get('input[formControlName=name]').type('New Session');
    cy.get('input[formControlName=date]').type('2026-12-15');
    cy.get('mat-select[formControlName=teacher_id]').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[formControlName=description]').type('A new yoga session');

    cy.contains('Save').click();
    cy.url().should('include', '/sessions');
  });

  it('Updates an existing session', () => {
    cy.intercept('GET', '/api/session/1', {
      id: 1,
      name: 'Yoga Beginner',
      description: 'Yoga for beginners',
      date: '2026-12-01T00:00:00.000Z',
      teacher_id: 1,
      users: [],
    });
    cy.intercept('PUT', '/api/session/1', { statusCode: 200, body: {} });

    cy.contains('Edit').click();
    cy.url().should('include', '/sessions/update/1');

    cy.get('input[formControlName=name]').clear().type('Updated Session');
    cy.contains('Save').click();
    cy.url().should('include', '/sessions');
  });

  it('Deletes a session', () => {
    cy.intercept('GET', '/api/session/1', {
      id: 1,
      name: 'Yoga Beginner',
      description: 'Yoga for beginners',
      date: '2026-12-01T00:00:00.000Z',
      teacher_id: 1,
      users: [],
    });
    cy.intercept('GET', '/api/teacher/1', {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    });
    cy.intercept('DELETE', '/api/session/1', { statusCode: 200, body: {} });

    cy.contains('Detail').click();
    cy.contains('Delete').click();
    cy.url().should('include', '/sessions');
  });
});
