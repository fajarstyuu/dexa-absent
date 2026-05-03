import { LoginForm } from "@/components/login/login-form";

export function LoginPage() {
  return (
    <div className="flex min-h-[calc(100svh-8rem)] flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-background/60 text-center">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
