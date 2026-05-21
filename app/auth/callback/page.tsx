"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AuthCallback() {

  const router = useRouter();

  useEffect(() => {

    const handleAuth =
      async () => {

        const {
          data,
          error,
        } =
          await supabase.auth.getSession();

        console.log(data);

        if (error) {

          console.log(error);

          router.push("/login");

          return;
        }

        if (data.session) {

          router.push("/homepage");

        } else {

          router.push("/login");
        }
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