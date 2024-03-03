describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
  });

  const issueTitle = "This is an issue of type: Task.";
  const issueListLenghtAfterDelete = 3;
  const issueListLenghtAfterDeleteCancel = 4;
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getConfirmModal = () => cy.get('[data-testid="modal:confirm"]');
  const boardBacklogList = () => cy.get('[data-testid="board-list:backlog"]');
  const issueList = () => cy.get('[data-testid="list-issue"]');
  const issueDeleteIcon = () => cy.get('[data-testid="icon:trash"]');
  const issueDetailsModalCloseIcon = () => cy.get('[data-testid="icon:close"]');

  it("Should delete issue successfully", () => {
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        issueDeleteIcon().click();
      });

    getConfirmModal()
      .should("be.visible")
      .within(() => {
        cy.contains("Are you sure you want to delete this issue?").should(
          "be.visible"
        );
        cy.contains("Once you delete, it's gone for good").should("be.visible");
        cy.contains("Delete issue").should("be.visible").click();
      });

    getConfirmModal().should("not.exist");
    getIssueDetailsModal().should("not.exist");

    cy.reload().wait(10000);

    boardBacklogList()
      .should("be.visible")
      .within(() => {
        cy.contains(issueTitle).should("not.exist");
        issueList().should("have.length", issueListLenghtAfterDelete);
      });
  });

  it.only("Should cancel deletion process successfully", () => {
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        issueDeleteIcon().click();
      });

    getConfirmModal()
      .should("be.visible")
      .within(() => {
        cy.contains("Are you sure you want to delete this issue?").should(
          "be.visible"
        );
        cy.contains("Once you delete, it's gone for good").should("be.visible");
        cy.contains("Delete issue").should("be.visible");
        cy.contains("Cancel").should("be.visible").click();
      });

    getConfirmModal().should("not.exist");
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        issueDetailsModalCloseIcon().first().click();
      });
    getIssueDetailsModal().should("not.exist");

    cy.reload().wait(10000);

    boardBacklogList()
      .should("be.visible")
      .within(() => {
        cy.contains(issueTitle).should("be.visible");
        issueList().should("have.length", issueListLenghtAfterDeleteCancel);
      });
  });
});
