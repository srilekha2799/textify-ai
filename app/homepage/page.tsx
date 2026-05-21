"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  Mic,
  MicOff,
  Paperclip,
  Camera,
  ImagePlus,
  FileText,
} from "lucide-react";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Homepage() {

  const router = useRouter();

  const [inputText, setInputText] =
    useState("");

  const [outputText, setOutputText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [
    showUploadMenu,
    setShowUploadMenu,
  ] = useState(false);

  useEffect(() => {

    setMounted(true);

  }, []);

  // Speech Recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Voice → Text
  useEffect(() => {

    if (transcript) {

      setInputText(transcript);
    }

  }, [transcript]);

  // Logout
  const handleLogout = async () => {

    await supabase.auth.signOut();

    router.push("/login");
  };

  // Image Upload OCR
  const handleImageUpload =
    async (file: File) => {

      setUploading(true);

      try {

        const Tesseract =
          (
            await import(
              "tesseract.js"
            )
          ).default;

        const {
          data: { text },
        } =
          await Tesseract.recognize(
            file,
            "eng"
          );

        setInputText(text);

      } catch (error) {

        console.log(error);

        alert(
          "Image scan failed"
        );
      }

      setUploading(false);
    };

  // PDF Upload
  const handlePDFUpload =
    async (file: File) => {

      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      try {

        const response =
          await fetch(
            "/api/upload-pdf",
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (data.text) {

          setInputText(
            data.text
          );

        } else {

          alert(
            data.error ||
              "PDF upload failed"
          );
        }

      } catch (error) {

        console.log(error);

        alert(
          "PDF upload failed"
        );
      }

      setUploading(false);
    };

  // Simplify Text
  const handleSimplify =
    async () => {

      if (!inputText) {

        alert(
          "Please enter text"
        );

        return;
      }

      setLoading(true);

      try {

        const response =
          await fetch(
            "/api/simplify",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                text: inputText,
              }),
            }
          );

        const data =
          await response.json();

        setOutputText(
          data.result ||
            "No response generated"
        );

        // Current User
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        // Save History
        if (user) {

          await supabase
            .from("history")
            .insert([
              {
                user_id:
                  user.id,

                input_text:
                  inputText,

                output_text:
                  data.result,
              },
            ]);
        }

      } catch (error) {

        console.log(error);

        alert(
          "Something went wrong"
        );
      }

      setLoading(false);
    };

  return (

    <main className="min-h-screen bg-[#EEF4FF] transition-all duration-300 dark:bg-[#020817]">

      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5 shadow-sm dark:border-zinc-800 dark:bg-[#0F172A]">

        <h1 className="text-3xl font-extrabold tracking-wide text-[#5B7CFA]">

          Textify

        </h1>

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              router.push(
                "/history"
              )
            }
            className="rounded-2xl border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-[#111827] dark:text-white dark:hover:bg-zinc-800"
          >

            History

          </button>

          <button
            onClick={() =>
              router.push(
                "/settings"
              )
            }
            className="rounded-2xl border border-gray-300 bg-white px-5 py-2 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-[#111827] dark:text-white dark:hover:bg-zinc-800"
          >

            Settings

          </button>

          <button
            onClick={
              handleLogout
            }
            className="rounded-2xl bg-[#5B7CFA] px-5 py-2 font-medium text-white transition hover:bg-[#4A68E8]"
          >

            Logout

          </button>

        </div>
      </nav>

      {/* Main */}
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row">

        {/* Input Card */}
        <div className="flex-1 rounded-[32px] bg-white p-8 shadow-2xl dark:bg-[#0F172A]">

          <h2 className="mb-6 text-3xl font-bold text-[#233B95] dark:text-[#8FB3FF]">

            Enter Text

          </h2>

          {/* Textarea */}
          <div className="relative">

            <textarea
              placeholder="Enter text..."
              value={inputText}
              onChange={(e) =>
                setInputText(
                  e.target.value
                )
              }
              className="
              h-80
              w-full
              resize-none
              rounded-3xl
              border
              border-gray-300
              bg-[#F8FAFC]
              p-5
              pr-32
              text-lg
              text-gray-800
              outline-none
              transition
              focus:border-[#5B7CFA]

              dark:border-zinc-700
              dark:bg-[#111827]
              dark:text-white
              dark:placeholder:text-zinc-500
            "
            />

            {/* Upload Menu */}
            <div className="absolute bottom-4 right-16">

              <button
                onClick={() =>
                  setShowUploadMenu(
                    !showUploadMenu
                  )
                }
                className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#5B7CFA]
                text-white
                transition
                hover:bg-[#4A68E8]
              "
              >

                <Paperclip
                  size={20}
                />

              </button>

              {/* Dropdown */}
              {showUploadMenu && (

                <div
                  className="
                  absolute
                  bottom-14
                  right-0
                  flex
                  w-52
                  flex-col
                  gap-2
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  p-3
                  shadow-2xl

                  dark:border-zinc-700
                  dark:bg-[#111827]
                "
                >

                  {/* Camera */}
                  <label
                    className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-100

                    dark:text-white
                    dark:hover:bg-zinc-800
                  "
                  >

                    <Camera
                      size={18}
                    />

                    Open Camera

                    <input
                      type="file"
                      accept="image/*"
                      capture
                      className="hidden"

                      onChange={(e) => {

                        const file =
                          e.target
                            .files?.[0];

                        if (file) {

                          handleImageUpload(
                            file
                          );

                          setShowUploadMenu(
                            false
                          );
                        }
                      }}
                    />

                  </label>

                  {/* Image */}
                  <label
                    className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-100

                    dark:text-white
                    dark:hover:bg-zinc-800
                  "
                  >

                    <ImagePlus
                      size={18}
                    />

                    Upload Image

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"

                      onChange={(e) => {

                        const file =
                          e.target
                            .files?.[0];

                        if (file) {

                          handleImageUpload(
                            file
                          );

                          setShowUploadMenu(
                            false
                          );
                        }
                      }}
                    />

                  </label>

                  {/* PDF */}
                  <label
                    className="
                    flex
                    cursor-pointer
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-100

                    dark:text-white
                    dark:hover:bg-zinc-800
                  "
                  >

                    <FileText
                      size={18}
                    />

                    Upload PDF

                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"

                      onChange={(e) => {

                        const file =
                          e.target
                            .files?.[0];

                        if (file) {

                          handlePDFUpload(
                            file
                          );

                          setShowUploadMenu(
                            false
                          );
                        }
                      }}
                    />

                  </label>

                </div>
              )}
            </div>

            {/* Mic */}
            {mounted &&
              browserSupportsSpeechRecognition && (

              <button
                onClick={() => {

                  if (
                    listening
                  ) {

                    SpeechRecognition.stopListening();

                  } else {

                    resetTranscript();

                    SpeechRecognition.startListening(
                      {
                        continuous: true,
                      }
                    );
                  }
                }}

                className={`absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full transition

                ${
                  listening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-[#5B7CFA] text-white"
                }
                `}
              >

                {listening ? (
                  <MicOff
                    size={20}
                  />
                ) : (
                  <Mic
                    size={20}
                  />
                )}

              </button>
            )}
          </div>

          {/* Simplify */}
          <button
            onClick={
              handleSimplify
            }
            disabled={loading}
            className="mt-7 w-full rounded-3xl bg-[#5B7CFA] py-4 text-lg font-semibold text-white transition hover:bg-[#4A68E8] disabled:opacity-70"
          >

            {loading
              ? "Simplifying..."
              : uploading
              ? "Uploading..."
              : "Simplify Text"}

          </button>
        </div>

        {/* Output Card */}
        <div className="flex-1 rounded-[32px] bg-white p-8 shadow-2xl dark:bg-[#0F172A]">

          <h2 className="mb-6 text-3xl font-bold text-[#233B95] dark:text-[#8FB3FF]">

            AI Response

          </h2>

          <div className="h-80 overflow-y-auto rounded-3xl border border-gray-300 bg-[#F8FAFC] p-5 dark:border-zinc-700 dark:bg-[#111827]">

            {outputText ? (

              <p className="whitespace-pre-wrap leading-8 text-gray-700 dark:text-gray-200">

                {outputText}

              </p>

            ) : (

              <div className="flex h-full items-center justify-center">

                <p className="text-gray-400 dark:text-zinc-500">

                  AI simplified text will appear here...

                </p>

              </div>

            )}

          </div>
        </div>
      </section>
    </main>
  );
}