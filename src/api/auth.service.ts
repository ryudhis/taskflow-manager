import type { AuthSession, ApiResponse, ApiError } from "../types";

const MOCK_USER = {
  id: "usr_1",
  name: "Admin",
  email: "admin@taskflow.com",
};

const MOCK_PASSWORD = "admin123";
const MOCK_TOKEN = "tf_mock_token_" + btoa("admin@taskflow.com");

function delay(ms?: number): Promise<void> {
  const duration = ms ?? Math.floor(Math.random() * 200) + 800;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export async function login(
  email: string,
  password: string
): Promise<ApiResponse<AuthSession>> {
  await delay();

  if (email !== MOCK_USER.email || password !== MOCK_PASSWORD) {
    const error: ApiError = {
      message: "Email atau password salah",
      status: 401,
    };
    throw error;
  }

  return {
    data: {
      user: MOCK_USER,
      token: MOCK_TOKEN,
    },
    message: "Login berhasil",
  };
}

export async function verifyToken(
  token: string
): Promise<ApiResponse<boolean>> {
  await delay(300);

  if (token !== MOCK_TOKEN) {
    const error: ApiError = {
      message: "Token tidak valid",
      status: 401,
    };
    throw error;
  }

  return {
    data: true,
    message: "Token valid",
  };
}
