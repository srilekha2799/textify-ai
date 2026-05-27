"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // Email Login
  const handleLogin = async () => {

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {

      alert(error.message);

    } else {

      router.push("/homepage");
    }
  };

  // Google Login
  const handleGoogleLogin =
    async () => {

      await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo:
            "https://textify-ai-eight.vercel.app/auth/callback",

          skipBrowserRedirect: false,
        }
      });
    };

  // Forgot Password
  const handleForgotPassword =
    async () => {

      if (!email) {

        alert(
          "Please enter your email first"
        );

        return;
      }

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email
        );

      if (error) {

        alert(error.message);

      } else {

        alert(
          "Password reset email sent!"
        );
      }
    };

  return (

    <main
      className="
      min-h-screen
      flex
      items-center
      justify-center

      bg-[#F4F7FF]
      dark:bg-[#020817]

      px-4
      transition-colors
      duration-300
    "
    >

      {/* Glow */}
      <div
        className="
        absolute
        inset-0
        overflow-hidden
        pointer-events-none
      "
      >

        <div
          className="
          absolute
          top-[-120px]
          left-[-100px]

          h-[320px]
          w-[320px]

          rounded-full
          bg-[#7C5CFF]/10
          blur-3xl

          dark:bg-[#5B7CFA]/20
        "
        />

        <div
          className="
          absolute
          bottom-[-140px]
          right-[-100px]

          h-[320px]
          w-[320px]

          rounded-full
          bg-[#5B7CFA]/10
          blur-3xl

          dark:bg-[#7C5CFF]/20
        "
        />

      </div>

      {/* Card */}
      <div
        className="
        relative
        z-10

        w-full
        max-w-md

        rounded-[32px]

        border
        border-[#DCE6FF]

        bg-white/90
        p-8

        shadow-[0_10px_40px_rgba(91,124,250,0.12)]

        backdrop-blur-xl

        dark:border-white/10
        dark:bg-[#0F172A]/80
        dark:shadow-[0_10px_40px_rgba(0,0,0,0.45)]

        transition-all
      "
      >

        {/* Heading */}
        <div className="text-center">

          <h1
            className="
            text-4xl
            font-extrabold

            text-[#233B95]

            dark:text-white
          "
          >
            Welcome Back
          </h1>

          <p
            className="
            mt-2
            text-sm

            text-[#6B7280]

            dark:text-[#94A3B8]
          "
          >
            Login to continue simplifying smarter
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
              border-[#D6E0FF]

              bg-[#F8FAFF]

              px-4

              text-[#1E293B]

              outline-none
              transition-all

              placeholder:text-[#94A3B8]

              focus:border-[#5B7CFA]
              focus:ring-4
              focus:ring-[#5B7CFA]/20

              dark:border-white/10
              dark:bg-[#111827]
              dark:text-white
              dark:placeholder:text-[#64748B]
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
            placeholder="Enter your password"

            className="
              h-12
              w-full

              rounded-2xl

              border
              border-[#D6E0FF]

              bg-[#F8FAFF]

              px-4

              text-[#1E293B]

              outline-none
              transition-all

              placeholder:text-[#94A3B8]

              focus:border-[#5B7CFA]
              focus:ring-4
              focus:ring-[#5B7CFA]/20

              dark:border-white/10
              dark:bg-[#111827]
              dark:text-white
              dark:placeholder:text-[#64748B]
            "

            value={password}

            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          {/* Forgot Password */}
          <div className="text-right">

            <button
              onClick={
                handleForgotPassword
              }

              className="
                text-sm
                font-medium

                text-[#5B7CFA]

                transition-all
                hover:text-[#4A68E8]
                hover:underline

                dark:text-[#8FB3FF]
              "
            >
              Forgot Password?
            </button>

          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}

            className="
              w-full

              rounded-2xl

              bg-gradient-to-r
              from-[#5B7CFA]
              to-[#7C5CFF]

              py-3

              text-lg
              font-semibold
              text-white

              transition-all
              duration-300

              hover:scale-[1.02]
              hover:shadow-[0_8px_25px_rgba(91,124,250,0.45)]
            "
          >
            Login
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

              bg-[#D6E0FF]

              dark:bg-white/10
            "
            />

            <span
              className="
              text-sm

              text-[#94A3B8]

              dark:text-[#64748B]
            "
            >
              OR
            </span>

            <div
              className="
              h-px
              flex-1

              bg-[#D6E0FF]

              dark:bg-white/10
            "
            />

          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}

            className="
              flex
              h-12
              w-full

              items-center
              justify-center
              gap-3

              rounded-2xl

              border
              border-[#D6E0FF]

              bg-white

              font-medium
              text-[#1E293B]

              transition-all

              hover:bg-[#F8FAFF]
              hover:scale-[1.01]

              dark:border-white/10
              dark:bg-[#111827]
              dark:text-white
              dark:hover:bg-[#1E293B]
            "
          >

            <FcGoogle className="text-2xl" />

            Continue with Google

          </button>

        </div>

        {/* Signup Link */}
        <p
          className="
          mt-6
          text-center
          text-sm

          text-[#6B7280]

          dark:text-[#94A3B8]
        "
        >

          Don’t have an account?{" "}

          <Link
            href="/signup"

            className="
              font-semibold

              text-[#5B7CFA]

              transition-all
              hover:text-[#4A68E8]
              hover:underline

              dark:text-[#8FB3FF]
            "
          >
            Sign Up
          </Link>

        </p>

      </div>

    </main>
  );
}