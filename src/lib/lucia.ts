import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "./prisma";
import { cookies } from "next/headers";

// creating a new instance of the PrismaAdapter using session and user models
const adapter = new PrismaAdapter(prisma.session, prisma.user);

// creating a new instance of Lucia with the adapter and sessionCookie options
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "a_t", // this is the sessionCookieName used below
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});


// function to get the user by validating the session
export const getUser = async () => {
  // we get the session id from the cookies
  const sessionId = cookies().get(lucia.sessionCookieName)?.value || null;
  if (!sessionId) return null;

  // lucia will validate the session and return the user and session 
  const { user, session } = await lucia.validateSession(sessionId);

  try {
    if(session && session.fresh){
      // if the session in the server is fresh, we can create a new session cookie
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if(!session){
      const sessionCookie = await lucia.createBlankSessionCookie();
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
  } catch (error) {
    console.error("error", error);
  }
  // the user above we get from validating the session only gives us the user id
  // based on user id we can get the user details from the database
  const dbUser = await prisma.user.findUnique({
    where:{
      id:user?.id
    },
    select:{
      name:true,
      email:true
    }
  })
  return dbUser;
 
};
