"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AuthCallback() {

  const router = useRouter();

  useEffect(() => {

    const handleAuth = async () => {

      // Wait a little for session restore
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log("SESSION:", session);

      if (error) {

        console.log(error);

        router.replace("/login");

        return;
      }

      // User logged in
      if (session?.user) {

        router.replace("/homepage");

      } else {

        router.replace("/login");
      }
    };

    handleAuth();

  }, [router]);

  return (

    <main className="flex min-h-screen items-center justify-center bg-background">

      <div className="flex flex-col items-center gap-4">

        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#5B7CFA] border-t-transparent"></div>

        <h1 className="text-2xl font-bold text-primary">

          Signing you in...

        </h1>

      </div>

    </main>
  );
}