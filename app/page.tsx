"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const [showText, setShowText] =
    useState(false);

  useEffect(() => {

    // Reveal animation
    const revealTimer =
      setTimeout(() => {

        setShowText(true);

      }, 700);

    // Redirect
    const timer = setTimeout(() => {

      router.push("/login");

    }, 3200);

    return () => {

      clearTimeout(timer);

      clearTimeout(revealTimer);
    };

  }, [router]);

  return (

    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      overflow-hidden
      bg-[#EEF4FF]

      dark:bg-[#020817]
    "
    >

      <div className="flex flex-col items-center">

        {/* Logo */}
        <div
          className="
          relative
          flex
          items-center
          justify-center
        "
        >

          {/* T Letter */}
          <div
            className="
            z-10
            text-8xl
            font-extrabold
            tracking-tight

            bg-gradient-to-r
            from-[#5B7CFA]
            via-[#7C5CFF]
            to-[#38BDF8]

            bg-clip-text
            text-transparent

            drop-shadow-[0_0_25px_rgba(91,124,250,0.45)]

            animate-pulse
          "
          >
            T
          </div>

          {/* Reveal Text */}
          <div
            className={`
            overflow-hidden
            transition-all
            duration-1000
            ease-in-out

            ${
              showText
                ? "max-w-[500px] opacity-100 ml-2"
                : "max-w-0 opacity-0 ml-0"
            }
          `}
          >

            <h1
              className="
              whitespace-nowrap
              text-7xl
              font-extrabold
              tracking-tight

              bg-gradient-to-r
              from-[#5B7CFA]
              via-[#7C5CFF]
              to-[#38BDF8]

              bg-clip-text
              text-transparent

              drop-shadow-[0_0_25px_rgba(91,124,250,0.35)]
            "
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
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }
        `}
        >
          simplify smarter ✨
        </p>

      </div>
    </main>
  );
}