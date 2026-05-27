"use client";

import { useEffect, useState }
from "react";

import { useRouter }
from "next/navigation";

import { supabase }
from "@/lib/supabase";

export default function Home() {

  const router =
    useRouter();

  const [showText,
    setShowText] =
      useState(false);

  useEffect(() => {

    const checkUser =
      async () => {

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        // Reveal animation
        const revealTimer =
          setTimeout(() => {

            setShowText(true);

          }, 700);

        // Redirect
        const redirectTimer =
          setTimeout(() => {

            if (session) {

              router.push(
                "/homepage"
              );

            } else {

              router.push(
                "/login"
              );
            }

          }, 3200);

        return () => {

          clearTimeout(
            revealTimer
          );

          clearTimeout(
            redirectTimer
          );
        };
      };

    checkUser();

  }, [router]);

  return (

    <main
      className={`
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden

        bg-[#EEF4FF]

        dark:bg-[#020817]
      `}
    >

      {/* Background Glow */}

      <div
        className={`
          absolute
          h-[420px]
          w-[420px]
          rounded-full

          bg-[#5B7CFA]/20

          blur-3xl
        `}
      />

      <div
        className={`
          relative
          z-10

          flex
          flex-col
          items-center
        `}
      >

        {/* Logo */}

        <div
          className={`
            relative
            flex
            items-center
            justify-center
          `}
        >

          {/* T */}

          <div
            className={`
              z-10

              text-8xl
              font-black
              tracking-tight

              bg-gradient-to-r
              from-[#5B7CFA]
              via-[#7C5CFF]
              to-[#38BDF8]

              bg-clip-text
              text-transparent

              drop-shadow-[0_0_35px_rgba(91,124,250,0.55)]

              transition-all
              duration-700

              ${
                showText
                  ? `
                    scale-100
                  `
                  : `
                    scale-[1.25]
                  `
              }
            `}
          >
            T
          </div>

          {/* extify Reveal */}

          <div
            className={`
              overflow-hidden

              transition-all
              duration-[1400ms]
              ease-[cubic-bezier(0.16,1,0.3,1)]

              ${
                showText
                  ? `
                    max-w-[500px]
                    opacity-100
                    ml-1
                  `
                  : `
                    max-w-0
                    opacity-0
                    ml-0
                  `
              }
            `}
          >

            <h1
              className={`
                whitespace-nowrap

                text-7xl
                font-black
                tracking-tight

                bg-gradient-to-r
                from-[#5B7CFA]
                via-[#7C5CFF]
                to-[#38BDF8]

                bg-clip-text
                text-transparent

                drop-shadow-[0_0_25px_rgba(91,124,250,0.35)]
              `}
            >
              extify
            </h1>

          </div>

        </div>

        {/* Tagline */}

        <p
          className={`
            mt-5

            text-lg
            font-medium
            tracking-wide

            text-[#233B95]

            transition-all
            duration-1000

            dark:text-[#8FB3FF]

            ${
              showText
                ? `
                  translate-y-0
                  opacity-100
                `
                : `
                  translate-y-5
                  opacity-0
                `
            }
          `}
        >
          simplify smarter
        </p>

      </div>

    </main>
  );
}