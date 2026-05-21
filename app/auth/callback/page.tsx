"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AuthCallback() {

  const router = useRouter();

  useEffect(() => {

    const handleAuth =
      async () => {

        // Wait for Supabase
        await supabase.auth.getSession();

        setTimeout(async () => {

          const {
            data: { session },
          } =
            await supabase.auth.getSession();

          if (session) {

            router.replace(
              "/homepage"
            );

          } else {

            router.replace(
              "/login"
            );
          }

        }, 2000);
      };

    handleAuth();

  }, [router]);

  return (

    <main className="flex min-h-screen items-center justify-center bg-background">

      <h1 className="text-2xl font-bold text-primary">

        Signing you in...

      </h1>

    </main>
  );
}