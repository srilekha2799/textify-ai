import { NextRequest, NextResponse } from "next/server";

import pdfParse from "pdf-parse";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest
) {

  try {

    const formData =
      await req.formData();

    const file =
      formData.get("file") as File;

    if (!file) {

      return NextResponse.json(
        {
          error:
            "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    // Convert file to buffer
    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // Parse PDF
    const pdfData =
      await pdfParse(buffer);

    return NextResponse.json({
      text: pdfData.text,
    });

  } catch (error) {

    console.log(
      "PDF ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "PDF parsing failed",
      },
      {
        status: 500,
      }
    );
  }
}