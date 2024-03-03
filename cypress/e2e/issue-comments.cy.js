import IssueModal from "../pages/IssueModal";

describe('Issue comments creating, editing and deleting', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it('Should create a comment successfully', () => {
    const comment = 'TEST_COMMENT';

    getIssueDetailsModal().within(() => {
      cy.contains('Add a comment...').click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains('button', 'Save').click().should('not.exist');

      cy.contains('Add a comment...').should('exist');
      cy.get('[data-testid="issue-comment"]').should('contain', comment);
    });
  });

  it('Should edit a comment successfully', () => {
    const previousComment = 'An old silent pond...';
    const comment = 'TEST_COMMENT_EDITED';

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains('Edit')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Add a comment..."]')
        .should('contain', previousComment)
        .clear()
        .type(comment);

      cy.contains('button', 'Save').click().should('not.exist');

      cy.get('[data-testid="issue-comment"]')
        .should('contain', 'Edit')
        .and('contain', comment);
    });
  });

  it('Should delete a comment successfully', () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains('Delete')
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains('button', 'Delete comment')
      .click()
      .should('not.exist');

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should('not.exist');
  });

  //Add a comment.
  //Assert that the comment has been added and is visible.

  it('Should add, edit and delete a comment successfully - using POM-method', () => {
    getIssueDetailsModal().within(() => {
      IssueModal.findAddCommentField();
      IssueModal.addCommentAndSave();
      IssueModal.commentExist();
      //Edit the added comment.
      //Assert that the updated comment is visible.
      IssueModal.editCommentAndAssertVisibility();
    });
    //Remove the comment.
    //Assert that the comment is removed
    IssueModal.deleteCommentAndAssertDeletion();
  });

  it('Should add, edit and delete a comment successfully', () => {
    const findAddCommentField = () => cy.contains('Add a comment...').click();
    const addCommentFieldVisible = () =>
      cy.contains('Add a comment...').should('exist');
    const addComment = () =>
      cy.get('textarea[placeholder="Add a comment..."]').type('TEST_COMMENT');
    const addedCommentVisible = () =>
      cy.get('[data-testid="issue-comment"]').should('contain', 'TEST_COMMENT');
    const addNewComment = () =>
      cy
        .get('textarea[placeholder="Add a comment..."]')
        .clear()
        .type('TEST_COMMENT_EDITED');
    const newCommentVisible = () =>
      cy
        .get('[data-testid="issue-comment"]')
        .should('contain', 'TEST_COMMENT_EDITED');
    const clickSave = () =>
      cy.contains('button', 'Save').click().should('not.exist');
    const clickEdit = () => cy.contains('Edit').click().should('not.exist');
    const clickDelete = () => cy.contains('Delete').click();
    const getConfirmPopup = () => cy.get('[data-testid="modal:confirm"]');
    function confirmWindowContainsClickDelete() {cy.contains('Are you sure you want to delete this comment?').should(
      'be.visible'
    );
    cy.contains("Once you delete, it's gone for good.").should('be.visible');
    cy.contains('button', 'Cancel');
      cy.contains('button', 'Delete comment').click();
    }
    const commentDeleted = () =>
      cy.get('TEST_COMMENT_EDITED').should('not.exist');

    getIssueDetailsModal().within(() => {
      findAddCommentField();
      addComment();
      clickSave();
      addCommentFieldVisible();
      addedCommentVisible();
      clickEdit();
      addNewComment();
      clickSave();
      newCommentVisible();
      clickDelete();
    });

      getConfirmPopup().within(() => {
        confirmWindowContainsClickDelete();
        getConfirmPopup().should('not.exist');
        commentDeleted();
      });
  });
});
