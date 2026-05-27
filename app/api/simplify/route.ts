export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    if (!body.text) {

      return NextResponse.json({
        error: "No text provided",
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          model: "openrouter/auto",

          messages: [
            {
              role: "system",

              content:
                "You simplify difficult text.",
            },

            {
              role: "user",

              content: body.text,
            },
          ],
        }),
      }
    );

    const data =
      await response.json();

    const result =
      data?.choices?.[0]?.message
        ?.content;

    return NextResponse.json({
      result:
        result ||
        "No response generated",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      error:
        "Something went wrong",
    });
  }
}