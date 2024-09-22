import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { googleOAuthClient } from "@/lib/googleOAuth";
import { prisma } from "@/lib/prisma";
import { lucia } from "@/lib/lucia";

// expected user data from google
type GoogleUserData = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

// callback_url(dev-mode) ---> http://localhost:3000/api/auth/google/callback

const getUrl = (request: NextRequest) => {
  return request.nextUrl;
}

export async function GET(request: NextRequest) {
  const url = getUrl(request);
  try {
    // grabbing code and state from the url
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      return NextResponse.json({ error: "No code or state" }, { status: 400 });
    }

    // grabbing code_verifier and state from the cookies
    const codeVerifier = cookies().get("c_v")?.value || null;
    const stateCookie = cookies().get("_s")?.value || null;

    if (!codeVerifier || !stateCookie) {
      return NextResponse.json(
        { error: "No code_verifier or state cookie" },
        { status: 400 }
      );
    }
    // if the state from the url does not match the state from the cookie, we will return an error, this is used to prevent CSRF attacks
    if (state !== stateCookie) {
      return NextResponse.json({ error: "Invalid state" }, { status: 400 });
    }
    // validate the code and get the access token
    const { accessToken } = await googleOAuthClient.validateAuthorizationCode(
      code,
      codeVerifier
    );

    // fetching user data from google using the access token
    const googleResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // grabbing user data from google response
    const userDataFromGoole: GoogleUserData = await googleResponse.json();

    // if the email already exists in our database, we will create a session for the user and set the session cookie

    // if the email doesnot exist in our database, we will create a new user and then create a session for the user and set the session cookie

    let userId: string;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: userDataFromGoole.email,
      },
    });
    // if the user already exists, we will grab the user id
    if (existingUser) {
      userId = existingUser.id;
    } else {
      // if the user doesnot exist, we will create a new user
      const user = await prisma.user.create({
        data: {
          name: userDataFromGoole.name,
          email: userDataFromGoole.email,
          picture: userDataFromGoole.picture,
        },
      });
      userId = user.id;
    }
    // creating a session for the user based on the user id
    const session = await lucia.createSession(userId, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    // setting the session cookie
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    // finally redirect the user to the home page
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
