import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../db/index";

export default function setupPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
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

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
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