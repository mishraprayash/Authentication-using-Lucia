// We can create like this as well without passing props from the component
"use client";


import { Button } from "./ui/button";
import { logout } from "@/app/authenticate/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// const SignOutButton = () => {
//   const router = useRouter();
//   const handleSignOut = () => {
//     const response = logout();
//     if (response.success) {
//       router.push('/authenticate');
//       toast.success(response.message);
//     }
//   };
//   return <Button onClick={handleSignOut}>Sign Out</Button>;
// };

// export default SignOutButton;



// we can also implement like this by passing props from the component

type Props = {
  children: React.ReactNode;
};

const SignOutButton = ({ children }: Props) => {
    const router = useRouter();
    const handleLogout = async ()=>{
        const response = await logout();
        if(response.success){
            toast.success(response.message);
            router.push('/authenticate');
        }
    }

  return <Button onClick={handleLogout}>{children}</Button>;
};
export default SignOutButton;
