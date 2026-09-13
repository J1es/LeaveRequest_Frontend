describe("Admin Add User Page", () => {

    beforeEach(() => {
        cy.loginAdmin();
        cy.visit("http://localhost:5173/adminactions/adduser");
    });

    it("Displays Add New User page", () => {

        cy.contains("Add New User")
            .should("exist");
    });

    it("Displays all form fields", () => {

        cy.get("input[name='firstName']")
            .should("exist");

        cy.get("input[name='surname']")
            .should("exist");

        cy.get("input[name='email']")
            .should("exist");

        cy.get("input[name='password']")
            .should("exist");

        cy.get("select[name='roleId']")
            .should("exist");
    });

    it("Allows user details to be entered", () => {

        cy.get("input[name='firstName']")
            .type("Test");

        cy.get("input[name='surname']")
            .type("User");

        cy.get("input[name='email']")
            .type("test@test.com");

        cy.get("input[name='password']")
            .type("Password123");

        cy.get("input[name='firstName']")
            .should("have.value", "Test");

        cy.get("input[name='surname']")
            .should("have.value", "User");

        cy.get("input[name='email']")
            .should("have.value", "test@test.com");

        cy.get("input[name='password']")
            .should("have.value", "Password123");
    });

    it("Shows error when first name is missing", () => {

        cy.get("input[name='surname']")
            .type("User");

        cy.get("input[name='email']")
            .type("test@test.com");

        cy.get("input[name='password']")
            .type("Password123");

        cy.contains("Submit")
            .click();

        cy.contains("First Name is Required")
            .should("exist");
    });

    it("Shows error when surname is missing", () => {

        cy.get("input[name='firstName']")
            .type("Test");

        cy.get("input[name='email']")
            .type("test@test.com");

        cy.get("input[name='password']")
            .type("Password123");

        cy.contains("Submit")
            .click();

        cy.contains("Surname is Required")
            .should("exist");
    });

    it("Shows error when email is missing", () => {

        cy.get("input[name='firstName']")
            .type("Test");

        cy.get("input[name='surname']")
            .type("User");

        cy.get("input[name='password']")
            .type("Password123");

        cy.contains("Submit")
            .click();

        cy.contains("Email is Required")
            .should("exist");
    });

    it("Shows error when password is missing", () => {

        cy.get("input[name='firstName']")
            .type("Test");

        cy.get("input[name='surname']")
            .type("User");

        cy.get("input[name='email']")
            .type("test@test.com");

        cy.contains("Submit")
            .click();

        cy.contains("Password is Required")
            .should("exist");
    });

});