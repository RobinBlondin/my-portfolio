module.exports = {
    sign: jest.fn(() => "mocked-jwt-token"),
    verify: jest.fn(() => ({ userId: "mocked-user-id" })),
    decode: jest.fn(() => ({ userId: "mocked-user-id" })),
  };
  