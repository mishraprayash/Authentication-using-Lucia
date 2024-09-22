import Link from "next/link";

import { introduction } from "./introdcution";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 justify-center items-center m-5 relative">
      <ThemeToggle />
      <div className="sm:text-4xl text-2xl font-semibold">
        Hello this is <b className="text-green-500">Next.js</b> App
      </div>
      <div className="max-w-[700px] flex flex-col gap-5 items-start justify-center">
        <div className="text-wrap">{introduction.description}</div>
        <div className="sm:text-[24px] text-xl font-mono font-semibold mx-auto">
          {introduction.title}
        </div>
        <div className=" bg-[#0000004b] px-5 py-4 rounded w-[100%]">
          {introduction.stack.map((item, index) => {
            return (
              <li
                className="flex gap-5 items-center font-bold text-[18px] border-b-2 border-gray-700"
                key={index}
              >
                <div className="hover:text-blue-600 px-3 py-2 duration-500 ">
                  <Link
                    href={item.link}
                    target="_blank"
                    className="hover:border-b-2 border-blue-700 "
                  >
                    {item.name}
                  </Link>
                </div>
                <div className="text-md font-extralight mx-auto hover:font-medium duration-700 cursor-auto text-opacity-100">
                  {item.purpose}
                </div>
              </li>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <Link
          href="/authenticate"
          className="capitalize bg-[#dbd4c6] text-black font-semibold rounded px-3 py-2 hover:bg-[#E0D6B7]"
        >
          signIn/signUp page
        </Link>
        <Link
          href="/dashboard"
          className="capitalize bg-[#dbd4c6] text-black font-semibold rounded px-3 py-2 hover:bg-[#E0D6B7]"
        >
          dashboard page
        </Link>
      </div>
    </div>
  );
}
