import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import express from "express";
import { app } from "../../src/app";
import { jest } from "@jest/globals";
import { login } from "controllers/authController";
import router from "routes/auth";

jest.mock("jsonwebtoken");
jest.mock("../../src/controllers/authController", () => ({
  login: jest.fn(),
}));

jest.mock("../../src/utilities", () => ({
  startServer: jest.fn(() => Promise.resolve()),
  initializeDatabase: jest.fn(() => Promise.resolve()),
  upload: {
    single: jest.fn(
      (fieldName) => (req: any, res: any, next: () => any) => next()
    ),
  },
}));

app.use(express.urlencoded({ extended: false }));
app.use(router);

describe("Login Routes GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should render the login page with or without an error message", async () => {
    let response = await request(app).get("/login");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Login");
    expect(response.text).not.toContain("Error");

    response = await request(app).get("/login?error=Invalid credentials");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Login");
    expect(response.text).toContain("Invalid credentials");
  });

  it("should not render the admin page when not logged in", async () => {
    const response = await request(app).get("/admin");
    expect(response.status).toBe(401);
    expect(response.text).toContain("Unauthorized");
  });

  it("should not render the presentation edit page when not logged in", async () => {
    const response = await request(app).get("/admin/presentation");
    expect(response.status).toBe(401);
    expect(response.text).toContain("Unauthorized");
  });

  it("should not render the project add page when not logged in", async () => {
    const response = await request(app).get("/admin/project");
    expect(response.status).toBe(401);
    expect(response.text).toContain("Unauthorized");
  });

  it("should not render the skill add page when not logged in", async () => {
    const response = await request(app).get("/admin/skill");
    expect(response.status).toBe(401);
    expect(response.text).toContain("Unauthorized");
  });

  it("should render the admin page when logged in", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Cookie", "token=valid-token");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Admin area");
  });

  it("should render the presentation edit page when logged in", async () => {
    const response = await request(app)
      .get("/admin/presentation")
      .set("Cookie", "token=valid-token");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Edit presentation");
  });

  it("should render the skill add page when logged in", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Cookie", "token=valid-token");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Add skill");
  });

  it("should render the project add page when logged in", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Cookie", "token=valid-token");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Add project");
  });
});

describe("Login Routes POST", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should redirect to /admin and set a cookie on successful login', async () => {
    const mockToken: string = "valid";
    (login as jest.MockedFunction<typeof login>).mockResolvedValue(mockToken);

    const response = await request(app)
      .post("/login")
      .send({ username: "admin", password: "password" });

      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/admin');
      expect(response.headers['set-cookie']).toBeDefined();

      const cookie = response.headers['set-cookie'][0];
      expect(cookie).toContain('token=valid');
      expect(cookie).toContain('HttpOnly');
      expect(cookie).toContain('SameSite=Strict');
  });

  it('should redirect to /login with error message if login fails', async () => {
    const errorMessage = 'Invalid credentials';
    
    (login as jest.MockedFunction<typeof login>).mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .post('/login')
      .send({ name: 'wronguser', password: 'wrongpassword' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(`/login?error=${encodeURIComponent(errorMessage)}`);
  });

  it('should redirect to /login with error message if SECRET_KEY is missing', async () => {
    const errorMessage = 'Internal server error';
  
    (login as jest.MockedFunction<typeof login>).mockRejectedValue(new Error(errorMessage));

    const response = await request(app)
      .post('/login')
      .send({ name: 'testuser', password: 'password' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(`/login?error=${encodeURIComponent(errorMessage)}`);
  });
});

