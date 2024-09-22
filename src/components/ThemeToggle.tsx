"use client";

import { useEffect, useState } from "react";
import { RiLightbulbFill } from "@remixicon/react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  //   change body to dark or light
  useEffect(() => {
    if (theme === "dark") {
      //  change the css of body to dark
      document.body.classList.add("makedark");
    } else {
      document.body.classList.remove("makedark");
    }
  }, [theme]);

  return (
    <Button variant="outline" className={`md:absolute top-0 right-[50px] `}>
      <RiLightbulbFill
        className={`text-black duration-500 h-8 w-8 ${
          theme === "dark" ? `opacity-50` : `opacity-100`
        }`}
        onClick={toggleTheme}
      />
    </Button>
  );
};

export default ThemeToggle;
