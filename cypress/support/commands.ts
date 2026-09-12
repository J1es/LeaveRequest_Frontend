/// <reference types="cypress" />

const loginURL: string = "http://localhost:5173/login";

Cypress.Commands.add("loginStaff", () => {
    cy.visit(loginURL);

    cy.get('input[name="email"]')
        .type("staff-test@email.com");

    cy.get('input[name="password"]')
        .type("staff-test");

    cy.contains("button", "Sign In")
        .click();

    cy.url().should("eq", "http://localhost:5173/");
});

Cypress.Commands.add("loginManager", () => {
    cy.visit(loginURL);

    cy.get('input[name="email"]')
        .type("manager-test@email.com");

    cy.get('input[name="password"]')
        .type("manager-test");

    cy.contains("button", "Sign In")
        .click();

    cy.url().should("eq", "http://localhost:5173/");
});

Cypress.Commands.add("loginAdmin", () => {
    cy.visit(loginURL);

    cy.get('input[name="email"]')
        .type("admin-test@email.com");

    cy.get('input[name="password"]')
        .type("admin-test");

    cy.contains("button", "Sign In")
        .click();

    cy.url().should("eq", "http://localhost:5173/");
});

//eslint-disable-next-line
declare namespace Cypress {
    interface Chainable {
        loginStaff(): Chainable<void>;
        loginManager(): Chainable<void>;
        loginAdmin(): Chainable<void>;
    }
}