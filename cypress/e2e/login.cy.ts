describe("Login Page", () => {

  beforeEach(() => {
    cy.visit("http://localhost:5173/login");
  });

  it("Allows entering an email address", () => {
    cy.get('input[name="email"]')
      .type("admin@email.com");

    cy.get('input[name="email"]')
      .should("have.value", "admin@email.com");
  });

  it("Allows entering a password", () => {
    cy.get('input[name="password"]')
      .type("admin12345");

    cy.get('input[name="password"]')
      .should("have.value", "admin12345");
  });

  it("Requires an email address", () => {
    cy.get('input[name="password"]')
      .type("admin12345");

    cy.contains("button", "Sign In")
      .click();

    cy.get('input[name="email"]:invalid')
      .should("exist");
  });

  it("Requires a password", () => {
    cy.get('input[name="email"]')
      .type("admin@email.com");

    cy.contains("button", "Sign In")
      .click();

    cy.get('input[name="password"]:invalid')
      .should("exist");
  });

  it("Shows an error for invalid credentials", () => {
    cy.get('input[name="email"]')
      .type("invalid@email.com");

    cy.get('input[name="password"]')
      .type("invalidpassword");

    cy.contains("button", "Sign In")
      .click();

    cy.contains("Login failed (Status: 500)")
    .should("exist");
  });

  it("Logs in successfully", () => {
    cy.get('input[name="email"]')
      .type("staff-test@email.com");

    cy.get('input[name="password"]')
      .type("staff-test");

    cy.contains("button", "Sign In")
      .click();

    cy.url()
      .should("eq", "http://localhost:5173/");
  });
});