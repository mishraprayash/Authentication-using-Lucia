"use server";

import { z } from "zod";
import { SignUpFormSchema } from "./SignUpForm";
import { prisma } from "@/lib/prisma";

import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { SignInFormSchema } from "./SignInForm";

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
