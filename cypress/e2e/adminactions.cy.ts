describe("Admin Actions Page", () => {

    beforeEach(() => {
        cy.loginAdmin();
        cy.visit("http://localhost:5173/adminactions");
    });

    it("Displays the Admin Actions page", () => {

        cy.contains("Staff")
            .should("exist");
    });

    it("Displays Add New User card", () => {

        cy.contains("Add New User")
            .should("exist");
    });

    it("Navigates to Add User page", () => {

        cy.contains("Add New User")
            .should("exist");

        cy.contains("Add New User")
            .click();

        cy.url()
            .should("include", "/adminactions/adduser");
    });

    it("Displays employee information", () => {

        cy.contains("Employee ID:")
            .should("exist");

        cy.contains("Name:")
            .should("exist");

        cy.contains("Email:")
            .should("exist");

        cy.contains("Role:")
            .should("exist");

        cy.contains("Leave Balance:")
            .should("exist");
    });

    it("Displays Edit User button", () => {

        cy.contains("Edit User")
            .should("exist");
    });

    it("Opens Edit User modal", () => {

        cy.contains("Edit User")
            .first()
            .should("exist");

        cy.contains("Edit User")
            .first()
            .click();

        cy.contains("Edit User")
            .should("exist");

        cy.get("input[type='number']")
            .should("exist");

        cy.get("select")
            .should("exist");
    });

    it("Allows leave balance to be edited", () => {

        cy.contains("Edit User")
            .first()
            .click();

        cy.get("input[type='number']")
            .clear()
            .type("25");

        cy.get("input[type='number']")
            .should("have.value", "25");
    });

    it("Allows role to be changed", () => {

        cy.contains("Edit User")
            .first()
            .click();

        cy.get("select")
            .select("Admin");

        cy.get("select")
            .should("have.value", "2");
    });

    it("Closes Edit User modal", () => {

        cy.contains("Edit User")
            .first()
            .click();

        cy.contains("Close")
            .click();

        cy.get("input[type='number']")
            .should("not.exist");
    });

    it("Displays Manage Requests button", () => {

        cy.contains("Manage Requests")
            .should("exist");
    });

    it("Navigates to employee requests page", () => {

        cy.contains("Manage Requests")
            .first()
            .should("exist");

        cy.contains("Manage Requests")
            .first()
            .click();

        cy.url()
            .should("include", "/adminactions/");
    });

});