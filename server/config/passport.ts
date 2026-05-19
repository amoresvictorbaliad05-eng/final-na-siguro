import * as passportModule from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../db/index";

// Safety fallback to handle Passport's CommonJS export in an ESM runtime environment
const passport: any = (passportModule as any).default || passportModule;

export default function setupPassport() {
  // Safe validation fallback to prevent Strategy from crashing the server if missing in Render
  const clientId = process.env.GOOGLE_CLIENT_ID || "MISSING_GOOGLE_CLIENT_ID";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "MISSING_GOOGLE_CLIENT_SECRET";
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback";

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
      },

      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;

          if (!email) {
            return done(null, false);
          }

          // Check if user exists
          const userResult = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
          );

          let user = userResult.rows[0];

          // Create user if not existing
          if (!user) {
            const newUser = await pool.query(
              `
              INSERT INTO users
              (name,email,role,is_verified)
              VALUES ($1,$2,'citizen',true)
              RETURNING *
              `,
              [name, email]
            );

            user = newUser.rows[0];
          }

          return done(null, user);

        } catch (err) {
          console.error("Google auth error:", err);
          return done(err, false);
        }
      }
    )
  );

  // Explicitly typed 'done' to clear TypeScript errors
  passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
    done(null, user.id);
  });

  // Explicitly typed 'done' to clear TypeScript errors
  passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE id=$1",
        [id]
      );

      done(null, result.rows[0]);

    } catch (err) {
      done(err, null);
    }
  });
}