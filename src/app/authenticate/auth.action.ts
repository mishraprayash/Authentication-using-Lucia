"use server";

import { z } from "zod";
import { SignUpFormSchema } from "./SignUpForm";
import { prisma } from "@/lib/prisma";

import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { SignInFormSchema } from "./SignInForm";
import { generateCodeVerifier, generateState } from "arctic";
import { googleOAuthClient } from "@/lib/googleOAuth";

export const signup = async (values: z.infer<typeof SignUpFormSchema>) => {
  try {
    // if user already exists, throw an error
    const existingUser = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });
    if (existingUser) {
      return { error: "User already exists", success: false };
    }
    // hash password
    const hashedPassword = await new Argon2id().hash(values.password);

    // create user
    const user = await prisma.user.create({
      data: {
        name: values.name,
        email: values.email,
        hashedPassword,
      },
    });
    if (!user) {
      return { error: "Failed to create user", success: false };
    }
    const session = await lucia.createSession(user.id, {});
    if (!session) {
      return { error: "Failed to created session", success: false };
    }
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true, user };
  } catch (error) {
    console.log(error);
    return { error: "Something wrong", success: false };
  }
};

export const signin = async (values: z.infer<typeof SignInFormSchema>) => {

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });
    if (!user || !user.hashedPassword) {
      return { error: "Invalid Credentials", success: false };
    }
    const passwordMatch = await new Argon2id().verify(
      user.hashedPassword,
      values.password
    );
    if (!passwordMatch) {
      return { error: "Invalid credentials", success: false };
    }
    const sesssion = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(sesssion.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true, user };
  } catch (error) {
    console.log(error);
    return { error: "Something wrong", success: false };
  }
};

export const logout = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value || null;
  if (!sessionId) {
    return { error: "No session found", success: false };
  }
  const sessionCookie = await lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return { success: true, message: "Logged out successfully" };
};

export const getGoogleOauthConsentUrl = async () => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    cookies().set("c_v", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    cookies().set("_s", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    // generating the consent url
    const authUrl = await googleOAuthClient.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: ["email", "profile"],
      }
    );
    // This will be the url for the consent page where the user will be asked to sign in and give consent to the app
    // https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&client_id=638813626460-8j3o6ba2ohhvbjkrs3m39reljc6lf830.apps.googleusercontent.com&state=Xb5NBph-ndrImcwWG0Pya-Xz6-fgoIO-VPt0HFrhL24&scope=email%20profile%20openid&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgoogle%2Fcallback&code_challenge=Z3uDBvRgquciT_-nKDG7y9hnAltoykIeZFMk0fdLocE&code_challenge_method=S256&service=lso&o2v=2&ddm=0&flowName=GeneralOAuthFlow

    return { success: true, url: authUrl.toString() };
  } catch (error) {
    console.log(error);
    return { error: "Something wrong", success: false };
  }
};
