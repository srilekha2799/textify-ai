"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AuthCallback() {

  const router = useRouter();

  useEffect(() => {

    const handleLogin =
      async () => {

        const {
          data,
        } =
          await supabase.auth.getSession();

        console.log(data);

        if (data.session) {

          router.replace(
            "/homepage"
          );

        } else {

          router.replace(
            "/login"
          );
        }
      };

    handleLogin();

  }, [router]);

  return (

    <main className="flex min-h-screen items-center justify-center">

      <h1 className="text-2xl font-bold">

        Signing in...

      </h1>

    </main>
  );
}