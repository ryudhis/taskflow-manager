import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as authService from "../api/auth.service";
import { useAuthStore } from "../stores/auth.store";
import type { ApiError } from "../types";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (response) => {
      setSession(response.data.user, response.data.token);
      toast.success(response.message);
      navigate("/", { replace: true });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Login gagal");
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();

  return () => {
    clearSession();
    toast.success("Berhasil logout");
    navigate("/login", { replace: true });
  };
}
