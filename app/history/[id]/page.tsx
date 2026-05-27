"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function HistoryDetail() {

  const params = useParams();

  const [history, setHistory] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchHistory =
      async () => {

        const { data, error } =
          await supabase
            .from("history")
            .select("*")
            .eq("id", params.id)
            .single();

        if (!error) {

          setHistory(data);
        }

        setLoading(false);
      };

    fetchHistory();

  }, [params.id]);

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center">

        <p className="text-xl">
          Loading...
        </p>

      </main>
    );
  }

  if (!history) {

    return (

      <main className="flex min-h-screen items-center justify-center">

        <p className="text-xl">
          No history found
        </p>

      </main>
    );
  }

  return (

    <main
      className="
      min-h-screen

      bg-[#EEF4FF]
      px-5
      py-8

      dark:bg-[#020817]
    "
    >

      <div
        className="
        mx-auto
        max-w-4xl

        rounded-3xl

        bg-white
        p-8

        shadow-xl

        dark:bg-[#0F172A]
      "
      >

        {/* Date */}

        <p
          className="
          mb-6
          text-sm
          text-gray-500
        "
        >
          {new Date(
            history.created_at
          ).toLocaleString()}
        </p>

        {/* Original */}

        <div className="mb-8">

          <h2
            className="
            mb-3
            text-2xl
            font-bold

            text-[#233B95]

            dark:text-[#8FB3FF]
          "
          >
            Original Text
          </h2>

          <div
            className="
            rounded-2xl

            bg-[#F8FAFC]
            p-5

            dark:bg-[#111827]
          "
          >

            <p
              className="
              whitespace-pre-wrap
              leading-8

              text-gray-700

              dark:text-gray-200
            "
            >
              {history.input_text}
            </p>

          </div>

        </div>

        {/* Simplified */}

        <div>

          <h2
            className="
            mb-3
            text-2xl
            font-bold

            text-[#233B95]

            dark:text-[#8FB3FF]
          "
          >
            Simplified Notes
          </h2>

          <div
            className="
            rounded-2xl

            bg-[#F8FAFC]
            p-5

            dark:bg-[#111827]
          "
          >

            <p
              className="
              whitespace-pre-wrap
              leading-8

              text-gray-700

              dark:text-gray-200
            "
            >
              {history.output_text}
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}