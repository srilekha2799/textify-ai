"use client";

import { useEffect } from "react";

import { useRouter }
from "next/navigation";

import { supabase }
from "@/lib/supabase";

export default function Home() {

  const router =
    useRouter();

  useEffect(() => {

    const checkUser =
      async () => {

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

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

        }, 3500);
      };

    checkUser();

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

      <div
        className="
        flex
        flex-col
        items-center
      "
      >

        {/* BIG T */}

        <div
          className="
          animate-logoPop

          text-[120px]
          font-black
          leading-none

          bg-gradient-to-b
          from-[#8FB3FF]
          via-[#5B7CFA]
          to-[#233B95]

          bg-clip-text
          text-transparent

          drop-shadow-[0_0_30px_rgba(91,124,250,0.6)]
        "
        >
          T
        </div>

        {/* TEXTIFY */}

        <div
          className="
          overflow-hidden
        "
        >

          <h1
            className="
            animate-textReveal

            whitespace-nowrap

            text-7xl
            font-black
            tracking-wide

            bg-gradient-to-r
            from-[#8FB3FF]
            via-[#5B7CFA]
            to-[#233B95]

            bg-clip-text
            text-transparent

            opacity-0
          "
          >
            Textify
          </h1>

        </div>

        {/* TAGLINE */}

        <p
          className="
          mt-5

          animate-fadeIn

          text-xl
          font-medium

          text-[#233B95]

          opacity-0

          dark:text-[#8FB3FF]
        "
        >
          to simplify text
        </p>

      </div>

      {/* Animations */}

      <style jsx>{`

        @keyframes logoPop {

          0% {
            transform: scale(0.2);
            opacity: 0;
          }

          60% {
            transform: scale(1.15);
            opacity: 1;
          }

          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes textReveal {

          0% {
            width: 0;
            opacity: 0;
          }

          100% {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes fadeIn {

          0% {
            opacity: 0;
            transform: translateY(20px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-logoPop {

          animation:
            logoPop 1.3s ease-out;
        }

        .animate-textReveal {

          display: inline-block;

          animation:
            textReveal 1.8s ease forwards;

          animation-delay: 1s;
        }

        .animate-fadeIn {

          animation:
            fadeIn 1s ease forwards;

          animation-delay: 2.1s;
        }

      `}</style>

    </main>
  );
}