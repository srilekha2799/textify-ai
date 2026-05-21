"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function Home() {

  const router = useRouter();

  useEffect(() => {

    const checkUser =
      async () => {

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        setTimeout(() => {

          if (session) {

            router.push("/homepage");

          } else {

            router.push("/login");
          }

        }, 2500);
      };

    checkUser();

  }, [router]);

  return (

    <main className="flex min-h-screen items-center justify-center bg-background overflow-hidden">

      <div className="flex flex-col items-center">

        {/* Animated Logo */}

        <div
          className="
          mb-6
          flex
          h-28
          w-28
          items-center
          justify-center
          rounded-full

          bg-gradient-to-br
          from-[#5B7CFA]
          via-[#7C4DFF]
          to-[#233B95]

          shadow-2xl

          animate-pulse
        "
        >

          <span
            className="
            text-5xl
            font-extrabold
            text-white
          "
          >
            T
          </span>

        </div>

        {/* Animated Textify */}

        <h1
          className="
          overflow-hidden
          whitespace-nowrap

          border-r-4
          border-[#5B7CFA]

          text-6xl
          font-extrabold

          bg-gradient-to-r
          from-[#5B7CFA]
          via-[#7C4DFF]
          to-[#233B95]

          bg-clip-text
          text-transparent

          animate-typing
        "
        >
          Textify
        </h1>

        {/* Tagline */}

        <p
          className="
          mt-4
          text-xl
          font-medium
          text-[#233B95]

          dark:text-[#8FB3FF]
        "
        >
          to simplify text
        </p>

      </div>
    </main>
  );
}