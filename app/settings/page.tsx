"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { useTheme } from "next-themes";

import {
  ArrowLeft,
  MoonStar,
  User,
  LogOut,
} from "lucide-react";

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

      bg-[#F4F7FF]

      px-4
      py-6

      transition-all
      duration-300

      dark:bg-[#020817]

      sm:px-6
      lg:px-8
    "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
        pointer-events-none
        fixed
        inset-0
        overflow-hidden
      "
      >

        <div
          className="
          absolute
          top-[-120px]
          left-[-120px]

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

      {/* HEADER */}

      <div
        className="
        relative
        z-10

        mx-auto
        mb-8

        flex
        max-w-4xl
        items-center
        justify-between
      "
      >

        <div>

          <h1
            className="
            text-3xl
            font-extrabold

            text-[#233B95]

            dark:text-white

            sm:text-4xl
          "
          >
            Settings
          </h1>

          <p
            className="
            mt-1
            text-sm

            text-[#6B7280]

            dark:text-[#94A3B8]
          "
          >
            Personalize your Textify experience ✨
          </p>

        </div>

        {/* BACK BUTTON */}

        <button
          onClick={() =>
            router.push("/homepage")
          }

          className="
          flex
          items-center
          gap-2

          rounded-2xl

          bg-gradient-to-r
          from-[#5B7CFA]
          to-[#7C5CFF]

          px-5
          py-3

          text-sm
          font-semibold
          text-white

          shadow-[0_8px_25px_rgba(91,124,250,0.35)]

          transition-all
          duration-300

          hover:scale-105
        "
        >

          <ArrowLeft size={18} />

          Back

        </button>

      </div>

      {/* SETTINGS CONTENT */}

      <section
        className="
        relative
        z-10

        mx-auto
        flex
        max-w-4xl
        flex-col
        gap-6
      "
      >

        {/* USER PROFILE */}

        <div
          className="
          rounded-[30px]

          border
          border-[#DCE6FF]

          bg-white/90

          p-6

          shadow-[0_10px_35px_rgba(91,124,250,0.10)]

          backdrop-blur-xl

          transition-all
          duration-300

          dark:border-white/10
          dark:bg-[#0F172A]/80
        "
        >

          <div
            className="
            mb-4

            flex
            items-center
            gap-3
          "
          >

            <div
              className="
              rounded-xl

              bg-gradient-to-r
              from-[#5B7CFA]
              to-[#7C5CFF]

              p-3

              text-white
            "
            >

              <User size={20} />

            </div>

            <div>

              <h2
                className="
                text-2xl
                font-bold

                text-[#233B95]

                dark:text-white
              "
              >
                User Profile
              </h2>

              <p
                className="
                text-sm

                text-[#6B7280]

                dark:text-[#94A3B8]
              "
              >
                Logged in account
              </p>

            </div>

          </div>

          <div
            className="
            rounded-2xl

            border
            border-[#DCE6FF]

            bg-[#F8FAFF]

            p-4

            text-[#475569]

            shadow-sm

            dark:border-white/10
            dark:bg-[#020817]
            dark:text-[#CBD5E1]
          "
          >

            {email || "Loading..."}

          </div>

        </div>

        {/* DARK MODE */}

        <div
          className="
          flex
          items-center
          justify-between

          rounded-[30px]

          border
          border-[#DCE6FF]

          bg-white/90

          p-6

          shadow-[0_10px_35px_rgba(91,124,250,0.10)]

          backdrop-blur-xl

          transition-all
          duration-300

          dark:border-white/10
          dark:bg-[#0F172A]/80
        "
        >

          <div
            className="
            flex
            items-center
            gap-3
          "
          >

            <div
              className="
              rounded-xl

              bg-gradient-to-r
              from-[#5B7CFA]
              to-[#7C5CFF]

              p-3

              text-white
            "
            >

              <MoonStar size={20} />

            </div>

            <div>

              <h2
                className="
                text-2xl
                font-bold

                text-[#233B95]

                dark:text-white
              "
              >
                Dark Mode
              </h2>

              <p
                className="
                text-sm

                text-[#6B7280]

                dark:text-[#94A3B8]
              "
              >
                Switch between light and dark theme
              </p>

            </div>

          </div>

          {/* TOGGLE */}

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
                  ? "bg-gradient-to-r from-[#5B7CFA] to-[#7C5CFF]"
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

            </div>

          </button>

        </div>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}

          className="
          flex
          items-center
          justify-center
          gap-3

          rounded-[24px]

          bg-gradient-to-r
          from-[#5B7CFA]
          to-[#7C5CFF]

          px-6
          py-4

          text-lg
          font-semibold
          text-white

          shadow-[0_10px_35px_rgba(91,124,250,0.30)]

          transition-all
          duration-300

          hover:scale-[1.02]
        "
        >

          <LogOut size={20} />

          Logout

        </button>

      </section>

    </main>
  );
}