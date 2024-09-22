
export const introduction = {
  title: "Libraries and Frameworks used",
  description:
    "This is an app that demonstrates how to use Lucia package for authentication with username and password as well as OAuth2.0 using arctic library. The app has three pages: a home page which is the page you are currently in, an authentication page for sign-in and sign-up and a dashboard page which can be accessed by authenticated user.",
  stack: [
    {
      name: "Next.js",
      link: "https://nextjs.org/",
      purpose: "For creating the application frontend and backend",
    },
    {
      name: "ShadCn UI",
      link: "https://ui.shadcn.com/",
      purpose: "For different UI components",
    },
    {
      name: "Lucia",
      link: "https://lucia-auth.com/",
      purpose: "For handling sessions and authentcation mechanism",
    },
    { name: "Arctic", link: "https://arctic.js.org/", purpose: "For OAuth2.0" },
    {
      name: "Prisma",
      link: "https://www.prisma.io/",
      purpose: "It is an ORM providing support for different databases services",
    },
    {
        name:'zod',
        link:'https://zod.dev/',
        purpose:'For formschema validation on the client side'
    }
  ]
};
