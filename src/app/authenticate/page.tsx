import React from "react";
import TabSwitcher from "@/components/TabSwitcher";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm"


const AuthenticatePage = () => {
  return <div className="relative flex w-full h-screen bg-background">
    <div className="absolute max-w-4xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
    <TabSwitcher SignInTab={<SignInForm/>} SignUpTab={<SignUpForm/>}/>
    </div>
  </div>;
};

export default AuthenticatePage;
