class IssueModal {
    constructor() {
        this.submitButton = 'button[type="submit"]';
        this.issueModal = '[data-testid="modal:issue-create"]';
        this.issueDetailModal = '[data-testid="modal:issue-details"]';
        this.title = 'input[name="title"]';
        this.issueType = '[data-testid="select:type"]';
        this.descriptionField = '.ql-editor';
        this.assignee = '[data-testid="select:userIds"]';
        this.backlogList = '[data-testid="board-list:backlog"]';
        this.issuesList = '[data-testid="list-issue"]';
        this.deleteButton = '[data-testid="icon:trash"]';
        this.deleteButtonName = "Delete issue";
        this.cancelDeletionButtonName = "Cancel";
        this.confirmationPopup = '[data-testid="modal:confirm"]';
        this.closeDetailModalButton = '[data-testid="icon:close"]';
        this.issueCommentField = '[data-testid="issue-comment"]';
        this.textArea = 'textarea[placeholder="Add a comment..."]';
        this.comment = 'Frog was sitting on the stone';
        this.newComment = 'The stork came and took the frog away';
    }

    getIssueModal() {
        return cy.get(this.issueModal);
    }

    getIssueDetailModal() {
        return cy.get(this.issueDetailModal);
    }

    selectIssueType(issueType) {
        cy.get(this.issueType).click('bottomRight');
        cy.get(`[data-testid="select-option:${issueType}"]`)
            .trigger('mouseover')
            .trigger('click');
    }

    selectAssignee(assigneeName) {
        cy.get(this.assignee).click('bottomRight');
        cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
    }

    editTitle(title) {
        cy.get(this.title).debounced('type', title);
    }

    editDescription(description) {
        cy.get(this.descriptionField).type(description);
    }

    createIssue(issueDetails) {
        this.getIssueModal().within(() => {
            this.selectIssueType(issueDetails.type);
            this.editDescription(issueDetails.description);
            this.editTitle(issueDetails.title);
            this.selectAssignee(issueDetails.assignee);
            cy.get(this.submitButton).click();
        });
    }

    ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
        cy.get(this.issueModal).should('not.exist');
        cy.reload();
        cy.contains('Issue has been successfully created.').should('not.exist');

        cy.get(this.backlogList).should('be.visible').and('have.length', '1').within(() => {
            cy.get(this.issuesList)
                .should('have.length', expectedAmountIssues)
                .first()
                .find('p')
                .contains(issueDetails.title);
            cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should('be.visible');
        });
    }

    ensureIssueIsVisibleOnBoard(issueTitle) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.contains(issueTitle).should('be.visible');
    }

    ensureIssueIsNotVisibleOnBoard(issueTitle) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.contains(issueTitle).should('not.exist');
    }

    validateIssueVisibilityState(issueTitle, isVisible = true) {
        cy.get(this.issueDetailModal).should('not.exist');
        cy.reload();
        cy.get(this.backlogList).should('be.visible');
        if (isVisible)
            cy.contains(issueTitle).should('be.visible');
        if (!isVisible)
            cy.contains(issueTitle).should('not.exist');
    }

    clickDeleteButton() {
        cy.get(this.deleteButton).click();
        cy.get(this.confirmationPopup).should('be.visible');
    }

    confirmDeletion() {
        cy.get(this.confirmationPopup).within(() => {
            cy.contains(this.deleteButtonName).click();
        });
        cy.get(this.confirmationPopup).should('not.exist');
        cy.get(this.backlogList).should('be.visible');
    }

    cancelDeletion() {
        cy.get(this.confirmationPopup).within(() => {
            cy.contains(this.cancelDeletionButtonName).click();
        });
        cy.get(this.confirmationPopup).should('not.exist');
        cy.get(this.issueDetailModal).should('be.visible');
    }

    closeDetailModal() {
        cy.get(this.issueDetailModal).get(this.closeDetailModalButton).first().click();
        cy.get(this.issueDetailModal).should('not.exist');
    }

    findAddCommentField() {
        cy.contains('Add a comment...').click();
    }

    addCommentAndSave() {
        cy.get(this.textArea).type(this.comment);
        cy.contains('button', 'Save').click().should('not.exist');
    }

    commentExist() {
        cy.contains('Add a comment...').should('exist');
        cy.get(this.issueCommentField).should('contain', this.comment);
    }

    editCommentAndAssertVisibility() {
        cy.contains('Edit').click().should('not.exist');
        cy.get(this.textArea)
          .clear()
          .type(this.newComment);
        cy.contains('button', 'Save').click().should('not.exist');
        cy.get(this.issueCommentField).should('contain', this.newComment);
    }

    deleteCommentAndAssertDeletion() {
        cy.contains('Delete').click();
        cy.get(this.confirmationPopup).within(() => {
            cy.contains('Are you sure you want to delete this comment?')
                .should('be.visible');
                cy.contains("Once you delete, it's gone for good.")
                .should('be.visible');
            cy.contains('button', 'Cancel');
            cy.contains('button', 'Delete comment').click();
            cy.get(this.confirmationPopup).should('not.exist');
            cy.get(this.newComment)
                .should('not.exist');
        });
    }
}

export default new IssueModal();