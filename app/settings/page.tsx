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

      bg-[#EEF4FF]

      p-6

      transition-all
      duration-300

      dark:bg-[#020817]
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

        <div>

          <h1
            className="
            text-4xl
            font-extrabold

            text-[#233B95]

            dark:text-[#8FB3FF]
          "
          >
            Settings
          </h1>

          <p
            className="
            mt-1
            text-sm

            text-gray-500

            dark:text-zinc-400
          "
          >
            Personalize your Textify experience ✨
          </p>

        </div>

        <button
          onClick={() =>
            router.push("/homepage")
          }

          className="
          rounded-2xl

          bg-gradient-to-r
          from-[#5B7CFA]
          to-[#6D8BFF]

          px-5
          py-3

          font-medium
          text-white

          transition-all
          duration-300

          hover:scale-105
          hover:shadow-lg
          hover:shadow-[#5B7CFA]/30
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

        {/* User Profile */}
        <div
          className="
          rounded-3xl

          border
          border-gray-200

          bg-[#F8FAFC]

          p-6

          transition-all

          dark:border-zinc-700
          dark:bg-[#111827]
        "
        >

          <h2
            className="
            mb-2

            text-2xl
            font-bold

            text-[#233B95]

            dark:text-[#8FB3FF]
          "
          >
            User Profile
          </h2>

          <p
            className="
            text-sm

            text-gray-500

            dark:text-zinc-400
          "
          >
            Logged in as:
          </p>

          <div
            className="
            mt-4

            rounded-2xl

            border
            border-gray-200

            bg-white

            p-4

            text-gray-700

            shadow-sm

            dark:border-zinc-700
            dark:bg-[#0B1220]
            dark:text-white
          "
          >

            {email || "Loading..."}

          </div>

        </div>

        {/* Dark Mode */}
        <div
          className="
          flex
          items-center
          justify-between

          rounded-3xl

          border
          border-gray-200

          bg-[#F8FAFC]

          p-6

          transition-all

          dark:border-zinc-700
          dark:bg-[#111827]
        "
        >

          <div>

            <h2
              className="
              text-2xl
              font-bold

              text-[#233B95]

              dark:text-[#8FB3FF]
            "
            >
              Dark Mode
            </h2>

            <p
              className="
              mt-1
              text-sm

              text-gray-500

              dark:text-zinc-400
            "
            >
              Switch between light and dark theme
            </p>

          </div>

          {/* Toggle */}
          <button
            onClick={() =>
              setTheme(
                theme === "dark"
                  ? "light"
                  : "dark"
              )
            }

            className={`
              relative

              flex
              h-12
              w-24

              items-center

              rounded-full

              px-2

              transition-all
              duration-300

              ${
                theme === "dark"
                  ? "bg-gradient-to-r from-[#5B7CFA] to-[#6D8BFF]"
                  : "bg-gray-300"
              }
            `}
          >

            <div
              className={`
                absolute

                flex
                h-9
                w-9

                items-center
                justify-center

                rounded-full

                bg-white

                text-sm
                font-bold

                shadow-md

                transition-all
                duration-300

                ${
                  theme === "dark"
                    ? "translate-x-11 text-[#5B7CFA]"
                    : "translate-x-0 text-gray-500"
                }
              `}
            >

              {theme === "dark"
                ? "🌙"
                : "☀️"}

            </div>

          </button>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}

          className="
          rounded-2xl

          bg-gradient-to-r
          from-[#5B7CFA]
          to-[#6D8BFF]

          px-5
          py-4

          text-lg
          font-semibold
          text-white

          transition-all
          duration-300

          hover:scale-[1.02]
          hover:shadow-lg
          hover:shadow-[#5B7CFA]/30
        "
        >

          Logout

        </button>

      </section>

    </main>
  );
}