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
          redirectTo: "http://localhost:3000/homepage",
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
            Welcome Back ✨
          </h1>

          <p
            className="
            mt-2
            text-sm
            text-gray-500
            dark:text-gray-400
          "
          >
            Login to continue
            simplifying smarter
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
            placeholder="Enter your password"
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

          {/* Forgot Password */}
          <div className="text-right">

            <button
              onClick={
                handleForgotPassword
              }
              className="
                text-sm
                text-[#4F6EF7]
                hover:underline
                dark:text-[#7EA6FF]
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
          text-gray-500
          dark:text-gray-400
        "
        >

          Don’t have an account?{" "}

          <Link
            href="/signup"
            className="
              font-semibold
              text-[#4F6EF7]
              hover:underline
              dark:text-[#7EA6FF]
            "
          >
            Sign Up
          </Link>

        </p>

      </div>

    </main>
  );
}