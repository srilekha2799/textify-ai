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

      await supabase.auth.signOut();

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            "https://textify-ai-eight.vercel.app/auth/callback",

          skipBrowserRedirect: false,
        },
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

      bg-[#EEF4FF]

      transition-all
      duration-300

      dark:bg-[#020817]

      px-4
    "
    >

      <div
        className="
        w-full
        max-w-md

        rounded-[32px]

        border
        border-gray-200

        bg-white

        p-8

        shadow-2xl

        transition-all
        duration-300

        dark:border-zinc-800
        dark:bg-[#0F172A]
      "
      >

        {/* Heading */}
        <div className="text-center">

          <h1
            className="
            text-4xl
            font-extrabold

            text-[#233B95]

            dark:text-[#8FB3FF]
          "
          >
            Create Account
          </h1>

          <p
            className="
            mt-2

            text-sm

            text-gray-500

            dark:text-zinc-400
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

            rounded-2xl

            border
            border-gray-300

            bg-[#F8FAFC]

            px-4

            text-gray-800

            outline-none

            transition-all

            placeholder:text-gray-400

            focus:border-[#5B7CFA]
            focus:ring-4
            focus:ring-[#5B7CFA]/20

            dark:border-zinc-700
            dark:bg-[#111827]
            dark:text-white
            dark:placeholder:text-zinc-500
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

            rounded-2xl

            border
            border-gray-300

            bg-[#F8FAFC]

            px-4

            text-gray-800

            outline-none

            transition-all

            placeholder:text-gray-400

            focus:border-[#5B7CFA]
            focus:ring-4
            focus:ring-[#5B7CFA]/20

            dark:border-zinc-700
            dark:bg-[#111827]
            dark:text-white
            dark:placeholder:text-zinc-500
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

            rounded-2xl

            border
            border-gray-300

            bg-[#F8FAFC]

            px-4

            text-gray-800

            outline-none

            transition-all

            placeholder:text-gray-400

            focus:border-[#5B7CFA]
            focus:ring-4
            focus:ring-[#5B7CFA]/20

            dark:border-zinc-700
            dark:bg-[#111827]
            dark:text-white
            dark:placeholder:text-zinc-500
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

            rounded-2xl

            bg-gradient-to-r
            from-[#5B7CFA]
            to-[#6D8BFF]

            py-3

            text-lg
            font-semibold
            text-white

            transition-all
            duration-300

            hover:scale-[1.02]
            hover:from-[#4A68E8]
            hover:to-[#5B7CFA]

            hover:shadow-lg
            hover:shadow-[#5B7CFA]/30

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

              dark:bg-zinc-700
            "
            ></div>

            <span
              className="
              text-sm

              text-gray-500

              dark:text-zinc-500
            "
            >
              OR
            </span>

            <div
              className="
              h-px
              flex-1

              bg-gray-300

              dark:bg-zinc-700
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

            rounded-2xl

            border
            border-gray-300

            bg-white

            font-medium
            text-gray-700

            transition-all

            hover:bg-gray-100
            hover:scale-[1.01]

            dark:border-zinc-700
            dark:bg-[#111827]
            dark:text-white
            dark:hover:bg-zinc-800

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

          dark:text-zinc-400
        "
        >

          Already have an account?{" "}

          <Link
            href="/login"

            className="
            font-semibold

            text-[#5B7CFA]

            hover:underline

            dark:text-[#8FB3FF]
          "
          >
            Login
          </Link>

        </p>

      </div>

    </main>
  );
}