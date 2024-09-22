import { Google } from "arctic";

// Initialize the Google OAuth client

// ! means that we are sure that the variable is not null
export const googleOAuthClient = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.DOMAIN + "/api/auth/google/callback"
);

