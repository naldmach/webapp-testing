import { test, expect } from "../../src/base/base-test";

test.describe("Authentication API Tests", () => {
  let authToken: string;

  test("POST /auth/login - successful login", async ({ apiTesting }) => {
    const response = await apiTesting.post(
      "/auth/login",
      {
        username: "testuser@example.com",
        password: "testpassword123",
      },
      {
        expectedStatus: 200,
      }
    );

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
    expect(response.user).toHaveProperty("id");
    expect(response.user).toHaveProperty("email");

    authToken = response.token;
  });

  test("POST /auth/login - invalid credentials", async ({ apiTesting }) => {
    const response = await apiTesting.post(
      "/auth/login",
      {
        username: "invalid@example.com",
        password: "wrongpassword",
      },
      {
        expectedStatus: 401,
      }
    );

    expect(response).toHaveProperty("error");
    expect(response.error).toContain("Invalid credentials");
  });

  test("POST /auth/register - successful registration", async ({
    apiTesting,
  }) => {
    const uniqueEmail = `test${Date.now()}@example.com`;

    const response = await apiTesting.post(
      "/auth/register",
      {
        username: "newuser",
        email: uniqueEmail,
        password: "newpassword123",
      },
      {
        expectedStatus: 201,
      }
    );

    expect(response).toHaveProperty("user");
    expect(response.user.email).toBe(uniqueEmail);
  });

  test("POST /auth/register - duplicate email", async ({ apiTesting }) => {
    await apiTesting.post(
      "/auth/register",
      {
        username: "duplicate",
        email: "existing@example.com",
        password: "password123",
      },
      {
        expectedStatus: 409,
      }
    );
  });

  test("GET /auth/profile - with valid token", async ({ apiTesting }) => {
    // First login to get token
    const loginResponse = await apiTesting.post("/auth/login", {
      username: "testuser@example.com",
      password: "testpassword123",
    });

    const response = await apiTesting.authenticatedRequest(
      "GET",
      "/auth/profile",
      loginResponse.token
    );

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("username");
    expect(response).toHaveProperty("email");
  });

  test("GET /auth/profile - without token", async ({ apiTesting }) => {
    await apiTesting.get("/auth/profile", {
      expectedStatus: 401,
    });
  });

  test("POST /auth/logout - successful logout", async ({ apiTesting }) => {
    // First login to get token
    const loginResponse = await apiTesting.post("/auth/login", {
      username: "testuser@example.com",
      password: "testpassword123",
    });

    await apiTesting.authenticatedRequest(
      "POST",
      "/auth/logout",
      loginResponse.token
    );
  });

  test("API performance test - login endpoint", async ({ apiTesting }) => {
    const performanceResults = await apiTesting.testPerformance("/auth/login", {
      method: "POST",
      data: {
        username: "testuser@example.com",
        password: "testpassword123",
      },
      maxResponseTime: 1000,
      iterations: 5,
    });

    console.log("Login API Performance:", performanceResults);
    expect(performanceResults.averageTime).toBeLessThan(1000);
  });

  test("Batch authentication requests", async ({ apiTesting }) => {
    const requests = [
      {
        method: "POST" as const,
        endpoint: "/auth/login",
        data: { username: "user1@example.com", password: "password123" },
      },
      {
        method: "POST" as const,
        endpoint: "/auth/login",
        data: { username: "user2@example.com", password: "password123" },
      },
      {
        method: "POST" as const,
        endpoint: "/auth/login",
        data: { username: "user3@example.com", password: "password123" },
      },
    ];

    const responses = await apiTesting.batchRequests(requests);

    expect(responses).toHaveLength(3);
    responses.forEach((response) => {
      expect(response).toHaveProperty("token");
    });
  });

  test("Schema validation test", async ({ apiTesting }) => {
    const response = await apiTesting.post("/auth/login", {
      username: "testuser@example.com",
      password: "testpassword123",
    });

    const expectedSchema = {
      token: "string",
      user: {
        id: "string",
        username: "string",
        email: "string",
        createdAt: "string",
      },
    };

    await apiTesting.validateSchema(response, expectedSchema);
  });
});
