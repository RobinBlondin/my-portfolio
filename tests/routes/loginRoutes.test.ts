import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import { app } from "../../src/app";
import { jest } from "@jest/globals";
import { userRepo } from "../../src/repositories";
import { User } from "entities/User";
import { Repository } from "typeorm";

jest.mock("jsonwebtoken");
jest.mock("../../src/controllers/authController");
jest.mock("../../src/repositories/userRepo");
jest.mock("../../src/utilities", () => ({
  startServer: jest.fn(() => Promise.resolve()),
  initializeDatabase: jest.fn(() => Promise.resolve()),
  upload: {
    single: jest.fn(
      (fieldName) => (req: any, res: any, next: () => any) => next()
    ),
  },
}));

const mockedUserRepo = mocked(userRepo, true);

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

    mockedUserRepo.findOneBy.mockResolvedValue({ id: 1, name: "admin", password: "password" });
  });

    it("should not login with invalid credentials", async () => {
        const response = await request(app)
        .post("/login")
        .send({ username: "admin", password: "invalid-password" })
        .redirects(1);

        expect(response.status).toBe(200);
        expect(response.text).toContain("Invalid credentials");
    });
});
function mocked(userRepo: Repository<User>, arg1: boolean) {
    throw new Error("Function not implemented.");
}

