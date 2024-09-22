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
    <>
      <div>
        Your are logged in as {user.name} with an email {user.email}
      </div>
      <SignOutButton>Sign Out</SignOutButton>
    </>
  );
};
export default DashboardPage;
