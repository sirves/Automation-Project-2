describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        cy.visit(url + '/board?modal-issue-create=true');
      });
  });
  const issueCreate = '[data-testid="modal:issue-create"]';
  const originalEstimateHours = 'input[placeholder="Number"]';
  const iconClock = '[data-testid="icon:stopwatch"]';
  const modalTimeTracking = '[data-testid="modal:tracking"]';

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');

  const clickClose = () => cy.get('[data-testid="icon:close"]').first().click();
  const getIssueList = () => cy.get('[data-testid="list-issue"]').eq(0).click();
  const clickDone = () =>
    cy.contains('button', 'Done').should('be.visible').click();

  const issueCreation = () =>
    cy.get(issueCreate).within(() => {
      cy.get('.ql-editor').type('My bug report');
      cy.get('.ql-editor').should('have.text', 'My bug report');
      cy.get('input[name="title"]').type('Buggy');
      cy.get('input[name="title"]').should('have.value', 'Buggy');
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="icon:story"]').should('be.visible');
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('button[type="submit"]').click();
    });

  it('Should be possible to create an issue and add, edit and remove time estimation', () => {
    issueCreation();
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.get(issueCreate).should('not.exist');
    cy.reload();
    cy.wait(10000);
    getIssueList();
    getIssueDetailsModal().should('be.visible');

    getIssueDetailsModal().within(() => {
      cy.wait(10000);
      cy.get(iconClock).next().should('contain', 'No time logged');
      cy.get(originalEstimateHours)
        .should('have.value', '')
        .click()
        .clear()
        .type('10{enter}');
      cy.wait(4000);
      clickClose();
    });

    cy.reload();
    cy.wait(10000);
    getIssueList();
    getIssueDetailsModal().should('be.visible');

    getIssueDetailsModal().within(() => {
      cy.wait(10000);
      cy.get(originalEstimateHours)
        .should('have.value', '10')
        .click()
        .clear()
        .type('20{enter}');
      cy.wait(4000);
      clickClose();
    });

    cy.reload();
    cy.wait(10000);
    getIssueList();
    getIssueDetailsModal().should('be.visible');

    getIssueDetailsModal().within(() => {
      cy.wait(10000);
      cy.get(originalEstimateHours)
        .should('have.value', '20')
        .click()
        .clear()
        .type('{enter}');
      cy.wait(4000);
      clickClose();
    });

    cy.reload();
    cy.wait(10000);
    getIssueList();
    getIssueDetailsModal().should('be.visible');

    getIssueDetailsModal().within(() => {
      cy.wait(10000);
      cy.get(iconClock).next().should('contain', 'No time logged');
      cy.get(originalEstimateHours).should('have.value', '').click();
    });
  });

  it('Should create an issue with time logging functionality', () => {
    issueCreation();
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.get(issueCreate).should('not.exist');
    cy.reload();
    cy.wait(10000);
    getIssueList();
    getIssueDetailsModal().should('be.visible');

    getIssueDetailsModal().within(() => {
      cy.wait(10000);
      cy.get(originalEstimateHours).click().type('10{enter}');
      cy.get(iconClock).click();
    });

    cy.get(modalTimeTracking).within(() => {
      cy.get(iconClock).next().should('contain', 'No time logged');
      cy.get(originalEstimateHours).first().type(2);
      cy.get(originalEstimateHours).last().type('5{enter}');
      clickDone();
    });
    getIssueDetailsModal().within(() => {
      cy.get(modalTimeTracking).should('not.exist');
      cy.get(iconClock).should('not.contain', 'No time logged');
      cy.get(iconClock).next().first().should('contain', '2h logged');
      cy.get(iconClock).next().last().should('contain', '5h remaining');
      cy.get(originalEstimateHours).should('have.value', 10);
      cy.get(iconClock).click();
    });
      cy.get(modalTimeTracking).within(() => {
        cy.get(originalEstimateHours).first().click().clear();
        cy.get(originalEstimateHours).last().click().clear();
        cy.get(iconClock).next().should('contain', 'No time logged');
        cy.get(iconClock).next(0).should('contain', '10h estimated');
        clickDone();
      });
    });
  });

