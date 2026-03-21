// Force dynamic rendering — requires auth at runtime
export const dynamic = "force-dynamic";

import DashboardContent from "./DashboardClient";

export default function DashboardPage() {
  return <DashboardContent />;
}
