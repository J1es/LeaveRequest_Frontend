describe("Request Leave", () => {

    beforeEach(() => {
        cy.loginStaff();
        cy.visit("http://localhost:5173/requestleave");
    });

    it("shows request leave form", () => {
        cy.contains("Leave Request Form");
    });

    it("has start date field", () => {
        cy.get('input[name="startdate"]')
            .should("exist");
    });

    it("has end date field", () => {
        cy.get('input[name="enddate"]')
            .should("exist");
    });

    it("has a default start date", () => {
        cy.get('input[name="startdate"]')
            .invoke("val")
            .should("not.be.empty");
    });

    it("has a submit button", () => {
        cy.contains("button", "Submit")
            .should("exist");
    });

    it("shows success message after redirect", () => {

        cy.get('input[name="startdate"]')
            .type("2099-11-05");

        cy.get('input[name="enddate"]')
            .type("2099-11-06");

        cy.contains("button", "Submit")
            .click();

        cy.url()
            .should("include", "/myrequests");

        cy.contains("Request Submitted")
            .should("be.visible");
    });

});