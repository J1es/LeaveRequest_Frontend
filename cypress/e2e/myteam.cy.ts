describe("My Team Page", () => {

    beforeEach(() => {
        cy.loginManager();
        cy.visit("http://localhost:5173/myteam");
    });

    it("Displays My Team page", () => {

        cy.contains("Staff")
            .should("exist");
            
    });

    it("Displays team members", () => {

        cy.contains("Employee ID:")
            .should("exist");

        cy.contains("Name:")
            .should("exist");

        cy.contains("Email:")
            .should("exist");

        cy.contains("Leave Balance:")
            .should("exist");
    });

    it("Displays Manage Requests button", () => {

        cy.contains("Manage Requests")
            .should("exist");
    });

    it("Navigates to Manage Requests page", () => {

        cy.contains("Manage Requests")
            .first()
            .should("exist");

        cy.contains("Manage Requests")
            .first()
            .click();

        cy.url()
            .should("include", "/myteam/");
    });

});