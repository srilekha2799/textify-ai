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

      bg-[#F4F7FF]

      px-4
      py-6

      transition-all
      duration-300

      dark:bg-[#020817]

      sm:px-6
      lg:px-8
    "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
        pointer-events-none
        fixed
        inset-0
        overflow-hidden
      "
      >

        <div
          className="
          absolute
          top-[-120px]
          left-[-120px]

          h-[320px]
          w-[320px]

          rounded-full

          bg-[#7C5CFF]/10

          blur-3xl

          dark:bg-[#5B7CFA]/20
        "
        />

        <div
          className="
          absolute
          bottom-[-140px]
          right-[-100px]

          h-[320px]
          w-[320px]

          rounded-full

          bg-[#5B7CFA]/10

          blur-3xl

          dark:bg-[#7C5CFF]/20
        "
        />

      </div>

      {/* HEADER */}

      <div
        className="
        relative
        z-10

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

            dark:text-white

            sm:text-4xl
          "
          >
            History
          </h1>

          <p
            className="
            mt-1
            text-sm

            text-[#6B7280]

            dark:text-[#94A3B8]
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
          to-[#7C5CFF]

          px-5
          py-3

          text-sm
          font-semibold
          text-white

          shadow-[0_8px_25px_rgba(91,124,250,0.35)]

          transition-all
          duration-300

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
        relative
        z-10

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
            rounded-[30px]

            border
            border-[#DCE6FF]

            bg-white/90
            p-8

            text-center

            shadow-[0_10px_40px_rgba(91,124,250,0.12)]

            backdrop-blur-xl

            dark:border-white/10
            dark:bg-[#0F172A]/80
          "
          >

            <p
              className="
              text-[#6B7280]

              dark:text-[#94A3B8]
            "
            >
              Loading history...
            </p>

          </div>

        ) : history.length === 0 ? (

          /* EMPTY */

          <div
            className="
            rounded-[30px]

            border
            border-[#DCE6FF]

            bg-white/90
            p-8

            text-center

            shadow-[0_10px_40px_rgba(91,124,250,0.12)]

            backdrop-blur-xl

            dark:border-white/10
            dark:bg-[#0F172A]/80
          "
          >

            <p
              className="
              text-[#6B7280]

              dark:text-[#94A3B8]
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
              border-[#DCE6FF]

              bg-white/90

              p-6

              shadow-[0_10px_35px_rgba(91,124,250,0.10)]

              backdrop-blur-xl

              transition-all
              duration-300

              hover:-translate-y-1
              hover:shadow-[0_15px_45px_rgba(91,124,250,0.20)]

              dark:border-white/10
              dark:bg-[#0F172A]/80
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

                  text-[#94A3B8]

                  dark:text-[#64748B]
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

                  dark:text-white
                "
                >
                  Original Text
                </h2>

                <p
                  className="
                  line-clamp-3

                  leading-7

                  text-[#475569]

                  dark:text-[#CBD5E1]
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
                    text-[#7C5CFF]
                  "
                  />

                  <h2
                    className="
                    text-lg
                    font-bold

                    text-[#233B95]

                    dark:text-white
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

                  text-[#475569]

                  dark:text-[#CBD5E1]
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
                  font-semibold

                  text-[#5B7CFA]

                  transition-all
                  duration-300

                  hover:text-[#7C5CFF]
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