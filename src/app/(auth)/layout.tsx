import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";

async function Layout({ children }: { children: React.ReactNode }) {
  const token = await getToken();
  if (token) {
    redirect("/dashboard");
  }
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

export default Layout;
