describe('Issue deletion', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project`)
      .then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      });
  });

  const deleteButton = '[data-testid="icon:trash"]';
  const deleteConfirm = '[data-testid="modal:confirm"]';
  const url = "https://jira.ivorreic.com/project/board";

  it('Should delete issue', () => {
    cy.get(deleteButton).click();
    cy.get(deleteConfirm).within(() => {
      cy.contains('Delete issue').click();
      cy.get(deleteConfirm).should('not.exist');
    });
  });

  it('Should cancel deleting issue', () => {
    cy.get(deleteButton).click();
    cy.get(deleteConfirm).within(() => {
      cy.contains('Cancel').click();
      cy.get(deleteConfirm).should('not.exist');
      cy.visit(url)
      });
    });
  });
