"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

import { supabase } from "@/lib/supabase";

export default function SignupPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  // Email Signup
  const handleSignup = async () => {

    if (
      password !== confirmPassword
    ) {

      alert(
        "Passwords do not match"
      );

      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    setLoading(false);

    if (error) {

      alert(error.message);

    } else {

      router.push("/homepage");
    }
  };

  // Google Signup
  const handleGoogleSignup =
    async () => {

      setLoading(true);

      // Clear old session
      await supabase.auth.signOut();

      // Google verifies automatically
      // If account is real,
      // Supabase creates user automatically

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://textify-ai-eight.vercel.app/auth/callback",
          skipBrowserRedirect: false,
        }
      });

      setLoading(false);
    };

  return (

    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-blue-50
      via-white
      to-indigo-100
      dark:from-[#020617]
      dark:via-[#0B1120]
      dark:to-[#172554]
      px-4
    "
    >

      <div
        className="
        w-full
        max-w-md
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-8
        shadow-2xl

        dark:border-white/20
        dark:bg-white/10
        dark:backdrop-blur-xl
      "
      >

        {/* Heading */}
        <div className="text-center">

          <h1
            className="
            text-4xl
            font-bold
            text-blue-900
            dark:text-white
          "
          >
            Create Account ✨
          </h1>

          <p
            className="
            mt-2
            text-sm
            text-gray-500
            dark:text-gray-400
          "
          >
            Join Textify AI and
            simplify smarter
          </p>

        </div>

        {/* Form */}
        <div className="mt-8 space-y-4">

          {/* Email */}
          <input
            type="email"
            placeholder="Enter your email"
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-300
              bg-gray-100
              px-4
              text-black
              outline-none
              transition-all
              placeholder:text-gray-500
              focus:border-[#4F6EF7]
              focus:ring-2
              focus:ring-[#4F6EF7]/30

              dark:border-white/20
              dark:bg-white/5
              dark:text-white
              dark:placeholder:text-gray-400
            "
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Create password"
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-300
              bg-gray-100
              px-4
              text-black
              outline-none
              transition-all
              placeholder:text-gray-500
              focus:border-[#4F6EF7]
              focus:ring-2
              focus:ring-[#4F6EF7]/30

              dark:border-white/20
              dark:bg-white/5
              dark:text-white
              dark:placeholder:text-gray-400
            "
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          {/* Confirm Password */}
          <input
            type="password"
            placeholder="Confirm password"
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-300
              bg-gray-100
              px-4
              text-black
              outline-none
              transition-all
              placeholder:text-gray-500
              focus:border-[#4F6EF7]
              focus:ring-2
              focus:ring-[#4F6EF7]/30

              dark:border-white/20
              dark:bg-white/5
              dark:text-white
              dark:placeholder:text-gray-400
            "
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-[#4F6EF7]
              py-3
              text-lg
              font-semibold
              text-white
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:bg-[#3D5CE6]
              hover:shadow-lg
              hover:shadow-blue-500/30
              disabled:opacity-70
            "
          >

            {loading
              ? "Loading..."
              : "Sign Up"}

          </button>

          {/* Divider */}
          <div
            className="
            flex
            items-center
            gap-3
            py-2
          "
          >

            <div
              className="
              h-px
              flex-1
              bg-gray-300
              dark:bg-white/20
            "
            ></div>

            <span
              className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
            >
              OR
            </span>

            <div
              className="
              h-px
              flex-1
              bg-gray-300
              dark:bg-white/20
            "
            ></div>

          </div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-3
              rounded-xl
              border
              border-gray-300
              bg-white
              font-medium
              text-black
              transition-all
              hover:bg-gray-100

              dark:border-white/20
              dark:bg-white

              disabled:opacity-70
            "
          >

            <FcGoogle className="text-2xl" />

            Continue with Google

          </button>

        </div>

        {/* Login Link */}
        <p
          className="
          mt-6
          text-center
          text-sm
          text-gray-500
          dark:text-gray-400
        "
        >

          Already have an account?{" "}

          <Link
            href="/login"
            className="
              font-semibold
              text-[#4F6EF7]
              hover:underline
              dark:text-[#7EA6FF]
            "
          >
            Login
          </Link>

        </p>

      </div>

    </main>
  );
}