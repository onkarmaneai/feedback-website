import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "../../lib/auth";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  if (!requireAdmin()) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
