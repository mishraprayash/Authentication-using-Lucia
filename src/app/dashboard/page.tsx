import SignOutButton from "@/components/SignOutButton";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";
import React from "react";

const DashboardPage = async () => {
  // protected!!!
  const user = await getUser();
  if (!user) {
    redirect("/authenticate");
  }
  return (
    <div className="text-center">
      <div className="p-5">
        Your are logged in as <b>{user.name}</b> with an <b>Email:</b> {user.email}
      </div>
      <SignOutButton>Sign Out</SignOutButton>
    </div>
  );
};
export default DashboardPage;
