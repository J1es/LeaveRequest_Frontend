describe("Dashboard Page - Staff", () => {

    beforeEach(() => {
        cy.loginStaff();
    });

    it("Shows leave balance", () => {
        cy.contains("Leave Balance");
        cy.contains("days");
    });

    it("Staff should have access to Request Leave", () => {
        cy.contains("Request Leave")
            .should("exist");

        cy.contains("Request Leave")
            .click();

        cy.url()
            .should("include", "http://localhost:5173/requestleave");
    });

    it("Staff should have access to My Requests", () => {
        cy.contains("My Requests")
            .should("exist");

        cy.contains("My Requests")
            .click();

        cy.url()
            .should("include", "http://localhost:5173/myrequests");
    });

    it("Staff should not have access to Manager Actions", () => {
        cy.visit("http://localhost:5173/myteam")

        cy.url()
            .should("not.include", "/myteam");
    });

    it("Staff should not have access to Admin Actions", () => {
        cy.visit("http://localhost:5173/adminactions")


        cy.url()
            .should("not.include", "/adminactions");
    });

});

describe("Dashboard Page - Manager", () => {

    beforeEach(() => {
        cy.loginManager();
    });

    it("Shows leave balance", () => {
        cy.contains("Leave Balance");
        cy.contains("days");
    });

    it("Manager should have access to Request Leave", () => {
        cy.contains("Request Leave")
            .should("exist");

        cy.contains("Request Leave")
            .click();

        cy.url()
            .should("include", "http://localhost:5173/requestleave");
    });

    it("Manager should have access to My Requests", () => {
        cy.contains("My Requests")
            .should("exist");

        cy.contains("My Requests")
            .click();

        cy.url()
            .should("include", "http://localhost:5173/myrequests");
    });

    it("Manager should have access to My Teams", () => {
        cy.contains("Manager Actions")
            .should("exist");

        cy.contains("Manager Actions")
            .click();

        cy.url()
            .should("include", "http://localhost:5173/myteam");
    });

        it("Manager should not have access to Admin Actions", () => {
        cy.visit("http://localhost:5173/adminactions")

        cy.url()
            .should("not.include", "/adminactions");
    });

});

describe("Dashboard Page - Admin", () => {

    beforeEach(() => {
        cy.loginAdmin();
    });

    it("Shows leave balance", () => {
        cy.contains("Leave Balance");
        cy.contains("days");
    });

    it("Admin should have access to Request Leave", () => {
        cy.contains("Request Leave")
            .should("exist");

        cy.contains("Request Leave")
            .click();

        cy.url()
            .should("include", "http://localhost:5173/requestleave");
    });

    it("Admin should have access to My Requests", () => {
        cy.contains("My Requests")
            .should("exist");

        cy.contains("My Requests")
            .click();

        cy.url()
            .should("include", "http://localhost:5173/myrequests");
    });

    it("Admin should have access to Admin Actions", () => {
        cy.contains("Admin Actions")
            .should("exist");

        cy.contains("Admin Actions")
            .click();

        cy.url()
            .should("include", "http://localhost:5173/adminactions");
    });
});