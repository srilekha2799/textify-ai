"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  Clock3,
  Sparkles,
} from "lucide-react";

interface HistoryItem {

  id: string;

  input_text: string;

  output_text: string;

  created_at: string;
}

export default function HistoryPage() {

  const router = useRouter();

  const [history, setHistory] =
    useState<HistoryItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  // Fetch History
  const fetchHistory =
    async () => {

      const {
        data,
        error,
      } = await supabase
        .from("history")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (!error && data) {

        setHistory(data);
      }

      setLoading(false);
    };

  useEffect(() => {

    fetchHistory();

  }, []);

  return (

    <main
      className="
      min-h-screen

      bg-[#EEF4FF]

      px-4
      py-6

      transition-all
      duration-300

      dark:bg-[#020817]

      sm:px-6
      lg:px-8
    "
    >

      {/* HEADER */}

      <div
        className="
        mx-auto
        mb-8

        flex
        max-w-5xl
        items-center
        justify-between
      "
      >

        <div>

          <h1
            className="
            text-3xl
            font-extrabold

            text-[#233B95]

            dark:text-[#8FB3FF]

            sm:text-4xl
          "
          >
            History
          </h1>

          <p
            className="
            mt-1
            text-sm

            text-gray-500

            dark:text-zinc-400
          "
          >
            Your previous simplified notes ✨
          </p>

        </div>

        {/* BACK BUTTON */}

        <button
          onClick={() =>
            router.push("/homepage")
          }

          className="
          flex
          items-center
          gap-2

          rounded-2xl

          bg-gradient-to-r
          from-[#5B7CFA]
          to-[#4A68E8]

          px-5
          py-3

          text-sm
          font-semibold
          text-white

          shadow-lg

          transition-all
          hover:scale-105
        "
        >

          <ArrowLeft size={18} />

          Back

        </button>

      </div>

      {/* CONTENT */}

      <section
        className="
        mx-auto
        flex
        max-w-5xl
        flex-col
        gap-5
      "
      >

        {/* LOADING */}

        {loading ? (

          <div
            className="
            rounded-3xl

            bg-white
            p-8

            text-center

            shadow-xl

            dark:bg-[#0F172A]
          "
          >

            <p
              className="
              text-gray-500

              dark:text-zinc-400
            "
            >
              Loading history...
            </p>

          </div>

        ) : history.length === 0 ? (

          /* EMPTY */

          <div
            className="
            rounded-3xl

            bg-white
            p-8

            text-center

            shadow-xl

            dark:bg-[#0F172A]
          "
          >

            <p
              className="
              text-gray-500

              dark:text-zinc-400
            "
            >
              No history found.
            </p>

          </div>

        ) : (

          history.map((item) => (

            <div
              key={item.id}

              onClick={() =>
                router.push(
                  `/history/${item.id}`
                )
              }

              className="
              cursor-pointer

              rounded-[30px]

              border
              border-gray-200

              bg-white

              p-6

              shadow-lg

              transition-all
              duration-300

              hover:-translate-y-1
              hover:shadow-2xl

              dark:border-zinc-800
              dark:bg-[#0F172A]
            "
            >

              {/* DATE */}

              <div
                className="
                mb-4

                flex
                items-center
                gap-2
              "
              >

                <Clock3
                  size={16}
                  className="
                  text-[#5B7CFA]
                "
                />

                <p
                  className="
                  text-sm

                  text-gray-400

                  dark:text-zinc-500
                "
                >
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </p>

              </div>

              {/* ORIGINAL */}

              <div className="mb-5">

                <h2
                  className="
                  mb-2

                  text-lg
                  font-bold

                  text-[#233B95]

                  dark:text-[#8FB3FF]
                "
                >
                  Original Text
                </h2>

                <p
                  className="
                  line-clamp-3

                  leading-7

                  text-gray-700

                  dark:text-gray-300
                "
                >
                  {item.input_text}
                </p>

              </div>

              {/* SIMPLIFIED */}

              <div>

                <div
                  className="
                  mb-2

                  flex
                  items-center
                  gap-2
                "
                >

                  <Sparkles
                    size={18}
                    className="
                    text-[#5B7CFA]
                  "
                  />

                  <h2
                    className="
                    text-lg
                    font-bold

                    text-[#233B95]

                    dark:text-[#8FB3FF]
                  "
                  >
                    Simplified Notes
                  </h2>

                </div>

                <p
                  className="
                  line-clamp-4
                  whitespace-pre-wrap

                  leading-7

                  text-gray-700

                  dark:text-gray-300
                "
                >
                  {item.output_text}
                </p>

              </div>

              {/* OPEN HINT */}

              <div
                className="
                mt-5

                text-right
              "
              >

                <span
                  className="
                  text-sm
                  font-medium

                  text-[#5B7CFA]
                "
                >
                  Tap to view full →
                </span>

              </div>

            </div>
          ))
        )}

      </section>

    </main>
  );
}