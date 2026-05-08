import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { login, verifyToken } from "./auth.service";

describe("Auth Service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("login", () => {
    it("should successfully log in with correct credentials", async () => {
      const loginPromise = login("admin@taskflow.com", "admin123");
      await vi.runAllTimersAsync();
      const response = await loginPromise;

      expect(response.message).toBe("Login berhasil");
      expect(response.data.user.email).toBe("admin@taskflow.com");
      expect(response.data.token).toBeDefined();
    });

    it("should fail to log in with incorrect credentials", async () => {
      let error: any;
      login("wrong@test.com", "wrong123").catch((e) => { error = e; });
      await vi.runAllTimersAsync();
      
      expect(error).toEqual({
        message: "Email atau password salah",
        status: 401,
      });
    });
  });

  describe("verifyToken", () => {
    it("should successfully verify correct token", async () => {
      const loginPromise = login("admin@taskflow.com", "admin123");
      await vi.runAllTimersAsync();
      const { data } = await loginPromise;

      const verifyPromise = verifyToken(data.token);
      await vi.runAllTimersAsync();
      const verifyResponse = await verifyPromise;

      expect(verifyResponse.message).toBe("Token valid");
      expect(verifyResponse.data).toBe(true);
    });

    it("should fail to verify incorrect token", async () => {
      let error: any;
      verifyToken("invalid_token").catch((e) => { error = e; });
      await vi.runAllTimersAsync();
      
      expect(error).toEqual({
        message: "Token tidak valid",
        status: 401,
      });
    });
  });
});
