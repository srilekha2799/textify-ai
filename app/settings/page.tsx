"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { useTheme } from "next-themes";

export default function SettingsPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const { theme, setTheme } =
    useTheme();

  const [mounted, setMounted] =
    useState(false);

  // Prevent hydration mismatch
  useEffect(() => {

    setMounted(true);

  }, []);

  // Fetch Current User
  useEffect(() => {

  const getUser = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(user);

    if (user) {

      setEmail(
        user.user_metadata?.email ||
        user.email ||
        ""
      );
    }
  };

  getUser();

}, []);

  // Logout
  const handleLogout =
    async () => {

      await supabase.auth.signOut();

      router.push("/login");
    };

  if (!mounted) {

    return null;
  }

  return (

    <main
      className="
      min-h-screen
      bg-gradient-to-br
      from-blue-50
      via-white
      to-indigo-100
      dark:from-[#020617]
      dark:via-[#0B1120]
      dark:to-[#172554]
      p-6
      transition-colors
    "
    >

      {/* Header */}
      <div
        className="
        mx-auto
        mb-8
        flex
        max-w-3xl
        items-center
        justify-between
      "
      >

        <h1
          className="
          text-4xl
          font-bold
          text-blue-900
          dark:text-white
        "
        >
          Settings
        </h1>

        <button
          onClick={() =>
            router.push("/homepage")
          }
          className="
            rounded-2xl
            bg-[#4F6EF7]
            px-5
            py-3
            font-medium
            text-white
            transition-all
            hover:scale-105
            hover:bg-[#3D5CE6]
          "
        >
          Back
        </button>

      </div>

      {/* Settings Card */}
      <section
        className="
        mx-auto
        flex
        max-w-3xl
        flex-col
        gap-6
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-8
        shadow-2xl
        transition-colors

        dark:border-white/10
        dark:bg-white/10
        dark:backdrop-blur-xl
      "
      >

        {/* Profile */}
        <div>

          <h2
            className="
            mb-2
            text-2xl
            font-semibold
            text-blue-900
            dark:text-white
          "
          >
            User Profile
          </h2>

          <p
            className="
            text-gray-600
            dark:text-gray-300
          "
          >
            Logged in as:
          </p>

          <p
            className="
            mt-3
            rounded-xl
            bg-gray-100
            p-4
            text-gray-700

            dark:bg-zinc-800
            dark:text-white
          "
          >

            {email || "Loading..."}

          </p>

        </div>

        {/* Dark Mode */}
        <div
          className="
          flex
          items-center
          justify-between
          rounded-2xl
          border
          border-gray-200
          p-5

          dark:border-zinc-700
        "
        >

          <div>

            <h2
              className="
              text-xl
              font-semibold
              text-blue-900
              dark:text-white
            "
            >
              Dark Mode
            </h2>

            <p
              className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
            >
              Switch between light and dark theme
            </p>

          </div>

          <button
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            className={`
              rounded-full
              px-5
              py-2
              font-medium
              text-white
              transition-all

              ${
                theme === "dark"
                  ? "bg-[#5558E8]"
                  : "bg-gray-400"
              }
            `}
          >

            {theme === "dark"
              ? "ON"
              : "OFF"}

          </button>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            rounded-xl
            bg-[#6366F1]
            px-5
            py-3
            font-medium
            text-white
            transition-all
            hover:scale-105
            hover:bg-[#5558E8]
          "
        >

          Logout

        </button>

      </section>

    </main>
  );
}