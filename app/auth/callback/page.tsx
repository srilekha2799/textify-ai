"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AuthCallback() {

  const router = useRouter();

  useEffect(() => {

    const handleAuth =
      async () => {

        // Wait a little for session
        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        const {
          data: { session },
          error,
        } =
          await supabase.auth.getSession();

        console.log(
          "SESSION:",
          session
        );

        console.log(
          "ERROR:",
          error
        );

        if (session) {

          router.replace(
            "/homepage"
          );

        } else {

          router.replace(
            "/login"
          );
        }
      };

    handleAuth();

  }, [router]);

  return (

    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-[#EEF4FF]

      dark:bg-[#020817]
    "
    >

      <h1
        className="
        text-3xl
        font-bold
        text-[#5B7CFA]
      "
      >

        Signing you in...

      </h1>

    </main>
  );
}