"use client";

import { getGoogleOauthConsentUrl } from "@/app/authenticate/auth.action";
import { Button } from "./ui/button";

import { RiGoogleFill } from "@remixicon/react";
import { toast } from "sonner";

const GoogleOAuthButton = () => {

  const handleClick = async () => {
    const response = await getGoogleOauthConsentUrl();
    if (response.success && response.url) {
      window.location.href = response.url;
    } else {
      toast.error("Something went wrong");
    }
  };
  return (
    <Button className="my-5" onClick={handleClick}>
      <RiGoogleFill className="h-4 w-4 mr-1" />
      Sign in with Google
    </Button>
  );
};

export default GoogleOAuthButton;
