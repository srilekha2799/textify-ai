"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface HistoryItem {
  id: string;
  input_text: string;
  output_text: string;
  created_at: string;
}

export default function HistoryPage() {

  const router = useRouter();

  const [history, setHistory] = useState<
    HistoryItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  // Fetch History
  const fetchHistory = async () => {

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

    <main className="min-h-screen bg-background p-6">

      {/* Header */}
      <div className="mx-auto mb-8 flex max-w-5xl items-center justify-between">

        <h1 className="text-4xl font-bold text-primary">
          History
        </h1>

        <button
          onClick={() =>
            router.push("/homepage")
          }
          className="rounded-2xl bg-primary px-5 py-3 font-medium text-white hover:opacity-90"
        >
          Back
        </button>
      </div>

      {/* Content */}
      <section className="mx-auto flex max-w-5xl flex-col gap-5">

        {loading ? (

          <div className="rounded-3xl bg-white p-6 text-center shadow">

            <p className="text-gray-500">
              Loading history...
            </p>

          </div>

        ) : history.length === 0 ? (

          <div className="rounded-3xl bg-white p-6 text-center shadow">

            <p className="text-gray-500">
              No history found.
            </p>

          </div>

        ) : (

          history.map((item) => (

            <div
              key={item.id}
              className="cursor-pointer rounded-3xl bg-white p-6 shadow transition hover:scale-[1.01]"
            >

              {/* Timestamp */}
              <p className="mb-3 text-sm text-gray-400">

                {new Date(
                  item.created_at
                ).toLocaleString()}

              </p>

              {/* Input */}
              <div className="mb-4">

                <h2 className="mb-2 text-lg font-semibold text-[#233B95]">
                  Original Text
                </h2>

                <p className="line-clamp-3 text-gray-700">
                  {item.input_text}
                </p>

              </div>

              {/* Output */}
              <div>

                <h2 className="mb-2 text-lg font-semibold text-[#233B95]">
                  Simplified Notes
                </h2>

                <p className="line-clamp-4 whitespace-pre-wrap text-gray-700">
                  {item.output_text}
                </p>

              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}