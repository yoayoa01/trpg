import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MyPage from "@/components/MyPage";

export default async function Page() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return <MyPage />;
}
