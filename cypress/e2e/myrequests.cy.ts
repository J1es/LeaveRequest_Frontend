describe("My Requests Page", () => {

    beforeEach(() => {
        cy.loginStaff();
        cy.visit("http://localhost:5173/myrequests");
    });

    it("Displays the My Requests page", () => {
        cy.contains("My Requests")
            .should("exist");
    });

    it("Displays leave request cards", () => {
        cy.contains("Request #")
            .should("exist");
    });

    it("Shows leave request details", () => {
        cy.contains("Start Date")
            .should("exist");

        cy.contains("End Date")
            .should("exist");

        cy.contains("Status")
            .should("exist");

        cy.contains("Reason")
            .should("exist");
    });

    it("Displays success message when redirected from leave request form", () => {
        cy.visit("http://localhost:5173/myrequests?success=true");

        cy.contains("Leave Request Submitted")
            .should("exist");
    });

    it("Opens cancel modal when Cancel is clicked", () => {
        cy.contains("Cancel")
            .first()
            .click();

        cy.contains("Cancel Request")
            .should("exist");

        cy.get("textarea[name='reason']")
            .should("exist");
    });

    it("Closes modal when Close button is clicked", () => {
        cy.contains("Cancel")
            .first()
            .click();

        cy.contains("Close")
            .click();

        cy.contains("Cancel Request")
            .should("not.exist");
    });

    it("Shows validation error when reason is empty", () => {
        cy.contains("Cancel")
            .first()
            .click();

        cy.contains("Confirm")
            .click();

        cy.contains("Please Enter a valid reason.")
            .should("exist");
    });

    it("Allows user to enter a cancellation reason", () => {
        cy.contains("Cancel")
            .first()
            .click();

        cy.get("textarea[name='reason']")
            .type("Holiday no longer required");

        cy.get("textarea[name='reason']")
            .should("have.value", "Holiday no longer required");
    });

});