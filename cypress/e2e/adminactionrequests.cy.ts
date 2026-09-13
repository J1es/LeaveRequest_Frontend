describe("Admin Action Requests Page", () => {

    beforeEach(() => {
        cy.loginAdmin();

        cy.visit("http://localhost:5173/adminactions/10");
    });

    it("Displays employee requests page", () => {

        cy.contains("'s Requests")
            .should("exist");
    });

    it("Displays leave request information", () => {

        cy.contains("Start Date")
            .should("exist");

        cy.contains("End Date")
            .should("exist");

        cy.contains("Status")
            .should("exist");

        cy.contains("Reason")
            .should("exist");
    });

    it("Displays request cards", () => {

        cy.contains("Request #")
            .should("exist");
    });

    it("Opens approve modal", () => {

        cy.contains("Approve")
            .first()
            .should("exist");

        cy.contains("Approve")
            .first()
            .click();

        cy.contains("Approve Request")
            .should("exist");
    });

    it("Allows admin to enter approval reason", () => {

        cy.contains("Approve")
            .first()
            .click();

        cy.get("textarea")
            .type("Approved by administrator");

        cy.get("textarea")
            .should("have.value", "Approved by administrator");
    });

    it("Shows validation error when approval reason is empty", () => {

        cy.contains("Approve")
            .first()
            .click();

        cy.contains("Confirm")
            .click();

        cy.contains("Please Enter a valid reason.")
            .should("exist");
    });

    it("Opens reject modal", () => {

        cy.contains("Reject")
            .first()
            .click();

        cy.contains("Reject Request")
            .should("exist");
    });

    it("Allows admin to enter rejection reason", () => {

        cy.contains("Reject")
            .first()
            .click();

        cy.get("textarea")
            .type("Rejected by administrator");

        cy.get("textarea")
            .should("have.value", "Rejected by administrator");
    });

    it("Closes modal when Close button is pressed", () => {

        cy.contains("Approve")
            .first()
            .click();

        cy.contains("Close")
            .click();

        cy.contains("Approve Request")
            .should("not.exist");
    });

});