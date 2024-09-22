import TabSwitcher from "@/components/TabSwitcher";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import GoogleOAuthButton from "@/components/GoogleOAuthButton";
import Link from "next/link";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";

const AuthenticatePage = async () => {
  const user = await getUser();
  if (user) redirect("/dashboard");
  return (
    <div className="relative flex w-full h-screen bg-background">
      <div className="absolute max-w-4xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ">
        <TabSwitcher SignInTab={<SignInForm />} SignUpTab={<SignUpForm />} />
        <div className="text-center">
          <GoogleOAuthButton />
        </div>
        <div className="text-center">
          <Link
            href="/"
            className="px-3 py-2 bg-blue-800 hover:bg-blue-600 text-white rounded"
          >
            Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatePage;
