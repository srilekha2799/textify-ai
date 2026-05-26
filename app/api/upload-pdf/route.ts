import {
  NextRequest,
  NextResponse,
} from "next/server";

import fs from "fs";
import path from "path";
import PDFParser from "pdf2json";

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

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // Temp file path
    const tempPath =
      path.join(
        process.cwd(),
        "temp.pdf"
      );

    fs.writeFileSync(
      tempPath,
      buffer
    );

    const pdfParser =
      new PDFParser();

    const text =
      await new Promise<string>(
        (
          resolve,
          reject
        ) => {

          pdfParser.on(
            "pdfParser_dataError",
            (errData) => {

              reject(
                errData.parserError
              );
            }
          );

          pdfParser.on(
            "pdfParser_dataReady",
            () => {

              const rawText =
                pdfParser.getRawTextContent();

              resolve(rawText);
            }
          );

          pdfParser.loadPDF(
            tempPath
          );
        }
      );

    // Delete temp file
    fs.unlinkSync(tempPath);

    return NextResponse.json({
      text,
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