import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";

describe("Auth Store", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it("should have correct initial state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should set session correctly", () => {
    const mockUser = { id: "1", name: "Admin", email: "admin@test.com" };
    const mockToken = "mock_token";

    useAuthStore.getState().setSession(mockUser, mockToken);
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
  });

  it("should clear session correctly", () => {
    useAuthStore.getState().setSession(
      { id: "1", name: "Admin", email: "admin@test.com" },
      "mock_token"
    );

    useAuthStore.getState().clearSession();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
